import { ConnectorData } from './'

/**
 * Interface representing configuration data for a destination connector.
 * Extends the base ConnectorData interface with destination-specific properties.
 */
export interface DestinationConnectorData extends ConnectorData {
  /** Identifies this as a destination connector */
  type: 'destination'
  /** Unique identifier for the connector */
  id: string
  /** Name of the connector type */
  connectorName: string
  /** Display name for this connector instance */
  name: string
  /** Name of the transport used by this connector */
  transportName: string
  /** Whether the connector is enabled or disabled */
  enabled: 'true' | 'false'
  /** Additional dynamic properties */
  [key: string]: unknown
}