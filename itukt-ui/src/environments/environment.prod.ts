export const environment = {
  production: true,
  authGatewayUrl: (window as any)?.__RUNTIME_CONFIG__?.ITUKT_AUTH_GATEWAY_URL
};
