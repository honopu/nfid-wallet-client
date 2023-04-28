import { SignIdentity } from "@dfinity/agent"
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
} from "@dfinity/identity"
import { BehaviorSubject, Subscription } from "rxjs"

import { agent } from "../agent"
import { isDelegationExpired } from "../agent/is-delegation-expired"
import { requestFEDelegation } from "./frontend-delegation"
import { setupSessionManager } from "./session-handling"
import { authStorage, KEY_STORAGE_DELEGATION, KEY_STORAGE_KEY } from "./storage"

interface ObservableAuthState {
  cacheLoaded: boolean
  //
  identity?: SignIdentity // Device Identity (different for each device and browser combination)
  delegationIdentity?: DelegationIdentity // User Identity (unique across all users devices)
  //
  // This is only required to remote authenticate via post message channel
  chain?: DelegationChain
  sessionKey?: Ed25519KeyIdentity
}

const observableAuthState$ = new BehaviorSubject<ObservableAuthState>({
  cacheLoaded: false,
})

observableAuthState$.subscribe({
  error(err) {
    console.error("observableAuthState: something went wrong:", { err })
  },
  complete() {
    console.debug("observableAuthState done")
  },
})

type SetProps = {
  identity?: SignIdentity
  delegationIdentity: DelegationIdentity
  chain?: DelegationChain | undefined
  sessionKey?: Ed25519KeyIdentity | undefined
}

function makeAuthState() {
  let pendingRenewDelegation = false
  _loadAuthSessionFromCache()

  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.resetAuthState = invalidateIdentity
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.setAuthState = _setAuthSession
  }

  async function _loadAuthSessionFromCache() {
    const sessionKey = await authStorage.get(KEY_STORAGE_KEY)
    const chain = await authStorage.get(KEY_STORAGE_DELEGATION)
    if (!sessionKey || !chain) {
      return observableAuthState$.next({
        cacheLoaded: true,
      })
    }

    const delegationIdentity = DelegationIdentity.fromDelegation(
      Ed25519KeyIdentity.fromJSON(sessionKey),
      DelegationChain.fromJSON(chain),
    )

    if (isDelegationExpired(delegationIdentity)) {
      return observableAuthState$.next({
        cacheLoaded: true,
      })
    }

    replaceIdentity(delegationIdentity)

    console.debug("_hydrate", {
      principalId: delegationIdentity.getPrincipal().toText(),
    })

    observableAuthState$.next({
      cacheLoaded: true,
      delegationIdentity,
    })
  }

  async function _setAuthSession(authState: {
    delegation: string
    identity: string
  }) {
    console.debug("_setAuthSession", { authState })
    await Promise.all([
      authStorage.set(KEY_STORAGE_KEY, authState.identity),
      authStorage.set(KEY_STORAGE_DELEGATION, authState.delegation),
    ])
    _loadAuthSessionFromCache()
  }

  async function _clearAuthSessionFromCache() {
    await Promise.all([
      authStorage.remove(KEY_STORAGE_KEY),
      authStorage.remove(KEY_STORAGE_DELEGATION),
    ])
  }

  async function loadCachedAuthSession() {
    let sub: Subscription | undefined
    return new Promise<ObservableAuthState & { cacheLoaded: true }>(
      (resolve) => {
        sub = subscribe((state) => {
          if (state.cacheLoaded === true) {
            sub && sub.unsubscribe()
            const { delegationIdentity } = state
            const isExpired = isDelegationExpired(delegationIdentity)
            console.debug("loadCachedAuthSession", { isExpired })
            resolve({
              ...state,
              ...(isExpired
                ? { delegationIdentity: undefined }
                : { delegationIdentity }),
              cacheLoaded: true,
            })
          }
        })
      },
    )
  }

  function set({ identity, delegationIdentity, chain, sessionKey }: SetProps) {
    setupSessionManager({ onIdle: invalidateIdentity })
    observableAuthState$.next({
      ...observableAuthState$.getValue(),
      identity,
      delegationIdentity,
      chain,
      sessionKey,
    })
    replaceIdentity(delegationIdentity)
  }
  function get() {
    checkAndRenewFEDelegation()
    return observableAuthState$.getValue()
  }
  async function reset() {
    await _clearAuthSessionFromCache()
    console.debug("invalidateIdentity")
    agent.invalidateIdentity()
    observableAuthState$.next({
      cacheLoaded: true,
    })
  }
  function subscribe(next: (state: ObservableAuthState) => void) {
    return observableAuthState$.subscribe(next)
  }

  function checkAndRenewFEDelegation() {
    const { delegationIdentity, identity } = observableAuthState$.getValue()

    if (!delegationIdentity || !identity || pendingRenewDelegation) return

    if (isDelegationExpired(delegationIdentity)) {
      pendingRenewDelegation = true

      return requestFEDelegation(identity)
        .then((result) => {
          pendingRenewDelegation = false
          set({
            identity,
            delegationIdentity: result.delegationIdentity,
            chain: result.chain,
            sessionKey: result.sessionKey,
          })
        })
        .catch((e) => {
          console.error("checkDelegationExpiration", e)
          invalidateIdentity()
        })
    }
    return
  }

  /**
   * When user disconnects an identity, we update our agent.
   */
  async function invalidateIdentity() {
    await reset()
    window.location.reload()
  }
  return {
    set,
    get,
    reset,
    subscribe,
    loadCachedAuthSession,
    checkAndRenewFEDelegation,
    logout: invalidateIdentity,
  }
}

export const authState = makeAuthState()

/**
 * When user connects an identity, we update our agent.
 */
export function replaceIdentity(identity: SignIdentity) {
  agent.replaceIdentity(identity)
  agent.getPrincipal().then((principal) => {
    console.debug("replaceIdentity", { principalId: principal.toText() })
  })
}
