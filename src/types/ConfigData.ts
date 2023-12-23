import ApiResponses from 'src/enums/ApiResponses'
import { ChannelData, MetaData } from '../models'

export type ConfigData = {
  status: ApiResponses,
  extractedData: {
    channels: ChannelData
  }
  metadata: MetaData
}
