/**
 * Enum containing properties that should be filtered/masked in logs and outputs
 * @enum {string}
 * @property {string} Password - Password field
 * @property {string} Username - Username field
 * @property {string} PreprocessingScript - Script run before processing
 * @property {string} PostprocessingScript - Script run after processing
 * @property {string} DeployScript - Script used for deployment
 * @property {string} UndeployScript - Script used for undeployment
 * @property {string} GlobalScripts - Global scripts
 * @property {string} KeyPW - Key password
 * @property {string} KeyStorePW - Keystore password
 */
enum FilteredProperties {
  Password = 'password',
  Username = 'username',
  PreprocessingScript = 'preprocessingScript',
  PostprocessingScript = 'postprocessingScript',
  DeployScript = 'deployScript',
  UndeployScript = 'undeployScript',
  GlobalScripts = 'globalScripts',
  KeyPW = 'keyPW',
  KeyStore = 'keyStore',
  KeyStorePW = 'keyStorePW'
}

export default FilteredProperties