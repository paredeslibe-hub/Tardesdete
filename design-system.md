# Design System: Tardes de Té

This document captures the visual essence, typography, color palette, and custom utility shapes of the "Tardes de Té" website. Use this as a reference to maintain a cohesive UI across any new features or components.

## 1. Typography

The design relies on two Google Fonts, blending a modern, friendly sans-serif with an elegant script font to highlight the artisanal essence:

- **Primary Font (Sans-serif):** `Fredoka` (Weights: 400, 500, 600, 700)
  - *Usage:* Headings, buttons, paragraphs, navigation, UI elements.
  - *CSS Variable:* `--font-sans`
  
- **Accent Font (Script):** `Pinyon Script`
  - *Usage:* Decorative elements, large background typography, special callouts.
  - *CSS Variable:* `--font-script`

---

## 2. Color Palette

The color scheme is vibrant, appetizing, and nostalgic.

- **Cream / Background:** `#FFF0E0` (Used for page backgrounds and dark text contrast)
  - *Tailwind class:* `bg-brand-cream`, `text-brand-cream`
- **Orange / Primary:** `#FF5A00` (Used for primary headings, borders, text, and energetic accents)
  - *Tailwind class:* `bg-brand-orange`, `text-brand-orange`, `border-brand-orange`
- **Light Orange:** `#FF7B33` (Used for softer accents or hover states)
  - *Tailwind class:* `bg-brand-lightorange`, `text-brand-lightorange`
- **Pink / Secondary:** `#FF66B1` (Used for playful highlights, buttons, icon backgrounds, and borders)
  - *Tailwind class:* `bg-brand-pink`, `text-brand-pink`, `border-brand-pink`
- **Text Color:** Strongly leans on `#FF5A00` (Orange) for headings and paragraphs to keep the brand cohesive.

---

## 3. Shapes & Borders (CSS Custom Utilities)

The aesthetic uses organic, rounded, and playful CSS border-radius shapes instead of standard sharp or slightly rounded corners.

- `.shape-arch` : Top rounded arch (`border-radius: 200px 200px 0 0`)
- `.shape-arch-inverted` : Bottom rounded arch (`border-radius: 0 0 200px 200px`)
- `.shape-leaf-1` : Top-left and bottom-right leaf tip (`border-radius: 150px 0 150px 0`)
- `.shape-leaf-2` : Top-right and bottom-left leaf tip (`border-radius: 0 150px 0 150px`)
- `.shape-teardrop` : Teardrop pointing bottom-right (`border-radius: 50% 50% 50% 0`)
- `.shape-pill-left` : Pill shape pushing left (`border-radius: 200px 0 0 200px`)
- `.shape-blob-1` & `.shape-blob-2` : Asymmetrical liquid blobs
- `.shape-clover` : Soft petal/clover bounds (`border-radius: 20% 50%`)
- `.shape-starburst` : Starburst using `clip-path` polygon

---

## 4. Background Patterns & Animations

- **`.bg-flowers`**: A custom SVG pattern rendering small pink and orange flowers with an orange background.
- **`.bg-checkerboard-orange`**: An orange and pink CSS gradient checkerboard.
- **Animations**:
  - `.animate-marquee`: A smooth continuous horizontal scroll (used for scrolling text banners).
  - `.animate-spin-slow`: A very slow, 15-second SVG rotation (used for decorative badges or starbursts).

---

## 5. UI Layout Principles

- **Cards & Elements:** Generous internal padding (e.g., `p-6`, `p-8`). Solid brand borders combined with solid drop shadows (e.g., `shadow-[4px_4px_0_0_rgba(255,90,0,1)]`) to create a sticker or retro "brutalist meets cute" effect.
- **Buttons:** Fully rounded (`rounded-full`), uppercase text on standard buttons (`uppercase tracking-widest`), heavy borders.
- **Spacing:** Large visual breathing room between sections (`py-20`), often accented by absolutely positioned icons (like rotated croissants or cakes) breaking the grid.
