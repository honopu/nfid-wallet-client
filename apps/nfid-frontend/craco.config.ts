// import {} from "@craco/craco"
import CspHtmlWebpackPlugin from "@melloware/csp-webpack-plugin"
import path from "path"
import ModuleScopePlugin from "react-dev-utils/ModuleScopePlugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import webpack from "webpack"

import { serviceConfig } from "../../config/webpack-env"
import dfxJson from "../../dfx.json"

console.log("nfid-frontend", { serviceConfig })

const isExampleBuild = process.env.EXAMPLE_BUILD === "1"

const setupCSP = () => {
  const isProduction = process.env.FRONTEND_MODE === "production"
  if (isProduction) {
    const cspConfigPolicy = {
      "default-src": "'none'",
      "object-src": "'none'",
      "base-uri": "'self'",
      "connect-src": [
        "'self'",
        "https://ic0.app",
        "https://*.ic0.app",
        "https://analytics.google.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
        process.env.AWS_VERIFY_PHONENUMBER as string,
        process.env.AWS_SYMMETRIC as string,
        process.env.AWS_AUTH_STATS as string,
        process.env.AWS_SIGNATURE_EVENT as string,
        process.env.AWS_SIGNIN_GOOGLE as string,
        process.env.AWS_SIGNIN_GOOGLE_V2 as string,
        process.env.AWS_ECDSA_SIGN as string,
        process.env.AWS_PASSKEY as string,
        process.env.AWS_ECDSA_REGISTER as string,
        process.env.AWS_ECDSA_REGISTER_ADDRESS as string,
        process.env.AWS_ECDSA_GET_ANONYMOUS as string,
        process.env.AWS_SEND_VERIFICATION_EMAIL as string,
        process.env.AWS_LINK_GOOGLE_ACCOUNT as string,
        process.env.AWS_CHECK_VERIFICATION as string,
        process.env.AWS_VERIFY_EMAIL as string,
        "https://o1255710.ingest.sentry.io",
        "https://rosetta-api.internetcomputer.org",
        "https://free.currconv.com/",
        "https://us-central1-entrepot-api.cloudfunctions.net",
        "https://stats.g.doubleclick.net/g/collect",
        "https://registry.walletconnect.com",
        "wss://*.bridge.walletconnect.org",
        "https://ethereum.publicnode.com",
        "https://testnet-api.rarible.org",
        "https://logging.rarible.com/",
        "https://rpc-mumbai.maticvigil.com",
        "https://mempool.space/",
        "https://api.blockcypher.com/",
        "https://api.rarible.org",
        "https://ethereum-api.rarible.org",
        "https://testnet-ethereum-api.rarible.org",
        "https://polygon-mainnet.infura.io",
        "https://polygon-api.rarible.org",
        "https://testnet-polygon-api.rarible.org",
        "https://api.coinbase.com",
        "https://*.alchemy.com",
        "https://*.rarible.com/",
        "https://polygon-rpc.com",
        "https://rpc-mumbai.matic.today",
        "https://eu.posthog.com",
      ],
      "worker-src": "'self' blob:",
      "img-src": [
        "'self' blob: data: content: https:",
        "https://*.google-analytics.com",
        "https://*.googletagmanager.com",
      ],
      "font-src": [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ],
      "frame-src": [
        "'self'",
        "https://*.ic0.app",
        "https://accounts.google.com/gsi/style",
        "https://accounts.google.com/",
      ],
      "manifest-src": "'self'",
      "style-src": [
        "'self'",
        // FIXME: libraries adding inline styles:
        // - google button
        "'unsafe-inline'",
        // FIXME: ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        "https://accounts.google.com/gsi/style",
        "https://fonts.googleapis.com",
      ],
      "script-src": [
        "'self'",
        // FIXME: required for WebAssembly.instantiate()
        "'unsafe-eval'",
        "'sha256-6dv10xlkUu6+B73+WBPb1lJ7kFQFnr086T6FvXhkfHY='",
        "https://accounts.google.com/gsi/client",
        "https://*.googletagmanager.com",
        "https://eu.posthog.com",
      ],
      "require-trusted-types-for": ["'script'"],
    }

    return [
      new CspHtmlWebpackPlugin(cspConfigPolicy, {
        // PrimeReact is a component library which is enabled by default,
        // but it is not used in the frontend. When it is enabled, it produces
        // a nonce within `style-src` which in turn disables `unsafe-inline`.
        primeReactEnabled: false,
        hashEnabled: {
          "style-src": false,
        },
        nonceEnabled: {
          "style-src": false,
        },
      }),
    ]
  }
  return []
}

// Gets the port dfx is running on from dfx.json
const DFX_PORT = dfxJson.networks.local.bind.split(":")[1]

const config = {
  webpack: {
    alias: {
      frontend: path.resolve(__dirname, "src"),
    },
    optimization: {
      minimize: !isExampleBuild,
    },
    configure: (config: any, { env, paths }: any) => {
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin: any) => !(plugin instanceof ModuleScopePlugin),
      )
      const canisterEnv = {
        ...(isExampleBuild ? {} : serviceConfig),
      }
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, "tsconfig.json"),
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          mainFields: ["module", "main"],
        }),
      )
      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules[1].oneOf.forEach((r: any) => {
        if (r.loader && r.loader.indexOf("babel") !== -1) {
          r.exclude = /node_modules/
          delete r.include
        }
      })

      const isProduction = process.env.FRONTEND_MODE === "production"
      return {
        ...config,
        output: {
          ...config.output,
          crossOriginLoading: "anonymous",
        },
        devtool: !isProduction && "source-map",
        ignoreWarnings: [/Failed to parse source map from/],
        resolve: {
          ...config.resolve,
          extensions: [".js", ".ts", ".jsx", ".tsx"],
          fallback: {
            ...config.resolve.fallback,
            assert: require.resolve("assert"),
            buffer: require.resolve("buffer"),
            events: require.resolve("events"),
            stream: require.resolve("stream-browserify"),
            util: require.resolve("util"),
            https: require.resolve("https-browserify"),
            http: require.resolve("stream-http"),
            crypto: require.resolve("crypto-browserify"),
            path: require.resolve("path-browserify"),
            os: require.resolve("os-browserify/browser"),
          },
        },
        plugins: [
          ...config.plugins,
          new webpack.DefinePlugin(canisterEnv),
          new webpack.ProvidePlugin({
            Buffer: [require.resolve("buffer/"), "Buffer"],
            process: require.resolve("process/browser"),
          }),
          new webpack.IgnorePlugin({
            contextRegExp: /^\.\/wordlists\/(?!english)/,
            resourceRegExp: /bip39\/src$/,
          }),
          ...setupCSP(),
        ],
      }
    },
  },
  devServer: {
    open: false,
    port: 9090,
    proxy: {
      // This proxies all http requests made to /api to our running dfx instance
      "/api": {
        target: `http://0.0.0.0:${DFX_PORT}`,
      },
      "/signin": {
        target: process.env.AWS_SIGNIN_GOOGLE,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/signin/, ""),
      },
      "/signin/v2": {
        target: process.env.AWS_SIGNIN_GOOGLE_V2,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/signin\/v2/, ""),
      },
      "/symmetric": {
        target: process.env.AWS_SYMMETRIC,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/symmetric/, ""),
      },
      "/auth": {
        target: process.env.AWS_AUTH_STATS,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/auth/, ""),
      },
      "/signature": {
        target: process.env.AWS_SIGNATURE_EVENT,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/signature/, ""),
      },
      "/ecdsa_register": {
        target: process.env.AWS_ECDSA_REGISTER,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/ecdsa_register/, ""),
      },
      "/ecdsa_register_address": {
        target: process.env.AWS_ECDSA_REGISTER_ADDRESS,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) =>
          path.replace(/^\/ecdsa_register_address/, ""),
      },
      "/ecdsa_get_anonymous": {
        target: process.env.AWS_ECDSA_GET_ANONYMOUS,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) =>
          path.replace(/^\/ecdsa_get_anonymous/, ""),
      },
      "/ecdsa_sign": {
        target: process.env.AWS_ECDSA_SIGN,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/ecdsa_sign/, ""),
      },
      "/passkey": {
        target: process.env.AWS_PASSKEY,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/passkey/, ""),
      },
      "/send_verification_email": {
        target: process.env.AWS_SEND_VERIFICATION_EMAIL,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) =>
          path.replace(/^\/send_verification_email/, ""),
      },
      "/link_google_account": {
        target: process.env.AWS_LINK_GOOGLE_ACCOUNT,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) =>
          path.replace(/^\/link_google_account/, ""),
      },
      "/check_verification": {
        target: process.env.AWS_CHECK_VERIFICATION,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) =>
          path.replace(/^\/check_verification/, ""),
      },
      "/verify_email": {
        target: process.env.AWS_VERIFY_EMAIL,
        secure: true,
        changeOrigin: true,
        pathRewrite: (path: string) => path.replace(/^\/verify_email/, ""),
      },
    },
  },
}
export default config
