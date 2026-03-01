export type QrInput = {
  issuerNif: string;
  numSerieFactura: string;
  date: Date;
  total: number;
};

export type QrResult = {
  validationUrl: string;
  base64: string;
  png: Buffer;
};
