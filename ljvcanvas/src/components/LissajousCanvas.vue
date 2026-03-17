<template>
  <div class="canvas-area">
    <canvas ref="canvasEl" />
    <div class="badge badge-tl">ljvcanvas</div>
    <div class="badge badge-tr">
      x=sin({{ params.fx }}t+{{ deltaLabel }}) · y=sin({{ params.fy }}t)
    </div>
    <div class="badge badge-br">space · c · ←→↑↓</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLissajous } from '../composables/useLissajous.js'

const canvasEl = ref(null)

const lissajous = useLissajous(canvasEl)

// Expose everything the parent needs
defineExpose(lissajous)

const { params, deltaLabel } = lissajous
</script>

<style scoped>
.canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #111;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.badge {
  position: absolute;
  padding: 5px 10px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  font-size: 10.5px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.06em;
  pointer-events: none;
  font-family: var(--font);
}

.badge-tl { top: 14px; left: 14px; }
.badge-tr { top: 14px; right: 14px; }
.badge-br { bottom: 14px; right: 14px; }
</style>
