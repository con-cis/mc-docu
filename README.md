## Mirth Connect Config Documentation Tool

- [Mirth Connect Config Documentation Tool](#mirth-connect-config-documentation-tool)
- [Overview](#overview)
- [Features](#features)
  - [Supported Configurations](#supported-configurations)
  - [Import Limitations](#import-limitations)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Recommended IDE Setup](#recommended-ide-setup)
- [Procject structure](#procject-structure)
  - [Build](#build)
  - [Automatic generated builds](#automatic-generated-builds)
- [License](#license)
- [Disclaimer](#disclaimer)

## Overview

<img width="1412" alt="Channel Overview" src="https://github.com/con-cis/mc-docu/assets/54837156/54c0692e-32ca-4ac0-af8b-24edce8ac9f3">

Mirth Connect Config Documentation Tool is an open-source project that allows you to parse and visualize Mirth Connect configuration files. It is built using Vite, Vue, and Electron, leveraging IPC for communication between the frontend and backend.

This project is currently in pre-release, and it's designed to work with Mirth Config 4.4.0. Please be aware that there is no warranty, and it's encouraged to use the software as an open-source, community-driven effort. Feel free to participate, test, fork, and contribute to this project.

## Features

### Supported Configurations

Mirth Connect Config Documentation Tool supports the following features:

- **XML Configuration Parsing**: The application uses the xml2js library to parse Mirth Connect configuration files in XML format.

- **Channel Display**: View and analyze the details of Mirth Connect channels within the configuration file.

- **Channel Exports**: Export the configuration as JSON format to a file on your filesystem. Annotations are part of the export.

### Import Limitations

Please note the following import limitations:

- **Channel Imports**: Mirth Connect Config Documentation Tool currently supports the import of Mirth Connect configurations but does not handle channel import xml files.

- **Groupings**: While Mirth Connect Config Documentation Tool can display channel details, it may not fully support complex grouping and organization within Mirth Connect configurations.

## Prerequisites

Before using Mirth Connect Config Documentation Tool, ensure you have the following prerequisites:

- Node.js (latest LTS version)
- npm (Node Package Manager)

## Getting Started

To get started with Mirth Connect Config Documentation Tool:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Start the application using `npm run start`.
4. Import your Mirth Connect configuration file to begin exploring and visualizing it.

## Architecture

Mirth Connect Config Documentation Tool utilizes a modern stack, including Vite for the frontend, Vue for the UI, and Electron for the desktop application. It also relies on IPC (Inter-Process Communication) to facilitate communication between the frontend and backend.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Procject structure

```
mc-docu
src
├── classes
│   ├── DataHandler.ts
│   └── IpcHandler.ts
├── enums
│   ├── ApiResponses.ts
│   ├── ConnectorType.ts
│   └── FilteredProperties.ts
├── main
│   ├── index.ts
│   ├── modules
│   │   ├── fileHandling
│   │   │   ├── FileDialogService.ts
│   │   │   └── FileService.ts
│   │   ├── jsonProcessing
│   │   │   └── JsonProcessingService.ts
│   │   └── xmlProcessing
│   │       └── XmlProcessingService.ts
│   ├── services
│   │   ├── Config.ts
│   │   └── Logger.ts
│   └── utils
│       ├── Common.ts
│       ├── ErrorHandling.ts
│       ├── StringEscape.ts
│       └── Validator.ts
├── models
│   ├── ChannelData.ts
│   ├── ConnectorData.ts
│   ├── DestinationConnectorData.ts
│   ├── ExtractedData.ts
│   ├── Header.ts
│   ├── MetaData.ts
│   ├── ServerConfiguration.ts
│   ├── SourceConnectorData.ts
│   ├── TransformerData.ts
│   └── index.ts
├── preload
│   ├── index.d.ts
│   └── index.ts
├── renderer
│   ├── index.html
│   └── src
│       ├── App.vue
│       ├── assets
│       │   └── css
│       │       └── styles.less
│       ├── components
│       │   ├── DataTable.vue
│       │   └── VersionInfos.vue
│       ├── data
│       │   ├── checkboxOptionsData.ts
│       │   └── headerData.ts
│       ├── env.d.ts
│       ├── main.ts
│       └── plugins
│           └── vuetify.ts
└── types
    └── ConfigData.ts
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Automatic generated builds

Links to automated generated builds for [mac os, windows and linux](https://github.com/con-cis/mc-docu/actions/runs/6487526125) from the CI action workflow

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

Mirth Connect Config Documentation Tool is a pre-release project and may have limited functionality. It has been primarily tested with Mirth Config 4.4.0. We encourage users to contribute, report issues, and participate in its development to expand its capabilities.
