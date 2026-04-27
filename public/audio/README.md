# Atmosphere audio loops

This directory holds optional looping ambient audio assets for the Background
Atmosphere system.

## Drop in your own loops (optional)

The audio engine in `src/audio/atmosphereAudio.ts` looks for these files on
startup:

```
rain-loop.ogg
wind-loop.ogg
wind-chime.ogg   (optional — mixed only in Wind mode; use the Wind chime level slider)
```

If a loop is present, the engine will play it via `AudioBufferSourceNode` with
`loop = true`, which produces a sample-perfect seamless loop with no click or
gap at the boundary. The chime, when present, is a separate one-shot/loop
element mixed under user control; if it is missing, wind mode is unchanged.

If `rain-loop.ogg` or `wind-loop.ogg` is missing, the engine silently falls back
to a procedural Web Audio synthesizer (filtered noise) for that mode. The app
works out of the box without any audio assets.

## What to put here

For best results:

- 30 - 90 second `.ogg` files (Vorbis or Opus). MP3 also works but use OGG for
  smaller file sizes.
- Confirm the loop point is clean — open the file in Audacity, trim any silence,
  and (ideally) crossfade the very end of the file with the very start using
  the "Crossfade Tracks" effect. With `AudioBufferSourceNode.loop = true` an
  uncrossed-faded file will still loop sample-perfectly, but a tiny waveform
  discontinuity at the seam can produce an audible "thump".
- Keep peak around -3dB so the in-app volume slider has headroom.

## Suggested CC0 / royalty-free sources

- [Pixabay Sound Effects](https://pixabay.com/sound-effects/search/rain/) - free
  for commercial use, no attribution required.
- [Freesound](https://freesound.org/) - check each clip's license; many are
  CC0 or CC-BY.
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/) - free for
  personal/educational use.
- [Mixkit Free Ambient Sounds](https://mixkit.co/free-sound-effects/ambient/) -
  free for commercial use.

Search terms that work well:
- `rain loop seamless`
- `light rain ambient`
- `wind howl loop`
- `soft wind ambient`
