<template>
  <aside class="sidebar">

    <header class="sidebar-header">
      <div class="logo">ljv<span>canvas</span></div>
      <div class="header-btns">
        <button
          class="icon-btn"
          :class="{ active: running }"
          @click="$emit('toggle-play')"
          :title="running ? 'Pause (Space)' : 'Play (Space)'"
        >
          {{ running ? '⏸' : '▶' }}
        </button>
        <button class="icon-btn" @click="$emit('clear')" title="Clear (C)">✕</button>
      </div>
    </header>

    <div class="sidebar-body">

      <!-- Formula -->
      <section class="section">
        <div class="section-title">Formula</div>
        <div class="formula-box">
          x = sin(<span class="val">{{ params.fx }}</span>t + <span class="val">{{ deltaLabel }}</span>)<br>
          y = sin(<span class="val">{{ params.fy }}</span>t)
        </div>
      </section>

      <!-- Frequency -->
      <section class="section">
        <div class="section-title">Frequency</div>
        <div class="num-row">
          <span class="num-label">freq_x</span>
          <div class="num-ctrl">
            <button @click="$emit('set-fx', params.fx - 1)">−</button>
            <span class="num-val">{{ params.fx }}</span>
            <button @click="$emit('set-fx', params.fx + 1)">+</button>
          </div>
        </div>
        <div class="num-row">
          <span class="num-label">freq_y</span>
          <div class="num-ctrl">
            <button @click="$emit('set-fy', params.fy - 1)">−</button>
            <span class="num-val">{{ params.fy }}</span>
            <button @click="$emit('set-fy', params.fy + 1)">+</button>
          </div>
        </div>
        <SliderRow
          label="delta"
          :min="0" :max="628" :step="1"
          :model-value="deltaSliderVal"
          :display-value="deltaLabel"
          @update:model-value="$emit('set-delta', $event)"
        />
      </section>

      <!-- Render -->
      <section class="section">
        <div class="section-title">Render</div>
        <SliderRow label="speed" :min="1"  :max="100" v-model="params.speed" />
        <SliderRow label="size"  :min="1"  :max="12"  :step="0.5" v-model="params.thick" />
        <SliderRow label="glow"  :min="0"  :max="30"  v-model="params.glow" />
        <SliderRow label="fade"  :min="0"  :max="100" v-model="params.fade" />
      </section>

      <!-- Color -->
      <section class="section">
        <div class="section-title">Color</div>
        <div class="color-row">
          <div
            v-for="(cm, key) in colorModes"
            :key="key"
            class="color-chip"
            :class="{ on: params.colorMode === key }"
            :style="cm.style"
            :title="cm.label"
            @click="params.colorMode = key"
          />
        </div>
      </section>

      <!-- Options -->
      <section class="section">
        <div class="section-title">Options</div>
        <ToggleRow label="Show dot"    v-model="params.showDot" />
        <ToggleRow label="Delta drift" v-model="params.autoDrift" />
        <ToggleRow label="Mirror ×4"   v-model="params.mirror" />
      </section>

      <!-- Presets -->
      <section class="section">
        <div class="section-title">Presets</div>
        <div class="chips">
          <button
            v-for="key in presetKeys"
            :key="key"
            class="chip"
            :class="{ on: activePreset === key }"
            @click="selectPreset(key)"
          >
            {{ key.replace(':', '∶') }}
          </button>
        </div>
      </section>

    </div>

    <footer class="sidebar-footer">
      <button class="btn danger" @click="$emit('clear')">Clear</button>
      <button class="btn primary" @click="$emit('export')">Export PNG</button>
    </footer>

  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import SliderRow from './SliderRow.vue'
import ToggleRow from './ToggleRow.vue'
import { PRESETS } from '../composables/useLissajous.js'

const props = defineProps({
  params:     { type: Object, required: true },
  running:    { type: Boolean, required: true },
  deltaLabel: { type: String, required: true },
})

const emit = defineEmits(['toggle-play', 'clear', 'export', 'set-fx', 'set-fy', 'set-delta'])

const presetKeys = Object.keys(PRESETS)
const activePreset = ref('3:2')

function selectPreset(key) {
  activePreset.value = key
  emit('set-preset', key)
}

// Delta slider value is 0–628 (representing 0–2π × 100)
const deltaSliderVal = computed(() => Math.round((props.params.delta / (Math.PI * 2)) * 628))

const colorModes = {
  green:    { label: 'Green',    style: { background: '#00ff41' } },
  white:    { label: 'White',    style: { background: '#e0ede0' } },
  amber:    { label: 'Amber',    style: { background: '#ffb300' } },
  cyan:     { label: 'Cyan',     style: { background: '#00e5ff' } },
  pink:     { label: 'Pink',     style: { background: '#ff4fc8' } },
  spectrum: { label: 'Spectrum', style: { background: 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)' } },
}
</script>

<script>
export default { emits: ['set-preset'] }
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--white);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.sidebar-header {
  padding: 14px 16px 13px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.logo {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.logo span { color: var(--accent); }

.header-btns { display: flex; gap: 6px; }

.icon-btn {
  width: 28px; height: 28px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--white);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background .12s, border-color .12s;
  color: var(--muted);
  font-size: 12px;
  font-family: var(--font);
}
.icon-btn:hover  { background: var(--off); border-color: #bbb; color: var(--text); }
.icon-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.section {
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
}

.section-title {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}

.formula-box {
  background: var(--off);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
  line-height: 2;
  font-size: 12.5px;
  color: var(--muted);
}
.formula-box .val { color: var(--accent); font-weight: 500; }

.num-row {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}
.num-label { width: 52px; color: var(--muted); font-size: 12px; flex-shrink: 0; }

.num-ctrl {
  display: flex; align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  flex: 1;
}
.num-ctrl button {
  width: 26px; height: 28px;
  border: none;
  background: var(--off);
  color: var(--muted);
  font-size: 14px;
  cursor: pointer;
  transition: background .1s, color .1s;
  flex-shrink: 0;
  font-family: var(--font);
  display: flex; align-items: center; justify-content: center;
}
.num-ctrl button:hover { background: var(--border); color: var(--text); }
.num-val {
  flex: 1; text-align: center;
  font-size: 13px; font-weight: 500;
  font-family: var(--font);
}

.color-row { display: flex; gap: 6px; flex-wrap: wrap; }
.color-chip {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform .12s, border-color .12s;
}
.color-chip:hover { transform: scale(1.15); }
.color-chip.on { border-color: var(--text); }

.chips { display: flex; flex-wrap: wrap; gap: 5px; }
.chip {
  font-family: var(--font);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--muted);
  cursor: pointer;
  transition: all .12s;
}
.chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
.chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }

.sidebar-footer {
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  display: flex; gap: 6px;
  flex-shrink: 0;
}

.btn {
  flex: 1; height: 32px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--white);
  font-family: var(--font);
  font-size: 11.5px;
  letter-spacing: 0.03em;
  color: var(--text);
  cursor: pointer;
  transition: all .12s;
}
.btn:hover  { background: var(--off); border-color: #bbb; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: white; }
.btn.primary:hover { background: #2266bb; }
.btn.danger  { color: var(--red); }
.btn.danger:hover { background: #ffeaea; border-color: var(--red); }
</style>
