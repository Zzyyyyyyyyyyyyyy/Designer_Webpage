# Design System - Designer Marketplace

## Color Scheme

This website uses a **dark theme** with black background (`bg-black`).

## Interactive Elements Style Guide

### 🎨 Dark Theme Text Visibility Rules

**IMPORTANT**: All interactive elements on black background MUST maintain white text visibility.

### Select Dropdown Menus

**SelectTrigger (触发按钮):**
```tsx
<SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
```

**SelectContent (下拉容器):**
```tsx
<SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
```

**SelectItem (选项):**
- Base component in `src/components/ui/select.tsx` has:
  - `hover:bg-white/20` - 明显的高亮背景
  - `hover:text-white` - 保持白色文字
  - `transition-colors` - 平滑过渡

```tsx
// Individual items only need:
<SelectItem value="example" className="text-white">
```

### Switch Containers

```tsx
<div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
  <div>
    <p className="text-white font-medium">Title</p>
    <p className="text-gray-400 text-sm">Description</p>
  </div>
  <Switch />
</div>
```

### Buttons

**Primary:**
```tsx
className="bg-white text-black hover:bg-white/90"
```

**Outline/Ghost:**
```tsx
className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
```

**Destructive:**
```tsx
className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400"
```

### Input Fields

```tsx
<Input className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 focus:bg-white/10" />
```

### Tabs

```tsx
<TabsTrigger className="data-[state=active]:bg-white data-[state=active]:text-black text-white data-[state=inactive]:text-gray-300">
```

## Text Color Guidelines

### Primary Text
- Use: `text-white` for main content
- Use: `text-gray-400` for secondary/helper text
- **NEVER use**: `text-gray-600` or `text-black` on dark backgrounds

### Contrast Requirements
- Follow WCAG AA standards (4.5:1 minimum)
- `text-gray-400` provides sufficient contrast (8:1+)
- `text-gray-600` fails contrast requirements (2.8:1) ❌

## Hover State Principles

1. **Always preserve text visibility** - Text should stay white on hover
2. **Provide visual feedback** - Use subtle background or border changes
3. **Smooth transitions** - Add `transition-colors` for professional feel
4. **Consistent opacity levels**:
   - Subtle hover: `hover:bg-white/5` or `hover:border-white/20`
   - Medium hover: `hover:bg-white/10` or `hover:border-white/30`
   - Strong hover: `hover:bg-white/20` or `hover:border-white/40`

## Component Library

- UI Components: `src/components/ui/`
- Based on: Radix UI + shadcn/ui
- Styling: Tailwind CSS
- Icons: Lucide React

---

**Last Updated**: 2025-01-10
**Maintainer**: Development Team
