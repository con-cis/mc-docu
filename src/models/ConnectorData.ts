import {TransformerData} from './';

export interface ConnectorData {
  inboundDataType: string
  outboundDataType: string
  host: string
  port: string
  localHost: string
  localPort: string
  localAddress: string
  remoteAddress: string
  remotePort: string
  smtpHost: string
  smtpPort: string
  url: string
  wsdlUrl: string
  smbHost: string
  transformer?: TransformerData[]
}
