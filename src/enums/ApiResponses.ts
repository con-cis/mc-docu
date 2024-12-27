/**
 * Enum containing standard API response messages
 * @enum {string}
 * 
 * @property {string} OPERATION_CANCELLED - Response when operation is cancelled
 * @property {string} RESOLVED_SUCCESSFULLY - Response for successful resolution
 * @property {string} ERROR_RESOLVING_CONFIG - Response when config file resolution fails
 * @property {string} NO_DATA_RESOLVING_DATA - Response when no data is available to resolve
 * @property {string} ERROR_RESOLVING_ANNOTATION - Response when annotation resolution fails
 * @property {string} ERROR_RESETTING_DATA - Response when data reset operation fails
 */
enum ApiResponses {
  OPERATION_CANCELLED = 'Operation cancelled',
  RESOLVED_SUCCESSFULLY = 'Resolved successfully', 
  ERROR_RESOLVING_CONFIG = 'Error while resolving config file',
  NO_DATA_RESOLVING_DATA = 'No data to resolve',
  ERROR_RESOLVING_ANNOTATION = 'Error while resolving annotation',
  ERROR_RESETTING_DATA = 'Error while resetting data'
}

export default ApiResponses