/**
 * Enum representing the types of connectors in the system
 * @enum {string}
 * @property {string} Source - Represents a source connector that data flows from
 * @property {string} Destination - Represents a destination connector that data flows to
 */
enum ConnectorType {
  Source = 'source',
  Destination = 'destination'
}

export default ConnectorType
