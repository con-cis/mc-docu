import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tsconfigPaths from 'vite-tsconfig-paths'

export default {
  plugins: [vue(), vuetify(), tsconfigPaths()]
}
