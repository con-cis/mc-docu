<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { VDataTable } from 'vuetify/components';
import { ChannelData, Header } from '../../../models';
import { ConfigData } from '../../../types/ConfigData';
import { headerData } from '../data/headerData';
import ApiResponses from '../../../enums/ApiResponses';

const channels = ref<ChannelData[] | undefined>(undefined);
const isLoading = ref(false);
const hasErrors = ref(false);
const wasSuccessful = ref(false);
const isResetAction = ref(false);
const hasErrorsAnnotation = ref(false);
const dialog = ref(false);
const selectedChannel = ref<ChannelData | undefined>(undefined);
const headers = ref<Header[]>([]);
const itemsPerPage = ref(10);
const timeout = ref(5000);

const props = defineProps({
  columnFilter: {
    type: Array as () => string[],
    default: () => []
  },
  search: {
    type: String,
    default: ''
  },
  resetChannels: {
    type: Boolean,
    default: undefined
  }
})

const emit = defineEmits(['update:resetChannels', 'channels', 'configData'])

headers.value.push(
  ...headerData
);

/**
 * @function fetchConfig
 * @description Fetches configuration data and handles different response statuses
 */
function fetchConfig(): void {
  window.api.onGetConfig((_event, data: ConfigData) => {
    switch (data.status) {
      case ApiResponses.RESOLVED_SUCCESSFULLY:
        channels.value = data.extractedData?.channels;
        emit('channels', channels.value);
        emit('configData', data);
        break;
      case ApiResponses.ERROR_RESOLVING_CONFIG:
        hasErrors.value = true;
        isLoading.value = false;
        break;
      case ApiResponses.OPERATION_CANCELLED:
        isLoading.value = false;
        break;
      default:
        isLoading.value = false;
        break;
    }
  });
}

/**
 * @function openFileDialog
 * @description Opens file dialog to select Mirth configuration file
 * @returns {Promise<void>}
 */
const openFileDialog = async (): Promise<void> => {
  isLoading.value = true;
  window.api.onOpenFileDialog().then(() => {
    fetchConfig();
  });
};

const filteredHeaders = computed(() => {
  const preservedHeaderKeys = ["annotation", "data-table-expand", "name"];
  return headers.value.filter((item) => {
    return props.columnFilter!.includes(item.key) || preservedHeaderKeys.includes(item.key);
  });
});

/**
 * @function setSelectedChannel
 * @description Sets the selected channel and opens annotation dialog
 * @param {ChannelData} channel - Channel to be selected
 */
const setSelectedChannel = (channel: ChannelData): void => {
  selectedChannel.value = channel;
  dialog.value = true;
};

/**
 * @function saveAnnotation
 * @description Saves annotation for selected channel to database
 */
const saveAnnotation = (): void => {
  console.info("Saving to DB")
  window.api.onSetAnnotation({ channelId: selectedChannel.value?.id ?? "", annotation: selectedChannel.value?.annotation ?? "" })
    .then((result) => {
      result === ApiResponses.RESOLVED_SUCCESSFULLY ?
        (wasSuccessful.value = true, isResetAction.value = false) :
        (hasErrorsAnnotation.value = true, isResetAction.value = false)
    })
};

watch(() => props.resetChannels, (newVal) => {
  if (newVal) {
    isLoading.value = false;
    channels.value = [];
    emit('update:resetChannels', false);
    window.api.resetData().then((response) => {
      response === ApiResponses.RESOLVED_SUCCESSFULLY ?
        (wasSuccessful.value = true, isResetAction.value = true) :
        (hasErrors.value = true, isResetAction.value = true)
    });
  }
});

onMounted(fetchConfig);
</script>

<template>
  <p v-if="!channels || channels?.length === 0" class="mx-auto my-auto">
    <v-btn size="x-large" elevation="8" theme="dark" prepend-icon="mdi-paperclip" :loading="isLoading"
      text="Add a Mirth Configuration Backup XML or JSON" @click="openFileDialog" />
  </p>
  <v-snackbar v-model="hasErrors" :timeout="timeout" color="error">
    <v-alert type="error" close-label="Close Alert" closable
      text="An Error occured while loading the file. Currently only Backup Conifguration Exports from Mirth Connect are supported!"
      @click:close="() => hasErrors = false" />
  </v-snackbar>
  <v-snackbar v-model="hasErrorsAnnotation" :timeout="timeout" color="error">
    <v-alert type="error" close-label="Close Alert" closable
      :text="isResetAction ? 'An Error occured while resetting data' : 'An Error occured while saving the annotation!'"
      @click:close="() => (hasErrorsAnnotation = false, isResetAction = false)" />
  </v-snackbar>
  <v-snackbar v-model="wasSuccessful" :timeout="timeout" color="success">
    <v-alert type="success" close-label="Close Success" closable
      :text="isResetAction ? 'Data resetted!' : `Annotation saved succesfully for Channel ${selectedChannel?.name}!`"
      @click:close="() => (wasSuccessful = false, isResetAction = false)" />
  </v-snackbar>
  <v-card v-if="channels && channels?.length > 0" theme="dark">
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="filteredHeaders" :items="channels"
      :search="props.search" :hover="true" :expand-on-click="true" density="compact" class="elevation-1 mt-5"
      show-expand>
      <!-- expanded -->
      <template #expanded-row="{ item, columns }">
        <tr v-for="(destination, rowIndex) in item.destinationConnectors" :key="'d-exp-' + rowIndex"
          class="text-medium-emphasis">
          <td> Destination: {{ rowIndex + 1 }}</td>
          <template v-for="(column, colIndex) in columns" :key="'c-exp-' + colIndex">
            <td v-if="column.key !== 'name'">
              {{ destination[column.key!] }}
            </td>
          </template>
        </tr>
      </template>
      <!-- annotation dialog -->
      <!-- check this out: https://vuetifyjs.com/en/components/data-tables/basics/#crud-actions -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.annotation="{ item }">
        <v-icon size="small" class="mx-auto" icon="mdi-note-plus-outline"
          @click.stop="setSelectedChannel(item as ChannelData)" />
        <v-dialog v-model="dialog" persistent width="1024">
          <v-card>
            <v-card-title class="mt-2">
              <span class="text-h5">{{ selectedChannel!.name }}</span>
            </v-card-title>
            <v-card-text v-if="selectedChannel">
              <v-textarea v-model="selectedChannel.annotation" label="Annotation" clearable persistent-placeholder
                no-resize />
            </v-card-text>
            <v-progress-circular v-else indeterminate />
            <v-card-actions>
              <v-spacer />
              <v-btn class="me-2 mb-3" color="blue-darken-1" variant="text" text="Close" @click="dialog = false" />
              <v-btn class="me-4 mb-3" color="blue-darken-1" variant="elevated" text="Save"
                @click="saveAnnotation(); dialog = false" />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>