<script setup lang="ts">
import { version } from "../../../../package.json";

const versions = { ...window.electron.process.versions }
</script>

<template>
  <ul class="versions">
    <li class="electron-version">
      Electron v{{ versions.electron }}
    </li>
    <li class="chrome-version">
      Chromium v{{ versions.chrome }}
    </li>
    <li class="node-version">
      Node v{{ versions.node }}
    </li>
    <li class="v8-version">
      V8 v{{ versions.v8 }}
    </li>
    <li class="app-version">
      App v{{ version }}
    </li>
  </ul>
</template>
