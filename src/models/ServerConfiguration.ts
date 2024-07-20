import { ChannelData } from './ChannelData'

export interface ServerConfiguration {
  serverConfiguration: {
    $: {
      version: string
    }
    date: string
    channels: ChannelData
  }
}
