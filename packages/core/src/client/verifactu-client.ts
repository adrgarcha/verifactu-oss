import {
  createCancelFingerprint,
  createIssueFingerprint,
} from "../application/mappers/request-mapper";
import { mapIssueOrCancelResponse, mapQueryResponse } from "../application/mappers/response-mapper";
import { DEFAULT_TIMEOUT_MS, VERIFACTU_ENDPOINTS } from "../config/defaults";
import { resolveEnvironment, type VerifactuEnvironment } from "../config/env";
import type { CancelInvoiceInput, CancelInvoiceResult } from "../domain/models/cancellation";
import type { IssueInvoiceInput, IssueInvoiceResult } from "../domain/models/invoice";
import type { QrInput, QrResult } from "../domain/models/qr";
import type { QueryInvoicesInput, QueryInvoicesResult } from "../domain/models/query";
import type { CertificateProvider } from "../domain/ports/certificate-provider";
import { type Clock, systemClock } from "../domain/ports/clock";
import { type LoggerPort, noopLogger } from "../domain/ports/logger";
import { AeatError } from "../errors/aeat-error";
import { INTERNAL_ERROR_CODES } from "../errors/error-codes";
import { generateQr } from "../infrastructure/qr/qr.service";
import { buildCancelRecordXml } from "../infrastructure/soap/cancel.builder";
import { buildSoapEnvelope } from "../infrastructure/soap/envelope.builder";
import { buildIssueRecordXml } from "../infrastructure/soap/issue.builder";
import { buildQueryXml } from "../infrastructure/soap/query.builder";
import { createMtlsAgent } from "./mtls-agent";
import { postSoapXml } from "./transport";

export type VerifactuClientOptions = {
  environment?: VerifactuEnvironment;
  endpoint?: string;
  timeoutMs?: number;
  certificateProvider?: CertificateProvider;
  clock?: Clock;
  logger?: LoggerPort;
};

export class VerifactuClient {
  private readonly environment: VerifactuEnvironment;
  private readonly endpoint: string;
  private readonly timeoutMs: number;
  private readonly certificateProvider?: CertificateProvider;
  private readonly clock: Clock;
  private readonly logger: LoggerPort;

  constructor(options: VerifactuClientOptions = {}) {
    this.environment = resolveEnvironment(options.environment);
    this.endpoint = options.endpoint ?? VERIFACTU_ENDPOINTS[this.environment];
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.certificateProvider = options.certificateProvider;
    this.clock = options.clock ?? systemClock;
    this.logger = options.logger ?? noopLogger;
  }

  async issueInvoice(input: IssueInvoiceInput): Promise<IssueInvoiceResult> {
    const { fingerprint, timestamp } = createIssueFingerprint(input, this.clock.now());
    const xml = buildSoapEnvelope(buildIssueRecordXml(input, fingerprint, timestamp));
    const response = await this.send(xml);

    if (response.statusCode >= 500) {
      return {
        success: [],
        error: [
          {
            id: input.id,
            num: input.numSerieFactura,
            codError: INTERNAL_ERROR_CODES.SERVER_ERROR,
            descrError: `AEAT server error: ${response.statusCode}`,
          },
        ],
      };
    }

    if (response.statusCode >= 400) {
      throw new AeatError(`AEAT request failed with status ${response.statusCode}`);
    }

    return mapIssueOrCancelResponse(response.body, input, fingerprint);
  }

  async cancelInvoice(input: CancelInvoiceInput): Promise<CancelInvoiceResult> {
    const { fingerprint, timestamp } = createCancelFingerprint(input, this.clock.now());
    const xml = buildSoapEnvelope(buildCancelRecordXml(input, fingerprint, timestamp));
    const response = await this.send(xml);

    if (response.statusCode >= 500) {
      return {
        success: [],
        error: [
          {
            id: input.id,
            num: input.numSerieFactura,
            codError: INTERNAL_ERROR_CODES.SERVER_ERROR,
            descrError: `AEAT server error: ${response.statusCode}`,
          },
        ],
      };
    }

    if (response.statusCode >= 400) {
      throw new AeatError(`AEAT request failed with status ${response.statusCode}`);
    }

    return mapIssueOrCancelResponse(response.body, input, fingerprint);
  }

  async queryInvoices(input: QueryInvoicesInput): Promise<QueryInvoicesResult> {
    const xml = buildSoapEnvelope(buildQueryXml(input));
    const response = await this.send(xml);

    if (response.statusCode >= 500) {
      return {
        success: false,
        error: {
          code: INTERNAL_ERROR_CODES.SERVER_ERROR,
          message: `AEAT server error: ${response.statusCode}`,
        },
      };
    }

    if (response.statusCode >= 400) {
      return {
        success: false,
        error: {
          code: INTERNAL_ERROR_CODES.CLIENT_ERROR,
          message: `Request error: ${response.statusCode}`,
        },
      };
    }

    return mapQueryResponse(response.body);
  }

  async generateQr(input: QrInput): Promise<QrResult> {
    return generateQr(this.environment, input);
  }

  private async send(xmlBody: string): Promise<{ statusCode: number; body: string }> {
    this.logger.debug("Sending SOAP payload", { endpoint: this.endpoint });

    const bundle = this.certificateProvider
      ? await this.certificateProvider.getCertificateBundle()
      : undefined;
    const dispatcher = bundle ? createMtlsAgent(bundle) : undefined;

    return postSoapXml(this.endpoint, xmlBody, {
      dispatcher,
      timeoutMs: this.timeoutMs,
    });
  }
}

export function createVerifactuClient(options?: VerifactuClientOptions): VerifactuClient {
  return new VerifactuClient(options);
}
