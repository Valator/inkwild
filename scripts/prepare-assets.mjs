/**
 * Builds the optimised image assets used by the site from their original sources.
 *
 *   npm run assets
 *
 * Sources (override with environment variables if your files live elsewhere):
 *   MG_ART_DIR      Magical Garden Unity project art     (default ~/MagicalGarden/Assets/Art)
 *   MG_DESIGN_DIR   Magical Garden design proposals       (default ~/MagicalGarden/DesignProposals)
 *   IW_LOGO_SOURCE  InkWild Games logo original            (default assets-source/inkwild-logo.webp)
 *
 * The generated files are committed, so this only needs to run when a source changes.
 *
 * The InkWild Games logo is the supplied original, kept untouched in assets-source/inkwild-logo.webp.
 * The original has a pure-black background and no alpha channel, so the black is keyed out to
 * transparency (colours of the artwork are untouched; see keyOutBlack). Nothing is redrawn or recoloured.
 */
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const home = homedir()
const ART = process.env.MG_ART_DIR ?? path.join(home, 'MagicalGarden/Assets/Art')
const DESIGN = process.env.MG_DESIGN_DIR ?? path.join(home, 'MagicalGarden/DesignProposals')

const out = (...p) => path.join(root, ...p)
const LOGO_SOURCE = process.env.IW_LOGO_SOURCE ?? out('assets-source/inkwild-logo.webp')
const brandDir = out('src/assets/brand')
const gamesDir = out('src/assets/games')
await Promise.all([mkdir(brandDir, { recursive: true }), mkdir(gamesDir, { recursive: true }), mkdir(out('public'), { recursive: true })])

const done = []
async function run(label, source, task) {
  if (!existsSync(source)) {
    console.warn(`skip  ${label} (missing source: ${source})`)
    return
  }
  await task()
  done.push(label)
}

const webp = (quality = 80) => ({ quality, effort: 5 })

// ---- Brand: InkWild Games logo + emblem --------------------------------------------
/** Turns the logo's pure-black backdrop transparent (only near-black pixels; artwork colours are kept). */
async function keyOutBlack(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const rgba = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
    const peak = Math.max(r, g, b)
    rgba[i * 4] = r
    rgba[i * 4 + 1] = g
    rgba[i * 4 + 2] = b
    rgba[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(((peak - 1) / 11) * 255)))
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
}

await run('brand/inkwild-logo.webp', LOGO_SOURCE, async () => {
  const logo = (await keyOutBlack(LOGO_SOURCE)).resize({ width: 1000, kernel: 'lanczos3' })
  await logo.clone().webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(path.join(brandDir, 'inkwild-logo.webp'))
  // PNG copy for JSON-LD / external consumers.
  await logo.clone().png({ compressionLevel: 9 }).toFile(out('public/inkwild-logo.png'))
})

await run('brand/inkwild-emblem + favicons', LOGO_SOURCE, async () => {
  // The IW monogram occupies the left part of the lockup.
  const emblem = await (await keyOutBlack(LOGO_SOURCE)).extract({ left: 30, top: 0, width: 880, height: 750 }).png().toBuffer()
  const fit = (size) =>
    sharp(emblem).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' }).png()
  await fit(256).toFile(path.join(brandDir, 'inkwild-emblem.png'))
  await fit(64).toFile(out('public/favicon.png'))
  await fit(180).toFile(out('public/apple-touch-icon.png'))
})

// ---- Magical Garden art -------------------------------------------------------------
await run('games/magical-garden-logo.webp', path.join(ART, 'UI/logo.png'), () =>
  sharp(path.join(ART, 'UI/logo.png')).resize({ width: 900 }).webp(webp(88)).toFile(path.join(gamesDir, 'magical-garden-logo.webp')),
)
await run('games/fairy.webp', path.join(ART, 'Characters/mascot.png'), () =>
  sharp(path.join(ART, 'Characters/mascot.png')).resize({ width: 720 }).webp(webp(88)).toFile(path.join(gamesDir, 'fairy.webp')),
)
for (const [name, file] of [
  ['play-screen', '01_play_screen.png'],
  ['menu-screen', '03_main_menu.png'],
]) {
  await run(`games/${name}.webp`, path.join(DESIGN, file), () =>
    sharp(path.join(DESIGN, file)).resize({ width: 720 }).webp(webp(84)).toFile(path.join(gamesDir, `${name}.webp`)),
  )
}

for (const [name, file] of [
  ['hero-garden', 'maze_stage4.jpg'],
  ['garden-bg', 'garden_stage4.jpg'],
  ['creek-bg', 'creek_stage4.jpg'],
  ['orchard-bg', 'orchard_stage4.jpg'],
]) {
  await run(`games/${name}.webp`, path.join(ART, 'Garden', file), () =>
    sharp(path.join(ART, 'Garden', file)).webp(webp(78)).toFile(path.join(gamesDir, `${name}.webp`)),
  )
}

for (const tile of ['leaf', 'flower', 'mushroom', 'potion', 'fruit', 'firefly']) {
  await run(`games/tile-${tile}.webp`, path.join(ART, 'Tiles', `${tile}.png`), () =>
    sharp(path.join(ART, 'Tiles', `${tile}.png`)).resize({ width: 256 }).webp(webp(88)).toFile(path.join(gamesDir, `tile-${tile}.webp`)),
  )
}

// ---- Social share image (1200x630) ---------------------------------------------------
await run('public/og-image.jpg', path.join(ART, 'Garden/maze_stage4.jpg'), async () => {
  const bg = await sharp(path.join(ART, 'Garden/maze_stage4.jpg'))
    .resize({ width: 1200 })
    .extract({ left: 0, top: 120, width: 1200, height: 630 })
    .toBuffer()
  const shade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
       <defs><linearGradient id="g" x1="0" x2="1">
         <stop offset="0" stop-color="#191820" stop-opacity=".96"/>
         <stop offset=".55" stop-color="#191820" stop-opacity=".7"/>
         <stop offset="1" stop-color="#191820" stop-opacity=".25"/>
       </linearGradient></defs>
       <rect width="1200" height="630" fill="url(#g)"/>
     </svg>`,
  )
  const logo = await sharp(path.join(brandDir, 'inkwild-logo.webp')).resize({ width: 520 }).toBuffer()
  await sharp(bg)
    .composite([
      { input: shade },
      { input: logo, left: 80, top: 190 },
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="120">
             <text x="0" y="60" font-family="Georgia, 'Times New Roman', serif" font-size="46" fill="#EAE1D0">Where imagination runs wild.</text>
           </svg>`,
        ),
        left: 80,
        top: 400,
      },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out('public/og-image.jpg'))
})

console.log(`\nDone: ${done.length} asset(s) written.`)
