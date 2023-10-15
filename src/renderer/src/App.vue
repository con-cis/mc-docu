<script setup lang="ts">
import { ref } from 'vue'
import Versions from './components/Versions.vue'
import DataTable from './components/DataTable.vue';
import { checkboxOptionsData } from './data/checkboxOptionsData';
import { ConfigData } from 'src/types/ConfigData';
import { ChannelData } from 'src/models';
import ApiResponses from '../../enums/ApiResponses';
import '@mdi/font/css/materialdesignicons.css';

const search = ref('');
const drawer = ref(false)
const channels = ref<ChannelData | null>(null);
const configData = ref<ConfigData | null>(null);
const resetChannels = ref(false);
const timeout = ref(5000);
const hasErrors = ref(false);
const wasSuccessful = ref(false);

const DEFAULT_COLUMNS = [
  "id",
  "connectorName",
  "transportName",
  "inboundDataType",
  "outboundDataType",
  "enabled"
];

const filterColumns = ref<string[]>(DEFAULT_COLUMNS);

const handleFilterColumnChange = (key: string) => {
  if (!filterColumns.value.includes(key)) {
    filterColumns.value.push(key);
  } else {
    filterColumns.value = filterColumns.value.filter(item => item !== key);
  }
}

const handleExportFile = async () => {
  try {
    const response = await window.api.onSaveFileDialog(JSON.stringify(configData.value));
    switch (response) {
      case ApiResponses.RESOLVED_SUCCESSFULLY:
        wasSuccessful.value = true;
        break;
      case ApiResponses.ERROR_RESOLVING_CONFIG:
        hasErrors.value = true;
        break;
      case ApiResponses.OPERATION_CANCELLED:
        hasErrors.value = false;
        break;
      default:
        hasErrors.value = true;
        break;
    }
  } catch (error) {
    hasErrors.value = true;
  }
};

const handleSelectAll = () => {
  filterColumns.value = checkboxOptionsData.map(option => option.key);
}

const handleSelectNone = () => {
  filterColumns.value = [];
}

</script>

<template>
  <v-app theme="dark">
    <v-navigation-drawer v-model="drawer">
      <v-list select-strategy="classic">
        <v-list-subheader>Filter Columns</v-list-subheader>
        <v-btn density="compact" class="mb-4 ms-4" @click="handleSelectAll">
          All
        </v-btn>
        <v-btn density="compact" class="mb-4 ms-2" @click="handleSelectNone">
          None
        </v-btn>
        <template v-for="checkbox in checkboxOptionsData" :key="checkbox.key">
          <v-list-item :value="checkbox.value" @click="handleFilterColumnChange(checkbox.value)" density="compact">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn v-model="filterColumns" :value="checkbox.value" density="compact"></v-checkbox-btn>
              </v-list-item-action>
            </template>
            <v-list-item-title>{{ checkbox.label }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
      <v-divider></v-divider>
      <Versions class="my-10"></Versions>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title v-if="configData === null">
        <v-card :title="'Mirth Connect Channel Overview'"></v-card>
      </v-app-bar-title>
      <v-app-bar-title v-else>
        <v-card :title="'Mirth Connect Channel Overview'"
          :subtitle="`mirth v.${configData?.metadata.version} | date ${configData?.metadata.date}`">
        </v-card>
      </v-app-bar-title>
      <v-container v-if="channels !== null" class="searchbar">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" variant="solo-filled" density="compact"
          hide-details clearable>
        </v-text-field>
      </v-container>
      <v-btn class="ma-2" size="small" theme="dark" prepend-icon="mdi-undo"
        @click="() => { channels = null, configData = null, resetChannels = true }" text="Reset" stacked
        :disabled="channels === null" />
      <v-btn class="me-2" variant="text" size="small" theme="dark" prepend-icon="mdi-file-export-outline"
        @click="handleExportFile" text="Export" stacked :disabled="channels === null" />
    </v-app-bar>
    <v-main>
      <DataTable :columnFilter="filterColumns" :search="search" :resetChannels="resetChannels"
        @update:resetChannels="(response) => resetChannels = response"
        @channels="(channelsData) => channels = channelsData" @configData="(extractedData) => configData = extractedData">
        loading Data Table Module...
      </DataTable>
      <v-snackbar v-model="hasErrors" :timeout="timeout" color="error">
        <v-alert type="error" close-label="Close Alert" @click:close="() => hasErrors = false" closable
          text="An Error occured while exporting the file!">
        </v-alert>
      </v-snackbar>
      <v-snackbar v-model="wasSuccessful" :timeout="timeout" color="success">
        <v-alert type="success" close-label="Close Success" @click:close="() => wasSuccessful = false" closable
          text="File export successful!">
        </v-alert>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>