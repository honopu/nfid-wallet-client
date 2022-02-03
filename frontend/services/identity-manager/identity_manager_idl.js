export const idlFactory = ({ IDL }) => {
  const Configuration = IDL.Record({
    key: IDL.Vec(IDL.Nat8),
    whitelisted_phone_numbers: IDL.Opt(IDL.Vec(IDL.Text)),
    lambda: IDL.Principal,
    token_ttl: IDL.Nat64,
  })
  const AccessPoint = IDL.Record({
    model: IDL.Text,
    make: IDL.Text,
    name: IDL.Text,
    pub_key: IDL.Text,
    browser: IDL.Text,
    last_used: IDL.Text,
  })
  const Error = IDL.Text
  const HTTPAccessPointResponse = IDL.Record({
    data: IDL.Opt(IDL.Vec(AccessPoint)),
    error: IDL.Opt(Error),
    status_code: IDL.Nat16,
  })
  const HTTPAccountRequest = IDL.Record({
    token: IDL.Text,
    name: IDL.Text,
    anchor: IDL.Nat64,
    phone_number: IDL.Text,
  })
  const PersonaIIResponse = IDL.Record({
    domain: IDL.Text,
    anchor: IDL.Nat64,
  })
  const PersonaNFIDResponse = IDL.Record({
    domain: IDL.Text,
    persona_id: IDL.Text,
  })
  const PersonaVariant = IDL.Variant({
    ii_persona: PersonaIIResponse,
    nfid_persona: PersonaNFIDResponse,
  })
  const AccountResponse = IDL.Record({
    name: IDL.Text,
    anchor: IDL.Nat64,
    access_points: IDL.Vec(AccessPoint),
    personas: IDL.Vec(PersonaVariant),
    principal_id: IDL.Text,
    phone_number: IDL.Text,
  })
  const HTTPAccountResponse = IDL.Record({
    data: IDL.Opt(AccountResponse),
    error: IDL.Opt(Error),
    status_code: IDL.Nat16,
  })
  const HTTPVerifyPhoneNumberRequest = IDL.Record({
    token: IDL.Text,
    phone_number: IDL.Text,
  })
  const BoolHttpResponse = IDL.Record({
    data: IDL.Opt(IDL.Bool),
    error: IDL.Opt(Error),
    status_code: IDL.Nat16,
  })
  const HTTPPersonasResponse = IDL.Record({
    data: IDL.Opt(IDL.Vec(PersonaVariant)),
    error: IDL.Opt(Error),
    status_code: IDL.Nat16,
  })
  const HTTPAccountUpdateRequest = IDL.Record({ name: IDL.Opt(IDL.Text) })
  const PhoneNumber = IDL.Text
  return IDL.Service({
    configure: IDL.Func([Configuration], [], []),
    create_access_point: IDL.Func([AccessPoint], [HTTPAccessPointResponse], []),
    create_account: IDL.Func([HTTPAccountRequest], [HTTPAccountResponse], []),
    create_persona: IDL.Func([PersonaVariant], [HTTPAccountResponse], []),
    get_account: IDL.Func([], [HTTPAccountResponse], ["query"]),
    post_token: IDL.Func(
      [HTTPVerifyPhoneNumberRequest],
      [BoolHttpResponse],
      [],
    ),
    read_access_points: IDL.Func([], [HTTPAccessPointResponse], []),
    read_personas: IDL.Func([], [HTTPPersonasResponse], []),
    remove_access_point: IDL.Func([AccessPoint], [HTTPAccessPointResponse], []),
    update_access_point: IDL.Func([AccessPoint], [HTTPAccessPointResponse], []),
    update_account: IDL.Func(
      [HTTPAccountUpdateRequest],
      [HTTPAccountResponse],
      [],
    ),
    validate_phone_number: IDL.Func(
      [PhoneNumber],
      [BoolHttpResponse],
      ["query"],
    ),
  })
}
export const init = ({ IDL }) => {
  return []
}
