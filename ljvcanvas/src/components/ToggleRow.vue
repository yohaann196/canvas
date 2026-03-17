<template>
  <div class="toggle-row">
    <span class="toggle-label">{{ label }}</span>
    <div
      class="switch"
      :class="{ on: modelValue }"
      @click="$emit('update:modelValue', !modelValue)"
    />
  </div>
</template>

<script setup>
defineProps({
  label:      { type: String,  required: true },
  modelValue: { type: Boolean, required: true },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}

.toggle-label { font-size: 12px; color: var(--text); }

.switch {
  width: 34px; height: 18px;
  border-radius: 9px;
  background: var(--border);
  position: relative;
  cursor: pointer;
  transition: background .2s;
  flex-shrink: 0;
}
.switch.on { background: var(--accent); }
.switch::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  transition: left .2s;
}
.switch.on::after { left: 18px; }
</style>
