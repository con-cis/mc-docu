import { ConnectorData } from './'

export interface DestinationConnectorData extends ConnectorData {
  type: 'destination'
  id: string
  connectorName: string
  name: string
  transportName: string
  enabled: 'true' | 'false'
}
