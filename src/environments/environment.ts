// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000', // Development API URL
  appName: 'Edu Chinese Admin',
  version: '1.0.0',
  defaultLanguage: 'vi',
  apiTimeout: 30000, // API timeout in milliseconds
  auth: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryKey: 'token_expiry'
  }
};
