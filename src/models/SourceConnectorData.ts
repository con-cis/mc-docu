import { ConnectorData } from './'

/**
 * Interface representing data for a source connector
 * @extends ConnectorData
 */
export interface SourceConnectorData extends ConnectorData {
  /** Type of connector - must be 'source' */
  type: 'source'
  /** Unique identifier for the connector */
  id: string
  /** Name of the connector */
  connectorName: string
  /** Name of the transport used by the connector */
  transportName: string
  /** Flag indicating if the connector is enabled */
  enabled: string
}
