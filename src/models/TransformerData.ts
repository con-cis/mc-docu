/**
 * Interface representing transformer data configuration
 * @interface TransformerData
 * @property {string} inboundDataType - The data type of the incoming data
 * @property {string} outboundDataType - The data type of the outgoing transformed data
 */
export interface TransformerData {
  inboundDataType: string
  outboundDataType: string
}
