<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { VDataTable } from 'vuetify/components';
import { ChannelData } from '../../../models';
import { ConfigData } from '../../../types/ConfigData';
import { headerData } from '../data/headerData';
import ApiResponses from '../../../enums/ApiResponses';

const channels = ref<ChannelData | any>(null);
const isLoading = ref(false);
const hasErrors = ref(false);
const dialog = ref(false);
const selectedChannel = ref<ChannelData | null>(null);
const headers = ref<any | object[]>([]);
const itemsPerPage = ref(10);
const timeout = ref(5000);

const props = defineProps({
  columnFilter: Array,
  search: String,
  resetChannels: Boolean,
})

const emit = defineEmits(['update:resetChannels', 'channels', 'configData'])

headers.value.push(
  ...headerData
);

function fetchConfig() {
  window.api.onGetConfig((_event, data: ConfigData) => {
    if (data) {
      channels.value = data.extractedData.channels;
      emit('channels', channels.value);
      emit('configData', data);
    } else {
      isLoading.value = false;
    }
  });
}

const filteredHeaders = computed(() => {
  const preservedHeaderKeys = ["annotation", "data-table-expand", "name"];
  return headers.value.filter((item: any) => {
    return props.columnFilter!.includes(item.key) || preservedHeaderKeys.includes(item.key);
  });
});

const setSelectedChannel = (channel: ChannelData) => {
  selectedChannel.value = channel;
  dialog.value = true;
};

const openFileDialog = async () => {
  isLoading.value = true;
  hasErrors.value = false;
  const response = await window.api.onOpenFileDialog();
  switch (response) {
    case ApiResponses.RESOLVED_SUCCESSFULLY:
      break;
    case ApiResponses.ERROR_RESOLVING_CONFIG:
      hasErrors.value = true;
      break;
    case ApiResponses.OPERATION_CANCELLED:
      break;
    default:
      hasErrors.value = true;
      break;
  }
  isLoading.value = false;
};

// Not implemented yet
// const save = () => {
//   
//   console.info("Saving to DB")
// };

fetchConfig();

watch(() => props.resetChannels, () => {
  isLoading.value = false;
  channels.value = null;
  emit('update:resetChannels', false);
});

</script>

<template>
  <p v-if="!channels" class="mx-auto my-auto">
    <v-btn size="x-large" elevation="8" theme="dark" prepend-icon="mdi-paperclip" :loading="isLoading"
      @click="openFileDialog" text="Add a Mirth Configuration Backup XML or JSON" />
  </p>
  <v-snackbar v-model="hasErrors" :timeout="timeout" color="error">
    <v-alert type="error" close-label="Close Alert" @click:close="() => hasErrors = false" closable
      text="An Error occured while loading the file. Currently only Backup Conifguration Exports from Mirth Connect are supported!">
    </v-alert>
  </v-snackbar>
  <v-card v-if="channels" theme="dark">
    <v-data-table :headers="filteredHeaders" :items="channels" :search="props.search"
      v-model:items-per-page="itemsPerPage" :hover="true" :expand-on-click="true" density="compact"
      class="elevation-1 mt-5" show-expand>
      <!-- headers -->
      <!-- <template v-slot:headers="{ columns }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <td>
              {{ column.title }}
            </td>
          </template>
        </tr>
      </template> -->
      <!-- table-rows -->
      <template v-slot:table-rows="{ item, columns, index }">
        <tr :key="'s-' + index">
          <td>{{ item.name }}</td>
          <template v-for="column in columns">
            <td v-if="column.value !== 'name'">
              {{ item.sourceConnector[columns.key] }}
            </td>
          </template>
        </tr>
      </template>
      <!-- expanded -->
      <!-- TODO: Try with data-table-row https://vuetifyjs.com/en/api/v-data-table-row/ -->
      <template v-slot:expanded-row="{ item, columns }">
        <tr class="text-medium-emphasis" v-for="(destination, index) in item.destinationConnectors" :key="'d-' + index">
          <td> Destination: {{ index + 1 }}</td>
          <template v-for="column in columns">
            <td v-if="column.key !== 'name'">
              {{ destination[column.key || "null"] }}
            </td>
          </template>
        </tr>
      </template>
      <!-- annotation dialog -->
      <!-- check this out: https://vuetifyjs.com/en/components/data-tables/basics/#crud-actions -->
      <template v-slot:item.annotation="{ item }">
        <v-icon size="small" class="mx-auto" @click.stop="setSelectedChannel(item)">
          mdi-note-plus-outline
        </v-icon>
        <v-dialog v-model="dialog" persistent width="1024">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ selectedChannel ? selectedChannel.name : '' }}</span>
            </v-card-title>
            <v-card-text>
              <v-textarea v-model="item.annotation" :value="item.annotation ?? ''" label="Annotation"
                clearable></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                Close
              </v-btn>
              <!-- <v-btn color="blue-darken-1" variant="text" @click="save(); dialog = false">
                Save
              </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>

<style></style>