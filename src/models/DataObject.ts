import { ExtractedData } from './ExtractedData'
import { MetaData } from './MetaData'

export interface DataObject {
  status: string
  extractedData?: ExtractedData
  metadata?: MetaData
}
