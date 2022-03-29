const BACKEND_MODE = process.env.REACT_APP_BACKEND_MODE
const FRONTEND_MODE = process.env.REACT_APP_FRONTEND_MODE

export const CONFIG = {
  FRONTEND_MODE,
  USERGEEK_API_KEY: process.env.REACT_APP_USERGEEK_API_KEY,
  IC_HOST: process.env.REACT_APP_IC_HOST as string,
  II_ENV: process.env.REACT_APP_II_MODE,
  II_CANISTER_ID: process.env[`REACT_APP_II_CANISTER_ID_${BACKEND_MODE}`],
  IDENTITY_MANAGER_CANISTER_ID:
    process.env[`REACT_APP_IDENTITY_MANAGER_CANISTER_ID_${BACKEND_MODE}`],
  PUB_SUB_CHANNEL_CANISTER_ID:
    process.env[`REACT_APP_PUB_SUB_CHANNEL_CANISTER_ID_${BACKEND_MODE}`],
  VERIFY_PHONE_NUMBER:
    FRONTEND_MODE === "production"
      ? process.env.REACT_APP_AWS_VERIFY_PHONENUMBER
      : "/verify",
}

console.log(">> ", { CONFIG })
