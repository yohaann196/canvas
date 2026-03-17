<template>
  <div class="sl-row">
    <span class="sl-label">{{ label }}</span>
    <div class="sl-track">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="$emit('update:modelValue', +$event.target.value)"
      />
    </div>
    <span class="sl-val">{{ displayValue ?? modelValue }}</span>
  </div>
</template>

<script setup>
defineProps({
  label:        { type: String,  required: true },
  min:          { type: Number,  default: 0 },
  max:          { type: Number,  default: 100 },
  step:         { type: Number,  default: 1 },
  modelValue:   { type: Number,  required: true },
  displayValue: { type: String,  default: null },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.sl-row {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}

.sl-label {
  width: 52px;
  font-size: 12px;
  color: var(--muted);
  flex-shrink: 0;
}

.sl-track { flex: 1; }

input[type=range] {
  -webkit-appearance: none;
  width: 100%; height: 4px;
  background: var(--border);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 4px var(--accent-light);
}

.sl-val {
  width: 32px;
  text-align: right;
  font-size: 12px;
  color: var(--text);
  font-weight: 500;
}
</style>
