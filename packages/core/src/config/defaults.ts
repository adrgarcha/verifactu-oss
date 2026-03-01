export const VERIFACTU_ENDPOINTS = {
  sandbox: "https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP",
  production:
    "https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP",
} as const;

export const VERIFACTU_QR_BASE_URLS = {
  sandbox: "https://prewww1.aeat.es/wlpl/TIKE-CONT/ValidarQR",
  production: "https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ValidarQR",
} as const;

export const DEFAULT_TIMEOUT_MS = 30_000;
