import {
  ExtractedData,
  MetaData,
  ConnectorData,
  ChannelData,
  DestinationConnectorData,
  ServerConfiguration
} from '../../../models/'
import xml2js from 'xml2js'
import ConnectorType from '../../../enums/ConnectorType'
import FilteredProperties from '../../../enums/FilteredProperties'

/**
 * Process XML file and return a promise with typed result.
 * @param xmlData - The XML data as a string.
 * @returns An object containing extractedData and metadata.
 * @throws If there's an error in processing the XML file.
 */
export async function processXmlFile(
  xmlData: string
): Promise<{ extractedData: ExtractedData; metadata: MetaData }> {
  try {
    const result = await parseXmlData(xmlData)
    const extractedData = extractProperties(result.serverConfiguration.channels[0].channel)
    const metadata = {
      date: result.serverConfiguration.date[0],
      version: result.serverConfiguration.$.version
    }
    return { extractedData, metadata }
  } catch (error) {
    const errorMessage = (error as Error).message
    throw new Error(`Error processing XML file: ${errorMessage}`)
  }
}

/**
 * Parse XML data using xml2js.
 * @param xmlData - The XML data as a string.
 * @returns A promise with the parsed XML data.
 */
function parseXmlData(xmlData: string): Promise<ServerConfiguration> {
  const loginDataFilter = function (name: string): string {
    if (Object.values(FilteredProperties).includes(name as FilteredProperties)) {
      return ''
    }
    return name
  }

  const parser = new xml2js.Parser({
    trim: true,
    tagNameProcessors: [loginDataFilter],
    explicitArray: true
  })

  return parser.parseStringPromise(xmlData)
}

/**
 * Extract properties from parsed data.
 * @param data - The parsed XML data.
 * @returns Extracted data with typed structure.
 */
// TODO: Remove any
function extractProperties(data: any): ExtractedData {
  const channels: ChannelData[] = data.map((channelData: any) => {
    const sourceConnectorData = channelData.sourceConnector[0]
    const destinationConnectorsData = channelData.destinationConnectors[0].connector

    return {
      name: channelData.name[0],
      id: channelData.id[0],
      sourceConnector: {
        id: channelData.id[0],
        connectorName: sourceConnectorData.name[0],
        transportName: sourceConnectorData.transportName[0],
        enabled: sourceConnectorData.enabled[0],
        ...extractConnectorProperties(sourceConnectorData, ConnectorType.Source)
      },
      destinationConnectors: destinationConnectorsData.map(
        (destinationConnectorData: DestinationConnectorData) => {
          return {
            connectorName: destinationConnectorData.name[0],
            id: channelData.id[0],
            enabled: destinationConnectorData.enabled[0],
            transportName: destinationConnectorData.transportName[0],
            ...extractConnectorProperties(destinationConnectorData, ConnectorType.Destination)
          }
        }
      )
    }
  })

  return { channels }
}

/**
 * Extract connector properties from data.
 * @param data - The connector data.
 * @param type - The connector type.
 * @returns Extracted connector properties with typed structure.
 */
function extractConnectorProperties(data: any, type: ConnectorType): ConnectorData {
  const connectorProperties: ConnectorData = {
    inboundDataType: data.transformer?.[0]?.inboundDataType?.[0] ?? '',
    outboundDataType: data.transformer?.[0]?.outboundDataType?.[0] ?? '',
    host:
      type === ConnectorType.Source
        ? data.properties[0]?.listenerConnectorProperties?.[0]?.host[0] || ''
        : data.properties?.[0]?.host?.[0] || '',
    port:
      type === ConnectorType.Source
        ? data.properties[0]?.listenerConnectorProperties?.[0]?.port[0] || ''
        : data.properties?.[0]?.port?.[0] || '',
    localHost: data.properties?.[0]?.localHost?.[0] ?? '',
    localPort: data.properties?.[0]?.localPort?.[0] ?? '',
    localAddress: data.properties?.[0]?.localAddress?.[0] ?? '',
    remoteAddress: data.properties?.[0]?.remoteAddress?.[0] ?? '',
    remotePort: data.properties?.[0]?.remotePort?.[0] ?? '',
    smtpHost: data.properties?.[0]?.smtpHost?.[0] ?? '',
    smtpPort: data.properties?.[0]?.smtpPort?.[0] ?? '',
    url: data.properties?.[0]?.url?.[0] ?? '',
    wsdlUrl: data.properties?.[0]?.wsdlUrl?.[0] ?? '',
    smbHost: data.properties?.[0]?.host?.[0] ?? ''
  }
  return connectorProperties
}
