# Direct Mail Builder POC

## Overview
Clickable, interactive web-based POC/demo for a direct mail builder product.
Built with React + Vite + Tailwind, using the Info-Trac component library design system.

## Status: Pre-Development (Design Research Complete)

## Component Library Reference
- **URL**: https://trac-showcase.fox.ck.ua/
- **Stack**: React + Tailwind + shadcn/ui + @material/web (Material Design 3)
- **Font**: Roboto (not Inter — this is Info-Trac's system, separate from InfoIMAGE brand)
- **Theme**: Dark mode
- **Color Palette** (Material Design 3 custom):
  - Primary: #001D3B (10) → #EBF1FF (95)
  - Secondary: #001C3D (10) → #EBF0FF (95)
  - Neutral: #141C20 (10) → #E8F2F9 (95)
  - Tertiary: #1B1C1C (10) → gray scale (95)

### Available Info-Trac Components (21 total)
Located in `src/components/info-trac/`:
1. InfoTracAreaChart
2. InfoTracBarChart
3. InfoTracButton (Material Design, intents: Primary/Secondary/etc, icon support)
4. InfoTracCard (with header actions, status badges, account info)
5. InfoTracCheckbox
6. InfoTracDataTable (expandable rows, pagination, sorting via @tanstack/react-table)
7. InfoTracDateRange (calendar picker)
8. InfoTracDialog (modal with title, description, cancel/submit, types: default/etc)
9. InfoTracInput (with icons, labels, placeholders)
10. InfoTracMultiSelect (shadcn-style, search, overflow behavior)
11. InfoTracPieChart
12. InfoTracRadio
13. InfoTracSearchInput (with icon options)
14. InfoTracSelect (Material Design style with label)
15. InfoTracSwitch (intents, icons, disabled state)
16. InfoTracTabs (bordered, rounded, product names: eStatement/InfoTrac/eSaferyBox/eSignature)
17. InfoTracTable (custom table with pagination)
18. InfoTracTimeLine
19. InfoTracToast
20. InfoTracTooltip
21. InfoTracUSMapChart

### Typography Scale (Roboto)
- Headline: Large 32/40, Medium 28/36, Small 24/32
- Title: Large 22/28, Medium 16/24 (+0.15), Small 14/20 (+0.1)
- Label: Large 14/20 (+0.1), Medium 12/16 (+0.5), Small 11/16 (+0.5)
- Body: Large 16/24 (+0.5), Medium 14/20 (+0.25), Small 12/16 (+0.4)

## Product Requirements

### Mail Builder Features
- **Drag and drop** canvas for composing mail pieces
- **Resizable elements** within the canvas
- **Printable margin guides** (USPS-compliant safe zones)
- **Protected zones**: Address block + return address that elements CANNOT overlap
- **Mail formats**: Standard postcard (6x4), Letter (8.5x11), custom sizes
- **Content blocks** (full suite):
  - Text blocks
  - Image placeholders
  - Basic shapes (rectangles, lines, circles)
  - QR codes
  - Barcodes
  - Variable data fields (merge fields)
  - Logo placeholders

### UI Layout (planned)
- Left sidebar: Draggable content block palette
- Center: Mail piece canvas with margin guides, zoom/pan
- Right sidebar: Properties panel for selected element (position, size, font, color, etc.)
- Top toolbar: Mail size selector, zoom controls, undo/redo, save/export
- All UI chrome uses Info-Trac components

### Tech Stack (planned)
- React + Vite + Tailwind
- react-dnd or @dnd-kit for drag and drop
- Info-Trac design tokens for theming
- No backend needed — static POC

## Figma Integration
- User has existing Figma design to reference (not yet accessed)
- Figma MCP server added to `~/.claude/mcp_settings.json`
- API key configured
- Need to restart Claude Code to activate, then user will share Figma file URL

## Project Path
`~/projects/direct-mail-builder/`
