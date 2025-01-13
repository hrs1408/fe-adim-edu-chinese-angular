export const environment = {
  production: true,
  apiUrl: 'https://api.educhinese.com/api', // Replace with your actual production API URL
  appName: 'Edu Chinese Admin',
  version: '1.0.0',
  defaultLanguage: 'vi',
  apiTimeout: 30000,
  auth: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryKey: 'token_expiry'
  }
};
