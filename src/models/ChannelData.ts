import { SourceConnectorData, DestinationConnectorData } from './'

/**
 * Represents a channel with source and destination connectors.
 */
export interface ChannelData {
  /** The name of the channel. */
  name: string
  /** The unique identifier of the channel. */
  id: string
  /** The source connector data. */
  sourceConnector: SourceConnectorData
  /** An array of destination connector data. */
  destinationConnectors: DestinationConnectorData[]
  /** Additional annotation data (if needed). */
  annotation?: string
}
