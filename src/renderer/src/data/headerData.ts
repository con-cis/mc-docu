/**
 * @fileoverview Defines the header configuration for the data table
 */

/**
 * Array of header objects that define the columns in the data table
 * Each header object contains:
 * @property {string} title - Display name of the column
 * @property {string} key - Unique identifier for the column
 * @property {string} value - Path to the data value in the source object
 * @property {boolean} [sortable] - Whether the column is sortable (optional)
 * @property {string} [align] - Text alignment for the column (optional)
 */
import { Header } from 'src/models'

export const headerData: Header[] = [
  { title: 'Name', key: 'name', value: 'name' },
  { title: 'ID', key: 'id', value: 'id' },
  {
    title: 'Connector Name',
    key: 'connectorName',
    value: 'sourceConnector.connectorName'
  },
  { title: 'Transport Name', key: 'transportName', value: 'sourceConnector.transportName' },
  { title: 'Enabled', key: 'enabled', value: 'sourceConnector.enabled' },
  { title: 'Inbound Data Type', key: 'inboundDataType', value: 'sourceConnector.inboundDataType' },
  {
    title: 'Outbound Data Type',
    key: 'outboundDataType',
    value: 'sourceConnector.outboundDataType'
  },
  { title: 'Host', key: 'host', value: 'sourceConnector.host' },
  { title: 'Port', key: 'port', value: 'sourceConnector.port' },
  { title: 'Local Host', key: 'localHost', value: 'sourceConnector.localHost' },
  { title: 'Local Port', key: 'localPort', value: 'sourceConnector.localPort' },
  { title: 'Local Address', key: 'localAddress', value: 'sourceConnector.localAddress' },
  { title: 'Remote Address', key: 'remoteAddress', value: 'sourceConnector.remoteAddress' },
  { title: 'Remote Port', key: 'remotePort', value: 'sourceConnector.remotePort' },
  { title: 'SMTP Host', key: 'smtpHost', value: 'sourceConnector.smtpHost' },
  { title: 'SMTP Port', key: 'smtpPort', value: 'sourceConnector.smtpPort' },
  { title: 'URL', key: 'url', value: 'sourceConnector.url' },
  { title: 'WSDL Url', key: 'wsdlUrl', value: 'sourceConnector.wsdlUrl' },
  { title: 'SMB Host', key: 'smbHost', value: 'sourceConnector.smbHost' },
  {
    title: 'Destinations',
    key: 'data-table-expand',
    value: 'destinationConnectors',
    sortable: false,
    align: 'center'
  },
  { title: 'Annotations', key: 'annotation', value: 'annotation', sortable: false, align: 'center' }
]
