/** Short synthetic “wood” move sounds; uses Web Audio (no asset files). */

let sharedCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new Ctx();
  }
  return sharedCtx;
};

const softClick = (ctx: AudioContext, t0: number, capture: boolean) => {
  const dur = capture ? 0.11 : 0.09;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "triangle";
  const f0 = capture ? 220 : 380;
  const f1 = capture ? 140 : 260;
  osc.frequency.setValueAtTime(f0, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 40), t0 + dur);

  const peak = capture ? 0.22 : 0.14;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.02);

  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
};

const noiseThud = (ctx: AudioContext, t0: number) => {
  const len = Math.ceil(ctx.sampleRate * 0.06);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filt.type = "lowpass";
  filt.frequency.value = 900;
  src.connect(filt);
  filt.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07);
  src.start(t0);
};

/**
 * Plays when a piece completes a legal move (human, robot, or helper).
 * Capture moves add a brief noise layer for a heavier “take” feel.
 */
export function playPieceMoveSound(capture: boolean): void {
  const ctx = getCtx();
  if (!ctx) return;
  void ctx.resume().catch(() => {});

  const t0 = ctx.currentTime;
  softClick(ctx, t0, capture);
  if (capture) {
    noiseThud(ctx, t0 + 0.012);
  }
}
