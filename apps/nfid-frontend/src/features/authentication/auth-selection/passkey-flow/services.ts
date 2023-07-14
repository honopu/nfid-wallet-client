import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer"
import { DelegationIdentity, WebAuthnIdentity } from "@dfinity/identity"
import * as decodeHelpers from "@simplewebauthn/server/helpers"
import base64url from "base64url"
import CBOR from "cbor"
import { toHexString } from "packages/integration/src/lib/lambda/ecdsa"

import {
  DeviceType,
  IClientDataObj,
  IPasskeyMetadata,
  Icon,
  LambdaPasskeyDecoded,
  authState,
  getPasskey,
  im,
  requestFEDelegationChain,
  storePasskey,
} from "@nfid/integration"

import {
  createPasskeyAccessPoint,
  fetchProfile,
} from "frontend/integration/identity-manager"
import { MultiWebAuthnIdentity } from "frontend/integration/identity/multiWebAuthnIdentity"
import { getBrowser } from "frontend/ui/utils"

export class PasskeyConnector {
  private async storePasskey({
    key,
    data,
  }: LambdaPasskeyDecoded): Promise<void> {
    const jsonData = JSON.stringify({
      ...data,
      credentialId: data.credentialId,
      aaguid: base64url.encode(Buffer.from(data.aaguid)),
      publicKey: toHexString(data.publicKey),
    })

    const identity = WebAuthnIdentity.fromJSON(
      JSON.stringify({
        rawId: Buffer.from(data.credentialId).toString("hex"),
        publicKey: Buffer.from(data.publicKey).toString("hex"),
      }),
    )

    await storePasskey(key, jsonData)
    await createPasskeyAccessPoint({
      browser: getBrowser(),
      device: "aaguid device name",
      deviceType: DeviceType.Passkey,
      icon: Icon.usb,
      principal: identity.getPrincipal().toText(),
      credential_id: [data.credentialStringId],
    })
  }

  async getPasskeyByCredentialID(key: string[]): Promise<IPasskeyMetadata> {
    const passkey = await getPasskey(key)
    const decodedObject = JSON.parse(passkey[0].data)

    return {
      ...decodedObject,
      credentialId: base64url.toBuffer(decodedObject.credentialId),
      aaguid: base64url.toBuffer(decodedObject.aaguid),
      publicKey: fromHexString(decodedObject.publicKey),
    }
  }

  async createCredential({ isMultiDevice }: { isMultiDevice: boolean }) {
    const { delegationIdentity } = authState.get()
    if (!delegationIdentity) throw new Error("Delegation identity not found")

    const { data: imDevices } = await im.read_access_points()
    if (!imDevices?.length) throw new Error("No devices found")
    const passkeys = imDevices[0].filter(
      (d) =>
        DeviceType.Passkey in d.device_type ||
        DeviceType.Unknown in d.device_type,
    )

    const allCredentials: string[] = passkeys
      .map((d) => d.credential_id.join(""))
      .filter((d) => d.length)

    const passkeysMetadata: LambdaPasskeyDecoded[] = allCredentials.length
      ? (await getPasskey(allCredentials)).map((p) => ({
          key: p.key,
          data: JSON.parse(p.data),
        }))
      : []

    console.log({ passkeysMetadata })

    const credential = (await navigator.credentials.create({
      publicKey: {
        authenticatorSelection: {
          authenticatorAttachment: isMultiDevice
            ? "cross-platform"
            : "platform",
          userVerification: "preferred",
          residentKey: "required",
        },
        excludeCredentials: passkeysMetadata.map((p) => ({
          id: p.data.credentialId,
          type: "public-key",
          transports: p.data.transports,
        })),
        attestation: "direct",
        challenge: Buffer.from(JSON.stringify(delegationIdentity)),
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        rp: {
          name: "NFID",
          id: window.location.hostname,
        },
        user: {
          id: delegationIdentity.getPublicKey().toDer(), //take root id from the account
          name: "10:26@" + String((await fetchProfile()).anchor),
          displayName: "displayemail@email.com",
        },
      },
    })) as PublicKeyCredential

    const lambdaRequest = this.decodePublicKeyCredential(
      credential,
      isMultiDevice,
    )

    return await this.storePasskey(lambdaRequest)
  }

  async loginWithPasskey(signal?: AbortSignal, callback?: () => void) {
    const multiIdent = MultiWebAuthnIdentity.fromCredentials(
      [],
      false,
      "required",
      signal,
    )

    const { sessionKey, chain } = await requestFEDelegationChain(multiIdent)

    const delegationIdentity = DelegationIdentity.fromDelegation(
      sessionKey,
      chain,
    )

    callback && callback()

    authState.set({
      identity: multiIdent._actualIdentity!,
      delegationIdentity,
      chain,
      sessionKey,
    })
  }

  async initPasskeyAutocomplete(signal?: AbortSignal) {
    const multiIdent = MultiWebAuthnIdentity.fromCredentials(
      [],
      false,
      "conditional",
      signal,
    )
    const { sessionKey, chain } = await requestFEDelegationChain(multiIdent)

    const delegationIdentity = DelegationIdentity.fromDelegation(
      sessionKey,
      chain,
    )

    authState.set({
      identity: multiIdent._actualIdentity!,
      delegationIdentity,
      chain,
      sessionKey,
    })
  }

  private decodePublicKeyCredential(
    credential: PublicKeyCredential,
    isMultiDevice?: boolean,
  ) {
    const utf8Decoder = new TextDecoder("utf-8")
    const decodedClientData = utf8Decoder.decode(
      credential.response.clientDataJSON,
    )
    const clientDataObj: IClientDataObj = JSON.parse(decodedClientData)

    const decodedAttestationObject = CBOR.decode(
      (credential.response as any).attestationObject,
    )
    const { authData } = decodedAttestationObject

    // includes flags, and all other data
    let authDataParsed = decodeHelpers.parseAuthenticatorData(authData)

    // authDataParsed.credentialPublicKey

    const passkeyMetadata: IPasskeyMetadata = {
      name: "Some editable name or keychain title",
      type: isMultiDevice ? "cross-platform" : "platform",
      flags: {
        userPresent: authDataParsed.flags.up, // is user was present when signing the passkey
        userVerified: authDataParsed.flags.uv, // is user was verified when signing the passkey
        attestedCredentialDataIncluded: authDataParsed.flags.at, // unknown
        extensionDataIncluded: authDataParsed.flags.ed, // unknown
        backupEligibility: authDataParsed.flags.be, // is user key eligible for storing on iCloud, etc.
        backupState: authDataParsed.flags.bs, // is user key is backed up on iCloud, etc.
        flagsInt: authDataParsed.flags.flagsInt, // unknown
      },
      publicKey: authDataParsed.credentialPublicKey!,
      aaguid: authDataParsed.aaguid!,
      credentialId: authDataParsed.credentialID!,
      credentialStringId: credential.id,
      transports: (credential.response as any).getTransports(),
      clientData: clientDataObj,
      created_at: new Date().toISOString(),
    }

    const lambdaRequest = {
      key: credential.id,
      data: passkeyMetadata,
    }

    return lambdaRequest
  }
}

export const passkeyConnector = new PasskeyConnector()
