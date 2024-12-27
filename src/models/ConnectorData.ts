import { TransformerData } from './'

/**
 * Interface representing connector configuration data
 * @interface ConnectorData
 */
export interface ConnectorData {
  /** Data type for inbound messages */
  inboundDataType: string
  /** Data type for outbound messages */
  outboundDataType: string
  /** Host name/address */
  host: string
  /** Port number */
  port: string
  /** Local host name/address */
  localHost: string
  /** Local port number */
  localPort: string
  /** Local network address */
  localAddress: string
  /** Remote network address */
  remoteAddress: string
  /** Remote port number */
  remotePort: string
  /** SMTP server host */
  smtpHost: string
  /** SMTP server port */
  smtpPort: string
  /** URL endpoint */
  url: string
  /** WSDL URL for web services */
  wsdlUrl: string
  /** SMB/CIFS host */
  smbHost: string
  /** Optional array of transformer configurations */
  transformer?: TransformerData[]
}
