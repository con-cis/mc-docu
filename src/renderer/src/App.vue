<script setup lang="ts">
/**
 * @file Main application component for Mirth Connect Channel Overview
 * @description Provides UI for viewing and managing Mirth Connect channels with filtering and export capabilities
 */

/**
 * @vue-script-setup
 */
import { ref } from 'vue'
import Versions from './components/VersionInfos.vue'
import DataTable from './components/DataTable.vue'
import { checkboxOptionsData } from './data/checkboxOptionsData'
import { ConfigData } from '../../types/ConfigData'
import { ChannelData } from '../../models'
import ApiResponses from '../../enums/ApiResponses'
import '@mdi/font/css/materialdesignicons.css'

/** Search text for filtering channels */
const search = ref<string>('')

/** Controls visibility of navigation drawer */
const drawer = ref<boolean>(false)

/**  Array of channel data */
const channels = ref<ChannelData[] | []>([])

/** Configuration data for Mirth Connect */
const configData = ref<ConfigData | undefined>(undefined)

/** Flag to trigger channel reset */
const resetChannels = ref<boolean>(false)

/** Timeout duration for notifications in ms */
const timeout = ref<number>(5000)

/** Error state flag */
const hasErrors = ref<boolean>(false)

/** Success state flag */
const wasSuccessful = ref<boolean>(false)

/** Default columns to display in channel table */
const DEFAULT_COLUMNS = [
  'id',
  'connectorName',
  'transportName',
  'inboundDataType',
  'outboundDataType',
  'enabled'
]

/** Currently displayed table columns */
const filterColumns = ref<string[]>(DEFAULT_COLUMNS)

/**
 * Toggles visibility of a column in the table
 * @param {string} key - Column identifier to toggle
 * @returns {void}
 */
const handleFilterColumnChange = (key: string): void => {
  if (!filterColumns.value.includes(key)) {
    filterColumns.value.push(key)
  } else {
    filterColumns.value = filterColumns.value.filter((item) => item !== key)
  }
}

/**
 * Handles file export operation
 * @returns {Promise<void>}
 */
const handleExportFile = async (): Promise<void> => {
  try {
    const response = await window.api.onSaveFileDialog()
    switch (response) {
      case ApiResponses.RESOLVED_SUCCESSFULLY:
        wasSuccessful.value = true
        break
      case ApiResponses.ERROR_RESOLVING_CONFIG:
        hasErrors.value = true
        break
      case ApiResponses.OPERATION_CANCELLED:
        hasErrors.value = false
        break
      default:
        hasErrors.value = true
        break
    }
  } catch (error) {
    hasErrors.value = true
  }
}

/**
 * Selects all available columns for display
 * @returns {void}
 */
const handleSelectAll = (): void => {
  filterColumns.value = checkboxOptionsData.map((option) => option.key)
}

/**
 * Deselects all columns
 * @returns {void}
 */
const handleSelectNone = (): void => {
  filterColumns.value = []
}
</script>

<template>
  <v-app theme="dark">
    <v-navigation-drawer v-model="drawer">
      <v-list select-strategy="classic">
        <v-list-subheader>Filter Columns</v-list-subheader>
        <v-btn
          density="compact"
          class="mb-4 ms-4"
          text="All"
          @click="handleSelectAll"
        />
        <v-btn
          density="compact"
          class="mb-4 ms-2"
          text="None"
          @click="handleSelectNone"
        />
        <template
          v-for="checkbox in checkboxOptionsData"
          :key="checkbox.key"
        >
          <v-list-item
            :value="checkbox.value"
            density="compact"
            @click="handleFilterColumnChange(checkbox.value)"
          >
            <template #prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="filterColumns"
                  :value="checkbox.value"
                  density="compact"
                />
              </v-list-item-action>
            </template>
            <v-list-item-title>{{ checkbox.label }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
      <v-divider />
      <Versions class="my-10" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title v-if="configData === undefined">
        <v-card :title="'Mirth Connect Channel Overview'" />
      </v-app-bar-title>
      <v-app-bar-title v-else>
        <v-card
          :title="'Mirth Connect Channel Overview'"
          :subtitle="`mirth v.${configData?.metadata?.version} | date ${configData?.metadata?.date}`"
        />
      </v-app-bar-title>
      <v-container
        v-if="channels && channels.length !== 0"
        class="searchbar"
      >
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          variant="solo-filled"
          density="compact"
          hide-details
          clearable
        />
      </v-container>
      <v-btn
        class="ma-2"
        size="small"
        theme="dark"
        prepend-icon="mdi-undo"
        text="Reset"
        stacked
        :disabled="channels.length === 0"
        @click="() => { channels = [], configData = undefined, resetChannels = true }"
      />
      <v-btn
        class="me-2"
        variant="text"
        size="small"
        theme="dark"
        prepend-icon="mdi-file-export-outline"
        text="Export"
        stacked
        :disabled="channels.length === 0"
        @click="handleExportFile"
      />
    </v-app-bar>
    <v-main>
      <DataTable
        :column-filter="filterColumns"
        :search="search"
        :reset-channels="resetChannels"
        @update:reset-channels="(response) => (resetChannels = response)"
        @channels="(channelsData) => (channels = channelsData)"
        @config-data="(extractedData) => (configData = extractedData)"
      >
        loading Data Table Module...
      </DataTable>
      <v-snackbar
        v-model="hasErrors"
        :timeout="timeout"
        color="error"
      >
        <v-alert
          type="error"
          close-label="Close Alert"
          closable
          text="An Error occured while exporting the file!"
          @click:close="() => (hasErrors = false)"
        />
      </v-snackbar>
      <v-snackbar
        v-model="wasSuccessful"
        :timeout="timeout"
        color="success"
      >
        <v-alert
          type="success"
          close-label="Close Success"
          closable
          text="File export successful!"
          @click:close="() => (wasSuccessful = false)"
        />
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
