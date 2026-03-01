import { toXmlDocument } from "../xml/serializer";
import { SOAP_NAMESPACES } from "./namespaces";

export function buildSoapEnvelope(inner: string): string {
  const envelope = `<soapenv:Envelope xmlns:soapenv="${SOAP_NAMESPACES.soapenv}" xmlns:sum="${SOAP_NAMESPACES.sum}" xmlns:con="${SOAP_NAMESPACES.con}" xmlns="${SOAP_NAMESPACES.info}"><soapenv:Header/><soapenv:Body>${inner}</soapenv:Body></soapenv:Envelope>`;
  return toXmlDocument(envelope);
}
