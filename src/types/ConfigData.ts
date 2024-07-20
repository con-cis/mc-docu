import ApiResponses from '../enums/ApiResponses'
import { ChannelData, MetaData } from '../models'

export type ConfigData = {
  status: ApiResponses | undefined
  extractedData?: {
    channels: ChannelData[]
  }
  metadata?: MetaData
}
