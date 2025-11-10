# Project Instructions for Designer Marketplace

## Design System Compliance

**CRITICAL**: This project uses a dark theme with black background. ALL interactive elements must follow the design system rules documented in `/DESIGN_SYSTEM.md`.

### Key Rules for Black Background Theme:

1. **Text Visibility**: Always use `text-white` or `text-gray-400` - NEVER `text-gray-600` or `text-black`
2. **Hover States**: Must preserve white text with `hover:text-white`
3. **Select Dropdowns**:
   - Items: `hover:bg-white/20` with smooth transitions
   - Content: `bg-zinc-900` background
4. **Interactive Containers**: Include hover feedback with `hover:bg-white/10` and `hover:border-white/20`

### Before Making UI Changes:

1. Read `/DESIGN_SYSTEM.md` for complete style guide
2. Ensure all new components follow the dark theme patterns
3. Test hover states maintain text visibility
4. Verify WCAG contrast requirements (4.5:1 minimum)

### Component Locations:

- UI Components: `src/components/ui/`
- Pages: `src/pages/`
- Global Styles: `src/globals.css`
