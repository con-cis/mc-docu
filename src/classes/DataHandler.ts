import ApiResponses from '../enums/ApiResponses'
import { escapeString } from '../main/utils/StringEscape'
import { MetaData, ExtractedData } from '../models'
import { ConfigData } from '../types/ConfigData'

/**
 * Singleton class for managing a data object and related functionality.
 */
export class DataHandler {
  private static instance: DataHandler
  public dataObject: ConfigData

  /**
   * Private constructor to prevent direct instantiation.
   * Initializes the data object with an initial value.
   */
  private constructor() {
    this.dataObject = { status: undefined }
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
      metadata: this.dataObject?.metadata
    })
  }

  /**
   * Creates a data object based on processed results.
   * If processedResult is an error, returns an error status data object.
   * Otherwise, returns a success status data object with extractedData and metadata.
   * @param processedResult - The processed result to create the data object from.
   * @returns void.
   */
  public setDataObject(
    processedResult: Error | { extractedData: ExtractedData; metadata: MetaData }
  ): void {
    if (processedResult instanceof Error) {
      this.dataObject = { status: ApiResponses.ERROR_RESOLVING_CONFIG }
    } else {
      this.dataObject = {
        extractedData: processedResult.extractedData,
        metadata: processedResult.metadata,
        status: ApiResponses.RESOLVED_SUCCESSFULLY
      }
    }
  }

  public addAnnotation(data: { channelId: string; annotation: string }): ApiResponses {
    const escapedAnnotation = escapeString(data.annotation)
    try {
      this.dataObject.extractedData?.channels?.forEach((channel) => {
        if (channel.id === data.channelId) {
          channel.annotation = escapedAnnotation
        }
      })
      return ApiResponses.RESOLVED_SUCCESSFULLY
    } catch (error) {
      console.error('Error adding annotation: ', error)
      return ApiResponses.ERROR_RESOLVING_ANNOTATION
    }
  }
  /**
   * Sets data to an empty array
   * @returns The singleton instance of DataObjectSingleton.
   */
  public resetData(): ApiResponses {
    try {
      if (DataHandler.instance) {
        this.dataObject = { status: undefined }
      }
      return ApiResponses.RESOLVED_SUCCESSFULLY
    } catch (error) {
      console.error('Error resetting data: ', error)
      return ApiResponses.ERROR_RESOLVING_ANNOTATION
    }
  }
}
