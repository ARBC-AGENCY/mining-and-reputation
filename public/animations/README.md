# Preloader animation

Drop your Lottie here as `preloader.lottie` (or `preloader.json` — update
`LOTTIE_SRC` in `src/components/preloader/Preloader.tsx` if you use `.json`).

While no file is present the preloader falls back to the white logo mark, so
nothing looks broken. The component probes this path with a HEAD request on
first paint and switches automatically once the file exists.

`.lottie` is preferred — it is roughly 3x smaller than the equivalent `.json`.
