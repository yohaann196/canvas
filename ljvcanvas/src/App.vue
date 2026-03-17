<template>
  <div class="app">
    <Sidebar
      :params="canvas?.params"
      :running="canvas?.running"
      :delta-label="canvas?.deltaLabel"
      @toggle-play="canvas?.togglePlay()"
      @clear="canvas?.clear()"
      @export="canvas?.exportPng()"
      @set-fx="canvas?.setFx($event)"
      @set-fy="canvas?.setFy($event)"
      @set-delta="canvas?.setDelta($event)"
      @set-preset="canvas?.applyPreset($event)"
    />
    <LissajousCanvas ref="canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import LissajousCanvas from './components/LissajousCanvas.vue'

const canvas = ref(null)

function onKeydown(e) {
  if (e.target.tagName === 'INPUT') return
  if (!canvas.value) return

  if (e.key === ' ')           { e.preventDefault(); canvas.value.togglePlay() }
  if (e.key === 'c' || e.key === 'C') canvas.value.clear()
  if (e.key === 'ArrowRight')  canvas.value.setFx(canvas.value.params.fx + 1)
  if (e.key === 'ArrowLeft')   canvas.value.setFx(canvas.value.params.fx - 1)
  if (e.key === 'ArrowUp')     canvas.value.setFy(canvas.value.params.fy + 1)
  if (e.key === 'ArrowDown')   canvas.value.setFy(canvas.value.params.fy - 1)
}

onMounted(()   => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
}
</style>
