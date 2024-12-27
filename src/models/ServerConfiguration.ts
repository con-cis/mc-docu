import { ChannelData } from './ChannelData'

/**
 * Interface representing the server configuration structure
 * @interface ServerConfiguration
 */
export interface ServerConfiguration {
  serverConfiguration: {
    /**
     * Version metadata
     */
    $: {
      /**
       * Version string of the server configuration
       */
      version: string
    }
    /**
     * Date of the server configuration
     */
    date: string
    /**
     * Channel data configuration
     */
    channels: ChannelData
  }
}
