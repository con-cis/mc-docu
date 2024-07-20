import ApiResponses from '../enums/ApiResponses'
import { DataObject, MetaData, ExtractedData, ChannelData } from '../models'

/**
 * Singleton class for managing a data object and related functionality.
 */
export class DataHandler {
  private static instance: DataHandler
  public dataObject: DataObject

  /**
   * Private constructor to prevent direct instantiation.
   * Initializes the data object with an initial value.
   */
  private constructor() {
    this.dataObject = { status: 'initialValue' }
  }

  /**
   * Retrieves the singleton instance of the DataObjectSingleton class.
   * If an instance does not exist, a new one is created.
   * @returns The singleton instance of DataObjectSingleton.
   */
  public static getInstance(): DataHandler {
    if (!DataHandler.instance) {
      DataHandler.instance = new DataHandler()
    }

    return DataHandler.instance
  }

  /**
   * Converts the data object to its JSON representation.
   * @returns A JSON string representing the data object.
   */
  public toJSON(): string {
    return JSON.stringify({
      extractedData: this.dataObject.extractedData,
      metadata: this.dataObject.metadata
    })
  }

  /**
   * Creates a data object based on processed results.
   * If processedResult is an error, returns an error status data object.
   * Otherwise, returns a success status data object with extractedData and metadata.
   * @param processedResult - The processed result to create the data object from.
   * @returns A data object based on the processed result.
   */
  public createDataObject(
    processedResult: Error | { extractedData: ExtractedData; metadata: MetaData }
  ): DataObject {
    if (processedResult instanceof Error) {
      return { status: ApiResponses.ERROR_RESOLVING_CONFIG }
    } else {
      return {
        status: ApiResponses.RESOLVED_SUCCESSFULLY,
        extractedData: processedResult.extractedData,
        metadata: processedResult.metadata
      }
    }
  }

  public addAnnotation(channelData: ChannelData): ApiResponses | ChannelData {
    const channelsArray = this.dataObject.extractedData?.channels
    try {
      channelsArray!.map((channel) => {
        if (channel.id === channelData.id) {
          channel.annotation = channelData.annotation
        }
        return channel
      })
      return ApiResponses.RESOLVED_SUCCESSFULLY
    } catch (error) {
      console.error('Error adding annotation: ', error)
      return ApiResponses.ERROR_RESOLVING_ANNOTATION
    }
  }
}
