/**
 * Mesh-Specific Image Catalog
 *
 * Static mapping of S3 images organized by mesh type + color.
 * Images served via CloudFront: media.mosquitocurtains.com
 *
 * Key format: "{meshType}:{color}" matching the product IDs used
 * in RawNettingOrderForm and RawNettingPage.
 *
 * To add images: upload to S3 at
 *   site-assets/raw-netting-images/mesh-specific/{folder}/
 * then add the entry here.
 */

const CDN = 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/mesh-specific'

function img(folder: string, file: string, alt: string): { src: string; alt: string } {
  return { src: `${CDN}/${folder}/${file}`, alt }
}

// ---------------------------------------------------------------------------
// Heavy Mosquito Mesh — Black  (57 images)
// ---------------------------------------------------------------------------
const heavyMosquitoBlack = [
  img('heavy-mesh-black', 'a1-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - application'),
  img('heavy-mesh-black', 'd1-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd2-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd3-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd4-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd5-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd6-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd7-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd8-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd9-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd10-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd11-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd12-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'd13-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - detail'),
  img('heavy-mesh-black', 'm1-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm2-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm3-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm4-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm5-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm6-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm7-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm8-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm9-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm10-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm11-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm12-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm13-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm14-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm15-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm16-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm17-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm18-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm19-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm20-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm21-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm22-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm23-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm24-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm25-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm26-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm27-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm28-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm29-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm30-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm31--shade-roof-panel--heavy-mesh-black.jpg', 'Heavy mosquito mesh black - shade roof panel'),
  img('heavy-mesh-black', 'm32--shade-roof-panel--heavy-mesh-black.jpg', 'Heavy mosquito mesh black - shade roof panel'),
  img('heavy-mesh-black', 'm33-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm34-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm35-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm36-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm37-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm38-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm39-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm40-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm41-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
  img('heavy-mesh-black', 'm42-heavy-mesh-black.jpg', 'Heavy mosquito mesh black - installation'),
]

// ---------------------------------------------------------------------------
// Heavy Mosquito Mesh — White  (12 images)
// ---------------------------------------------------------------------------
const heavyMosquitoWhite = [
  img('heavy-mesh-white', 'a1-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - application'),
  img('heavy-mesh-white', 'a2-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - application'),
  img('heavy-mesh-white', 'a3-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - application'),
  img('heavy-mesh-white', 'm1-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm2-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm3-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm4-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm5-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm6-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm7-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm8-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
  img('heavy-mesh-white', 'm9-heavy-mesh-white.jpg', 'Heavy mosquito mesh white - installation'),
]

// ---------------------------------------------------------------------------
// Heavy Mosquito Mesh — Ivory  (7 images)
// ---------------------------------------------------------------------------
const heavyMosquitoIvory = [
  img('heavy-mesh-ivory', 'a1-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - application'),
  img('heavy-mesh-ivory', 'a2-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - application'),
  img('heavy-mesh-ivory', 'a3-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - application'),
  img('heavy-mesh-ivory', 'm1-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - installation'),
  img('heavy-mesh-ivory', 'm2-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - installation'),
  img('heavy-mesh-ivory', 'm3-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - installation'),
  img('heavy-mesh-ivory', 'm4-heavy-mesh-ivory.jpg', 'Heavy mosquito mesh ivory - installation'),
]

// ---------------------------------------------------------------------------
// No-See-Um Mesh — Black  (26 images)
// ---------------------------------------------------------------------------
const noSeeUmBlack = [
  img('no-see-um-mesh-black', 'a1-no-see-um-mesh-black.jpg', 'No-see-um mesh black - application'),
  img('no-see-um-mesh-black', 'a2-no-see-um-mesh-black.jpg', 'No-see-um mesh black - application'),
  img('no-see-um-mesh-black', 'a3-no-see-um-mesh-black.jpg', 'No-see-um mesh black - application'),
  img('no-see-um-mesh-black', 'd1-no-see-um-mesh-black.jpg', 'No-see-um mesh black - detail'),
  img('no-see-um-mesh-black', 'd2-no-see-um-mesh-black.jpg', 'No-see-um mesh black - detail'),
  img('no-see-um-mesh-black', 'm1-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm2-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm3-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm4-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm5-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm6-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm7-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm8-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm9-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm10-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm11-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm12-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm13-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm14-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm15-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm16-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm17-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm18-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm19-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm20-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
  img('no-see-um-mesh-black', 'm21-no-see-um-mesh-black.jpg', 'No-see-um mesh black - installation'),
]

// ---------------------------------------------------------------------------
// No-See-Um Mesh — White  (5 images)
// ---------------------------------------------------------------------------
const noSeeUmWhite = [
  img('no-see-um-mesh-white', 'a1-no-see-um-mesh-white.jpg', 'No-see-um mesh white - application'),
  img('no-see-um-mesh-white', 'a2-no-see-um-mesh-white.jpg', 'No-see-um mesh white - application'),
  img('no-see-um-mesh-white', 'm1-no-see-um-mesh-white.jpg', 'No-see-um mesh white - installation'),
  img('no-see-um-mesh-white', 'm2-no-see-um-mesh-white.jpg', 'No-see-um mesh white - installation'),
  img('no-see-um-mesh-white', 'm3-no-see-um-mesh-white.jpg', 'No-see-um mesh white - installation'),
]

// ---------------------------------------------------------------------------
// Shade Mesh — Black  (13 images)
// ---------------------------------------------------------------------------
const shadeBlack = [
  img('shade-mesh-black', 'a1-shade-mesh-black.jpg', 'Shade mesh black - application'),
  img('shade-mesh-black', 'a2-shade-mesh-black.jpg', 'Shade mesh black - application'),
  img('shade-mesh-black', 'a3-shade-mesh-black.jpg', 'Shade mesh black - application'),
  img('shade-mesh-black', 'm1-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm2-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm3-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm4-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm5-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm6-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm7--shade-roof-panel--shade-mesh-black.jpg', 'Shade mesh black - shade roof panel'),
  img('shade-mesh-black', 'm8-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm9-shade-mesh-black.jpg', 'Shade mesh black - installation'),
  img('shade-mesh-black', 'm10-shade-mesh-black.jpg', 'Shade mesh black - installation'),
]

// ---------------------------------------------------------------------------
// Shade Mesh — White  (4 images)
// ---------------------------------------------------------------------------
const shadeWhite = [
  img('shade-mesh-white', 'm1-shade-mesh-white.jpg', 'Shade mesh white - installation'),
  img('shade-mesh-white', 'm2-shade-mesh-white.jpg', 'Shade mesh white - installation'),
  img('shade-mesh-white', 'm3-shade-mesh-white.jpg', 'Shade mesh white - installation'),
  img('shade-mesh-white', 'm4-shade-mesh-white.jpg', 'Shade mesh white - installation'),
]

// ===========================================================================
// PUBLIC API
// ===========================================================================

/**
 * Image catalog keyed by "meshType:color".
 * meshType matches the product IDs: heavy_mosquito, no_see_um, shade
 * color matches the color option values: black, white, ivory
 */
export const MESH_GALLERY_IMAGES: Record<string, { src: string; alt: string }[]> = {
  'heavy_mosquito:black': heavyMosquitoBlack,
  'heavy_mosquito:white': heavyMosquitoWhite,
  'heavy_mosquito:ivory': heavyMosquitoIvory,
  'no_see_um:black': noSeeUmBlack,
  'no_see_um:white': noSeeUmWhite,
  'shade:black': shadeBlack,
  'shade:white': shadeWhite,
}

/**
 * Look up gallery images for a given mesh type + color combination.
 * Returns an empty array if no images exist for that combo.
 */
export function getMeshGalleryImages(meshType: string, color: string): { src: string; alt: string }[] {
  return MESH_GALLERY_IMAGES[`${meshType}:${color}`] || []
}
