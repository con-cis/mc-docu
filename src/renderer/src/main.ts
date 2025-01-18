/**
 * Main application entry point
 *
 * Imports required dependencies:
 * - Vue createApp function for creating the Vue application instance
 * - Vuetify plugin for UI components and styling
 * - Root App component
 *
 * Creates Vue application instance with App component,
 * installs Vuetify plugin, and mounts to #app element in DOM
 */
import { createApp } from 'vue'
import { vuetify } from './plugins/vuetify'
import App from './App.vue'

createApp(App).use(vuetify).mount('#app')
