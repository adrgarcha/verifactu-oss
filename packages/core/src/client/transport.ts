import { request } from "undici";

import { TransportError } from "../errors/transport-error";

export type SoapTransportResponse = {
  statusCode: number;
  body: string;
};

export async function postSoapXml(
  endpoint: string,
  xmlBody: string,
  options: {
    dispatcher?: unknown;
    timeoutMs: number;
  },
): Promise<SoapTransportResponse> {
  try {
    const response = await request(endpoint, {
      method: "POST",
      body: xmlBody,
      headers: {
        "content-type": "application/xml",
      },
      bodyTimeout: options.timeoutMs,
      headersTimeout: options.timeoutMs,
      dispatcher: options.dispatcher as never,
    });

    const body = await response.body.text();

    return {
      statusCode: response.statusCode,
      body,
    };
  } catch (error) {
    throw new TransportError("Failed to send SOAP request", error);
  }
}
