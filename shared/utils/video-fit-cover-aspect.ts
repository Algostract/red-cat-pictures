// Orientation control: 'auto' follows cover rule using container vs source ratios,
// while 'landscape' or 'portrait' force the snapping axis (width or height).
type Orientation = 'auto' | 'landscape' | 'portrait'

// ---------- Utilities ----------

/**
 * Return the smallest value in 'list' that is >= x; if none, return the last value.
 * Assumes 'list' is sorted ascending.
 */
function ceilToList(x: number, list: readonly number[]): number {
  for (const v of list) if (v >= x) return v
  return list[list.length - 1]
}

/** Near-equality helper for matching ratios */
function near(a: number, b: number, relTol = 0.02): boolean {
  return Math.abs(a - b) / b <= relTol
}

// ---------- Aspect catalog ----------

type AspectKey = '16:9' | '9:16' | '4:3' | '3:4' | '2:1' | '1:2' | '1:1' | 'other'

const KNOWN_RATIOS: Record<Exclude<AspectKey, 'other'>, number> = {
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '4:3': 4 / 3,
  '3:4': 3 / 4,
  '2:1': 2 / 1,
  '1:2': 1 / 2,
  '1:1': 1 / 1,
}

/** Choose canonical key for a numeric ratio r */
function canonicalAspectKey(r: number): AspectKey {
  for (const [k, v] of Object.entries(KNOWN_RATIOS) as [AspectKey, number][]) {
    if (near(r, v)) return k
  }
  return 'other'
}

// ---------- Ladders (resolution families) ----------

// Base families (ascending, encoder-friendly, common standards)
const WIDTHS_16_9 = [1280] as const // , 1920, 2560] as const
const HEIGHTS_16_9 = [720] as const //, 1080, 1440] as const

const WIDTHS_4_3 = [1024] as const //, 1600, 2048] as const
const HEIGHTS_4_3 = [768] as const //, 1200, 1536] as const

const WIDTHS_2_1 = [1280] as const //, 1920, 2560] as const
const HEIGHTS_2_1 = [640] as const //, 960, 1280] as const

const SQUARE = [512] as const //, 1024, 2048] as const

// For portrait counterparts, mirror the families across axes
const HEIGHTS_9_16 = WIDTHS_16_9
const WIDTHS_9_16 = HEIGHTS_16_9

const HEIGHTS_3_4 = WIDTHS_4_3
const WIDTHS_3_4 = HEIGHTS_4_3

const HEIGHTS_1_2 = WIDTHS_2_1
const WIDTHS_1_2 = HEIGHTS_2_1

// Fallback ladders for unknown/other ratios
const DEFAULT_WIDTHS = [1080] as const //, 1080, 1440] as const
const DEFAULT_HEIGHTS = [1080] as const // 1080, 1440] as const

function pickWidthLadder(r: number): readonly number[] {
  switch (canonicalAspectKey(r)) {
    case '16:9':
      return WIDTHS_16_9
    case '9:16':
      return WIDTHS_9_16
    case '4:3':
      return WIDTHS_4_3
    case '3:4':
      return WIDTHS_3_4
    case '2:1':
      return WIDTHS_2_1
    case '1:2':
      return WIDTHS_1_2
    case '1:1':
      return SQUARE
    default:
      return DEFAULT_WIDTHS
  }
}

function pickHeightLadder(r: number): readonly number[] {
  switch (canonicalAspectKey(r)) {
    case '16:9':
      return HEIGHTS_16_9
    case '9:16':
      return HEIGHTS_9_16
    case '4:3':
      return HEIGHTS_4_3
    case '3:4':
      return HEIGHTS_3_4
    case '2:1':
      return HEIGHTS_2_1
    case '1:2':
      return HEIGHTS_1_2
    case '1:1':
      return SQUARE
    default:
      return DEFAULT_HEIGHTS
  }
}

// ---------- Core: coverByAspect ----------

/**
 * Compute snapped cover dimensions as "WxH" for a source ratio r = width/height.
 * - orientation:
 *   - 'auto' => follow cover rule using container vs source ratio
 *   - 'landscape' => force snap-by-width (choose width ladder)
 *   - 'portrait' => force snap-by-height (choose height ladder)
 * The chosen dimension is the smallest ladder entry that guarantees cover.
 */
export default function (
  orientation: Orientation,
  r: number, // source ratio = width / height
  containerW: number, // container width in px
  containerH: number // container height in px
): string {
  const c = containerW / containerH

  // Axis selection: orientation can override auto cover decision.
  const snapByWidth = orientation === 'landscape' ? true : orientation === 'portrait' ? false : c > r // auto: if container is wider than source, scale by width

  // Axis-specific ladders
  const widths = pickWidthLadder(r)
  const heights = pickHeightLadder(r)

  let finalW: number
  let finalH: number

  if (snapByWidth) {
    // Minimum width to ensure cover even when c < r (i.e., when height would otherwise be short)
    const minW = Math.max(containerW, Math.ceil(containerH * r))
    const snappedW = ceilToList(minW, widths)
    finalW = snappedW
    finalH = Math.round(snappedW / r)
  } else {
    // Minimum height to ensure cover even when c > r (i.e., when width would otherwise be short)
    const minH = Math.max(containerH, Math.ceil(containerW / r))
    const snappedH = ceilToList(minH, heights)
    finalH = snappedH
    finalW = Math.round(snappedH * r)
  }

  return `${finalW}x${finalH}`
}
