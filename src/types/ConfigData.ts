import { ChannelData, MetaData } from '../models'

export type ConfigData = {
  extractedData: {
    channels: ChannelData
  }
  metadata: MetaData
}
