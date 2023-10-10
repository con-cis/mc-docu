import { ConnectorData } from './'

export interface SourceConnectorData extends ConnectorData {
  type: 'source'
  id: string
  connectorName: string
  transportName: string
  enabled: string
}
