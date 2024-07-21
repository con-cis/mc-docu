import { describe, it, expect } from 'vitest'
import { processXmlFile } from '@/main/modules/xmlProcessing/XmlProcessingService'
import { promises as fs } from 'fs'
import { resolve } from 'path'

describe('XmlProcessingService', () => {
  it('should process valid XML data correctly', async () => {
    const validXml = `
      <serverConfiguration version="1.0">
        <date>2024-07-21</date>
        <channels>
          <channel>
            <id>1</id>
            <name>Test Channel</name>
            <sourceConnector>
              <name>Source Connector</name>
              <transportName>HTTP</transportName>
              <enabled>true</enabled>
              <properties>
                <listenerConnectorProperties>
                  <host>localhost</host>
                  <port>8080</port>
                </listenerConnectorProperties>
              </properties>
            </sourceConnector>
            <destinationConnectors>
              <connector>
                <name>Destination Connector</name>
                <enabled>true</enabled>
                <transportName>HTTP</transportName>
                <properties>
                  <host>remotehost</host>
                  <port>9090</port>
                </properties>
              </connector>
            </destinationConnectors>
          </channel>
        </channels>
      </serverConfiguration>
    `

    const result = await processXmlFile(validXml)
    expect(result.extractedData.channels[0].name).toBe('Test Channel')
    expect(result.metadata.date).toBe('2024-07-21')
    expect(result.metadata.version).toBe('1.0')
  })

  it('should throw an error for invalid XML format', async () => {
    const invalidXml = `
      <serverConfiguration version="1.0">
        <date>2024-07-21</date>
        <channels>
          <channel>
            <id>1</id>
            <name>Test Channel</name>
            <sourceConnector>
              <name>Source Connector</name>
              <transportName>HTTP</transportName>
              <enabled>true</enabled>
              <properties>
                <listenerConnectorProperties>
                  <host>localhost</host>
                  <port>8080</port>
                </listenerConnectorProperties>
              </properties>
            </sourceConnector>
          </channel>
        </channels>
      </serverConfiguration>
    ` // Missing destinationConnectors

    try {
      await processXmlFile(invalidXml)
    } catch (error) {
      expect((error as Error).message).toContain('Error processing XML file')
    }
  })

  it('should throw an error for malformed XML', async () => {
    const malformedXml = `
      <serverConfiguration version="1.0">
        <date>2024-07-21</date>
        <channels>
          <channel>
            <id>1</id>
            <name>Test Channel
    ` // Malformed XML

    try {
      await processXmlFile(malformedXml)
    } catch (error) {
      expect((error as Error).message).toContain('Error processing XML file')
    }
  })
})

describe('XmlProcessingService', () => {
  it('should correctly process the XML file', async () => {
    // Resolve the path to the XML test file
    const filePathXml = resolve(__dirname, 'test-data.xml')
    const filePathJson = resolve(__dirname, 'test-data.json')

    // Read the file content
    const xmlData = await fs.readFile(filePathXml, 'utf-8')

    // Process the XML data
    const result = await processXmlFile(xmlData)

    // Define the expected output
    const expectedOutput = JSON.parse(await fs.readFile(filePathJson, 'utf-8'))

    // Validate the result
    expect(result).toEqual(expectedOutput)
  })
})
