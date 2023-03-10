type WebAuthnCredential = {
  credentialId: string
  isResidentCredential: boolean
  privateKey: string
  signCount: number
}

type TestUser = {
  seed: string
  accountId: string
  principalId: string
  account: JSON
  credentials: WebAuthnCredential
}
interface IChromeOption {
  w3c: boolean // required for JSONWP Local Storage
  args: string[]
  mobileEmulation?: object
}
