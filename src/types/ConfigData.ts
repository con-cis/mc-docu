import ApiResponses from '../enums/ApiResponses'
import { ChannelData, MetaData } from '../models'

/**
 * Configuration data type representing the structure of API response data
 */
export type ConfigData = {
  status: ApiResponses | undefined
  extractedData?: {
    channels: ChannelData[]
  }
  metadata?: MetaData
}
