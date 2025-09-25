export const environment = {
  production: true,
  // Brug værdien der sættes via container-start, med fallback til localhost:8080
  apiBaseUrl: (window as any)?.__RUNTIME_CONFIG__?.ITUKT_API_BASE_URL 
              ?? 'http://localhost:8080'
};
