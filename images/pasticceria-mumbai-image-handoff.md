# Pasticceria Fumagalli Mumbai — Image Handoff Brief

**Date:** April 2026  
**Output location:** `_output/step-2/design/images/`  
**Build target:** `_output/step-2/build/v1/index.html`

---

## Source Image Inventory

| File | Dimensions | Subject | Notes |
|---|---|---|---|
| `1AA18982-21ED-4E3A-B0E5-46EBADC913C1.jpg` | 3000×3000px | **Colomba** (Italian Easter dove cake) — FUMAGALLI branded ribbon, almonds, sugar pearl glaze, sage green fabric | High quality, warm tones. Shot on OnePlus, processed via Instagram. |
| `569DD4B6-BBD4-4A66-9303-9C6F5DE0E2F0.jpg` | 1600×1600px | **Fumagalli biscotti** — three packaged varieties (riso, integrali, kamut) on dark burgundy fabric | Lower resolution. Branded packaging visible. Instagram-processed only. |

---

## Output Files

| File | Dimensions | Size | Source | Slot | Status |
|---|---|---|---|---|---|
| `hero.jpg` | 1440×810px | 413KB | Colomba (centred crop) | Hero full-bleed background | ✅ Production-ready |
| `heritage.jpg` | 800×1000px | 371KB | Colomba (portrait crop) | Heritage/brand story section | ✅ Production-ready |
| `og-image.jpg` | 1200×630px | 346KB | Colomba (widescreen crop) | WhatsApp / OG share preview | ✅ Production-ready |
| `panettone.jpg` | 600×600px | 210KB | Colomba (square crop) | Product card 1 — Panettone | ⚠️ PLACEHOLDER — see gaps |
| `pepita-biscuits.jpg` | 600×600px | 174KB | Biscotti bags (centre crop) | Product card 2 — Pepita biscuits | ⚠️ PLACEHOLDER — see gaps |
| `ciambella.jpg` | 600×600px | 188KB | Colomba (offset square crop) | Product card 3 — Ciambella | ⚠️ PLACEHOLDER — see gaps |

All files: JPEG, 85% quality, under 500KB.

---

## Critical Gaps

Three of the six image slots cannot be properly filled from the two source photographs. These are **production blockers** for a polished launch.

### Gap 1 — Panettone (`panettone.jpg`)
- **Problem:** No panettone photograph exists. The hero headline reads *"Making panettone since 1953"* — the product card must show a real panettone.
- **Current placeholder:** Colomba image (visually similar dome shape, but wrong product — no paper mould, different glaze).
- **Photography brief:** Tall cylindrical panettone in traditional paper mould, top-down or 3/4 angle. Warm light, rustic surface (marble, wood, or linen). Brand ribbon optional. 600×600px minimum source, ideally 1200×1200px+.

### Gap 2 — Pepita biscuits (`pepita-biscuits.jpg`)
- **Problem:** The source image shows three bags of *packaged assorted biscotti* (riso, integrali, kamut) — not Pepita chocolate chip shortbread cookies as described in the product card.
- **Current placeholder:** Biscotti bags crop. The branded packaging is visible and partially works, but the product description on the site will not match what's shown.
- **Options:**
  1. Reshoot with Pepita biscuits loose/plated (preferred)
  2. Rename the product card to "Assorted Biscotti" and adjust copy to match the packaging shown
  3. Use the packaged bags shot as-is and accept the minor mismatch

### Gap 3 — Ciambella (`ciambella.jpg`)
- **Problem:** No ciambella (Italian ring cake) photograph exists.
- **Current placeholder:** Colomba image with a slightly different crop — clearly wrong product.
- **Photography brief:** Ciambella ring cake on a plate or board, dusted with icing sugar or glazed. Natural light preferred. Top-down or 3/4 angle. 600×600px minimum source.

---

## Assignment Rationale

**Colomba → Hero, Heritage, OG image, + two product card placeholders**  
The Colomba is the only high-quality artisan product shot available. It photographs well — warm tones, clear product, branded ribbon visible. It works strongly for atmospheric slots (hero, heritage, OG share) where product identity is secondary to visual mood. It is not a correct representation for the panettone or ciambella product cards.

**Biscotti bags → Pepita biscuits placeholder**  
The biscotti bags image is lower resolution and darker in tone. It does show Fumagalli-branded packaging, which gives it legitimacy as a placeholder. It does not show Pepita biscuits specifically.

---

## Recommendations for Next Steps

1. **Priority 1 — Photograph a panettone.** This is the most critical gap. The hero copy explicitly references panettone and a mismatched product card is the most visible inconsistency on the page.

2. **Priority 2 — Decide on Pepita vs. assorted biscotti.** Either reshoot with Pepita cookies plated, or update the product card copy to match the packaged biscotti shown. The latter requires a copy edit in `index.html`.

3. **Priority 3 — Photograph a ciambella.** Lower urgency than panettone, but currently showing a Colomba in a ciambella slot.

4. **Copy the images into the build.** Once photography gaps are resolved (or placeholders accepted), copy all 6 files from this directory into `_output/step-2/build/v1/images/` (create the folder if it doesn't exist) and verify `index.html` `src` paths resolve correctly.

5. **Test OG image.** Paste the live URL into [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) and WhatsApp to confirm `og-image.jpg` renders correctly in share previews.

---

## File Naming Reference

All files named to match `index.html` `<img>` `src` attributes exactly. No renaming needed before deployment.

```
images/hero.jpg
images/heritage.jpg
images/panettone.jpg
images/pepita-biscuits.jpg
images/ciambella.jpg
og-image.jpg
```

Note: `og-image.jpg` sits at the root of the build folder (alongside `index.html`), not inside `images/`.
