# SUMMIT360 SOLUTIONS Brand Guidelines

## 1. Brand Identity

### Logo
The SUMMIT360 SOLUTIONS logo features a stylized graphic element above two lines of text. The graphic depicts an abstract human figure with raised arms, enclosed within a multi-faceted geometric shape (resembling a mountain peak or summit), encircled by a sweeping orbital arc suggesting a 360-degree perspective.

**Logo Usage:**
- Use on dark backgrounds (black or Deep Slate)
- Logo appears in white
- Maintain aspect ratio and spacing
- Minimum size: 100px width for digital applications

---

## 2. Brand Colors

### Primary Palette

#### Summit Blue
- **Hex:** `#1A2A44`
- **Usage:** Backgrounds, headers
- **RGB:** 26, 42, 68

#### Deep Slate
- **Hex:** `#0D1117`
- **Usage:** Dark UI sections, footer
- **RGB:** 13, 17, 23

#### Summit Teal
- **Hex:** `#36C4C4`
- **Usage:** Highlights, icons, CTAs
- **RGB:** 54, 196, 196

#### Sky Gradient
- **Start:** `#3A7BD5` → **End:** `#00D2FF`
- **Usage:** Hero banners, callouts, feature highlights
- **RGB Start:** 58, 123, 213
- **RGB End:** 0, 210, 255

### Secondary Palette

#### White
- **Hex:** `#FFFFFF`
- **Usage:** Text on dark backgrounds, logo on dark surfaces
- **RGB:** 255, 255, 255

#### Soft Gray
- **Hex:** `#DCE1E7`
- **Usage:** Body text, separators, subtle UI elements
- **RGB:** 220, 225, 231

#### Amber Accent
- **Hex:** `#FFC65C`
- **Usage:** Value highlights, stats, important callouts
- **RGB:** 255, 198, 92

---

## 3. Typography

### Primary Font (Headlines)
**Montserrat**
- **Weights:** Bold (700) / SemiBold (600)
- **Usage:**
  - Slide titles
  - Large headers (H1, H2)
  - Hero value statements
  - Navigation items
- **Style:** Bold, uppercase optional for emphasis

### Secondary Font (Body)
**Inter** (Primary choice) / **Open Sans** / **Helvetica** (Fallback)
- **Weights:** Regular (400), Medium (500), SemiBold (600)
- **Usage:**
  - Body copy
  - Captions
  - Descriptions
  - UI labels and controls

### Typography Rules
- **Headlines:** Bold, uppercase optional for emphasis
- **Body text:** Always 90–100% line height (0.9–1.0)
- **Contrast:** Avoid overly thin text on dark backgrounds
- **Minimum sizes:** 14px for body text, 16px recommended

---

## 4. Brand Applications

### 4.1 Website

**Theme:**
- Dark slate theme (Deep Slate `#0D1117` as primary background)
- Summit Blue (`#1A2A44`) for headers and section backgrounds
- Blue-teal accents (Summit Teal `#36C4C4` and Sky Gradient)
- Minimalist layout with clean spacing

**Color Application:**
- **Background:** Deep Slate (`#0D1117`)
- **Headers/Sections:** Summit Blue (`#1A2A44`)
- **Accents/Highlights:** Summit Teal (`#36C4C4`)
- **Hero Banners:** Sky Gradient (`#3A7BD5` → `#00D2FF`)
- **Text:** White (`#FFFFFF`) on dark, Soft Gray (`#DCE1E7`) for secondary text
- **Value Highlights:** Amber Accent (`#FFC65C`)

**Layout Principles:**
- Clean, minimalist design
- Generous white space
- Clear visual hierarchy
- Focus on content readability

---

## 5. Implementation Notes

### CSS Variables
When implementing, use CSS custom properties for easy theme management:

```css
:root {
  --summit-blue: #1A2A44;
  --deep-slate: #0D1117;
  --summit-teal: #36C4C4;
  --sky-gradient-start: #3A7BD5;
  --sky-gradient-end: #00D2FF;
  --white: #FFFFFF;
  --soft-gray: #DCE1E7;
  --amber-accent: #FFC65C;
}
```

### Font Loading
- Load Montserrat from Google Fonts (Bold 700, SemiBold 600)
- Load Inter from Google Fonts (Regular 400, Medium 500, SemiBold 600)
- Use font-display: swap for performance

### Accessibility
- Ensure WCAG AA contrast ratios:
  - White text on Deep Slate: ✓ (21:1)
  - White text on Summit Blue: ✓ (12.5:1)
  - Summit Teal on Deep Slate: ✓ (4.5:1)
  - Soft Gray on Deep Slate: ✓ (7.5:1)

---

## 6. Logo Files

### Favicon
- Use the SUMMIT360 SOLUTIONS logo as favicon
- Format: SVG (preferred) or PNG
- Size: 32x32px minimum, 512x512px for high-DPI
- Background: Transparent or Deep Slate

---

## 7. Do's and Don'ts

### Do's
✓ Use the dark theme consistently across the website
✓ Apply Sky Gradient to hero sections and important callouts
✓ Use Montserrat for all headlines and navigation
✓ Maintain consistent spacing and padding
✓ Use Summit Teal for interactive elements and highlights

### Don'ts
✗ Don't use light backgrounds (except for specific content areas)
✗ Don't mix different body fonts (stick to Inter)
✗ Don't use thin font weights on dark backgrounds
✗ Don't alter logo colors or proportions
✗ Don't use brand colors in ways that reduce readability

---

*Last Updated: 2024*
*Version: 1.0*

