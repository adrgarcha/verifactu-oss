export type CertificateBundle = {
  cert: string;
  key: string;
  ca?: string;
  rejectUnauthorized?: boolean;
};

export interface CertificateProvider {
  getCertificateBundle(): Promise<CertificateBundle>;
}
