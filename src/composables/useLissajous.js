import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'

export const PRESETS = {
  '3:2':   { fx: 3,  fy: 2,  delta: Math.PI / 2 },
  '5:4':   { fx: 5,  fy: 4,  delta: Math.PI / 2 },
  '1:1':   { fx: 1,  fy: 1,  delta: Math.PI / 4 },
  '5:3':   { fx: 5,  fy: 3,  delta: Math.PI / 2 },
  '7:6':   { fx: 7,  fy: 6,  delta: Math.PI / 3 },
  '4:3':   { fx: 4,  fy: 3,  delta: Math.PI / 2 },
  '8:7':   { fx: 8,  fy: 7,  delta: Math.PI / 2 },
  '11:10': { fx: 11, fy: 10, delta: Math.PI / 6 },
}

export const COLOR_MODES = {
  green:    () => '0,255,65',
  white:    () => '210,235,210',
  amber:    () => '255,175,0',
  cyan:     () => '0,229,255',
  pink:     () => '255,79,200',
  spectrum: (t) => hslToRgb((t * 20) % 360, 100, 60),
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return `${~~(f(0) * 255)},${~~(f(8) * 255)},${~~(f(4) * 255)}`
}

export function formatDelta(delta) {
  const PI = Math.PI
  const d = ((delta % (PI * 2)) + PI * 2) % (PI * 2)
  const map = [
    [0, '0'], [PI/6, 'π/6'], [PI/4, 'π/4'], [PI/3, 'π/3'],
    [PI/2, 'π/2'], [2*PI/3, '2π/3'], [3*PI/4, '3π/4'],
    [PI, 'π'], [3*PI/2, '3π/2'], [2*PI, '2π'],
  ]
  const best = map.reduce((a, b) => Math.abs(b[0] - d) < Math.abs(a[0] - d) ? b : a)
  return Math.abs(best[0] - d) < 0.06 ? best[1] : d.toFixed(2)
}

export function useLissajous(canvasRef) {
  // ── Params ────────────────────────────────────────
  const params = reactive({
    fx:        3,
    fy:        2,
    delta:     Math.PI / 2,
    speed:     20,
    thick:     1.5,
    glow:      10,
    fade:      0,
    colorMode: 'green',
    showDot:   true,
    autoDrift: false,
    mirror:    false,
  })

  const running    = ref(true)
  const deltaLabel = ref('π/2')

  // internal
  let ctx      = null
  let animId   = null
  let t        = 0
  let lastTime = 0

  // ── Canvas helpers ────────────────────────────────
  function getCanvas() { return canvasRef.value }

  function resize() {
    const canvas = getCanvas()
    if (!canvas) return
    const parent = canvas.parentElement
    canvas.width  = parent.clientWidth
    canvas.height = parent.clientHeight
    clear()
  }

  function clear() {
    const canvas = getCanvas()
    if (!ctx || !canvas) return
    ctx.fillStyle = '#0d0d0d'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    t = 0
  }

  // ── Draw loop ─────────────────────────────────────
  function frame(ts) {
    animId = requestAnimationFrame(frame)
    if (!running.value) return

    const canvas = getCanvas()
    if (!canvas || !ctx) return

    const dt = Math.min((ts - lastTime) / 1000, 0.05)
    lastTime = ts

    // Fade trail
    if (params.fade > 0) {
      ctx.fillStyle = `rgba(13,13,13,${(params.fade / 100) * 0.18})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Auto-drift delta
    if (params.autoDrift) {
      params.delta += dt * 0.07
      deltaLabel.value = formatDelta(params.delta)
    }

    const steps = Math.max(1, Math.floor(params.speed * dt * 7))
    const dT    = (params.speed / 1000) * dt * Math.PI * 2 / steps
    const cx    = canvas.width  / 2
    const cy    = canvas.height / 2
    const R     = Math.min(canvas.width, canvas.height) * 0.42

    let lx, ly

    for (let s = 0; s < steps; s++) {
      t += dT

      const rgb = params.colorMode === 'spectrum'
        ? COLOR_MODES.spectrum(t)
        : COLOR_MODES[params.colorMode]?.() ?? COLOR_MODES.green()

      const px = cx + Math.sin(params.fx * t + params.delta) * R
      const py = cy + Math.sin(params.fy * t) * R

      // Glow halo
      if (params.glow > 0) {
        const gr = ctx.createRadialGradient(px, py, 0, px, py, params.thick + params.glow * 0.7)
        gr.addColorStop(0, `rgba(${rgb},${0.1 + params.glow * 0.007})`)
        gr.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = gr
        ctx.beginPath()
        ctx.arc(px, py, params.thick + params.glow * 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      // Core point
      ctx.fillStyle = `rgba(${rgb},0.95)`
      ctx.beginPath()
      ctx.arc(px, py, params.thick * 0.55, 0, Math.PI * 2)
      ctx.fill()

      // Mirror ×4
      if (params.mirror) {
        const mirrors = [
          [cx - (px - cx), cy + (py - cy)],
          [cx + (px - cx), cy - (py - cy)],
          [cx - (px - cx), cy - (py - cy)],
        ]
        for (const [qx, qy] of mirrors) {
          ctx.beginPath()
          ctx.arc(qx, qy, params.thick * 0.55, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      lx = px; ly = py
    }

    // Leading dot
    if (params.showDot && lx != null) {
      const gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, params.thick * 7)
      gr.addColorStop(0,   'rgba(255,255,255,0.9)')
      gr.addColorStop(0.3, 'rgba(255,255,255,0.35)')
      gr.addColorStop(1,   'rgba(255,255,255,0)')
      ctx.fillStyle = gr
      ctx.beginPath()
      ctx.arc(lx, ly, params.thick * 7, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // ── Public actions ────────────────────────────────
  function togglePlay() {
    running.value = !running.value
    if (running.value) lastTime = performance.now()
  }

  function applyPreset(key) {
    const p = PRESETS[key]
    if (!p) return
    params.fx    = p.fx
    params.fy    = p.fy
    params.delta = p.delta
    deltaLabel.value = formatDelta(p.delta)
    clear()
  }

  function setFx(v) {
    params.fx = Math.max(1, Math.min(12, v))
    clear()
  }

  function setFy(v) {
    params.fy = Math.max(1, Math.min(12, v))
    clear()
  }

  function setDelta(sliderVal) {
    // slider is 0–628 representing 0–2π
    params.delta = sliderVal / 100
    deltaLabel.value = formatDelta(params.delta)
    clear()
  }

  function exportPng() {
    const canvas = getCanvas()
    if (!canvas) return
    const off = document.createElement('canvas')
    off.width  = canvas.width
    off.height = canvas.height
    const oc = off.getContext('2d')
    oc.fillStyle = '#0d0d0d'
    oc.fillRect(0, 0, off.width, off.height)
    oc.drawImage(canvas, 0, 0)
    const a = document.createElement('a')
    a.download = `ljvcanvas_${params.fx}-${params.fy}_${Date.now()}.png`
    a.href = off.toDataURL()
    a.click()
  }

  // ── Lifecycle ─────────────────────────────────────
  onMounted(() => {
    const canvas = getCanvas()
    ctx = canvas.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    lastTime = performance.now()
    animId = requestAnimationFrame(frame)
  })

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })

  // Keep deltaLabel in sync when delta changed externally
  watch(() => params.delta, (v) => {
    deltaLabel.value = formatDelta(v)
  })

  return {
    params,
    running,
    deltaLabel,
    togglePlay,
    clear,
    applyPreset,
    setFx,
    setFy,
    setDelta,
    exportPng,
  }
}
