# Page Building Rules - Mosquito Curtains Design System

## 🎯 REFERENCE PAGES (LOCKED IN - COPY THESE PATTERNS)

### Live Design System
**Visit:** [http://localhost:3002/design-system](http://localhost:3002/design-system) - Overview with all components

**Individual Component Pages:**
| Component | Page |
|-----------|------|
| Container | [/design-system/container](http://localhost:3002/design-system/container) |
| Stack | [/design-system/stack](http://localhost:3002/design-system/stack) |
| Grid | [/design-system/grid](http://localhost:3002/design-system/grid) |
| TwoColumn | [/design-system/two-column](http://localhost:3002/design-system/two-column) |
| Button | [/design-system/button](http://localhost:3002/design-system/button) |
| HeaderBarSection | [/design-system/header-bar-section](http://localhost:3002/design-system/header-bar-section) |
| PowerHeaderTemplate | [/design-system/power-header-template](http://localhost:3002/design-system/power-header-template) |
| YouTubeEmbed | [/design-system/youtube-embed](http://localhost:3002/design-system/youtube-embed) |
| BulletedList | [/design-system/bulleted-list](http://localhost:3002/design-system/bulleted-list) |

### Design System Location
**All components live in:** `src/lib/design-system/`
- **Components:** `src/lib/design-system/components/` (layout, forms, cards, etc.)
- **Templates:** `src/lib/design-system/templates/` (PowerHeaderTemplate, etc.)
- **Tokens:** `src/lib/design-system/tokens.ts` (colors, spacing)

### Locked Reference Implementations
These pages are the **source of truth** for how to build pages:

| Page | Path | Use Case |
|------|------|----------|
| **Homepage** | `src/app/page.tsx` | Custom hero + templates + HeaderBarSection content |
| **Screened Porch** | `src/app/screened-porch/page.tsx` | PowerHeaderTemplate + HeaderBarSection content sections |

**Always reference these files first** when building new pages.

---

## 🎯 Core Principle
**Every page must follow the Apple.com-style layout pattern: GlobalLayout provides PageLayout automatically. Individual pages should NEVER use PageLayout directly.**

---

## 📐 Layout Hierarchy

### ✅ CORRECT Structure (Always Use This)

```
GlobalLayout (automatic - wraps all pages)
  └─ PageLayout (automatic - provides padding)
      └─ Your Page Content
          └─ Container (optional - for width constraints, NO padding)
              └─ Your actual content
```

### ❌ WRONG Structure (Never Do This)

```
❌ <PageLayout>  ← DON'T! GlobalLayout already provides this
  <Container>
    ...
  </Container>
</PageLayout>
```

---

## 🏗️ **BULLETPROOF PAGE TEMPLATE** ⭐

### **STANDARD: Category/Product Page (Copy from `/screened-porch`)**

```tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Bug, Award, Wrench } from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid,
  TwoColumn,
  Frame,
  Text, 
  Button,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  // Pre-built templates
  PowerHeaderTemplate,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  // Section containers
  HeaderBarSection,
} from '@/lib/design-system'

export default function YourCategoryPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* HERO - PowerHeaderTemplate */}
        <PowerHeaderTemplate
          title="Your Page Title"
          subtitle="Clear, concise description of the product/category"
          videoId="FqNe9pDsZ8M"
          videoTitle="Overview Video"
          thumbnailUrl="https://..."  // Optional custom thumbnail
          variant="compact"  // "compact" = two-column, "stacked" = full-width video
        />

        {/* WHY CHOOSE US - Shared template */}
        <WhyChooseUsTemplate />

        {/* CONTENT SECTIONS - HeaderBarSection with TwoColumn */}
        <HeaderBarSection icon={Bug} label="Section Title Here" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Your content paragraph here...
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Feature one</ListItem>
                <ListItem variant="checked" iconColor="#406517">Feature two</ListItem>
                <ListItem variant="checked" iconColor="#406517">Feature three</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/page">
                    Call to Action
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <YouTubeEmbed
              videoId="VIDEO_ID"
              title="Video Title"
              variant="card"
            />
          </TwoColumn>
        </HeaderBarSection>

        {/* More HeaderBarSection content blocks... */}

        {/* FINAL CTA - Shared template */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
```

### **Why This Pattern?**

✅ **Consistent Spacing** - `Stack gap="lg"` provides 32px between all sections  
✅ **No Manual Margins** - No need for `mb-8`, `mb-12` on every section  
✅ **Edit Once, Update Everywhere** - Templates update site-wide  
✅ **HeaderBarSection** - Professional colored header bars for content sections  
✅ **TwoColumn** - Content + media layout that stacks on mobile  

### Key Rules:
- ✅ **ALWAYS** import from `@/lib/design-system` (NOT `@/lib/design-system/components`)
- ✅ **ALWAYS** use `Container size="xl"` as outermost wrapper
- ✅ **ALWAYS** use `Stack gap="lg"` as direct child of Container
- ✅ **USE** `PowerHeaderTemplate` for category/product page heroes
- ✅ **USE** `HeaderBarSection variant="dark"` for content sections
- ✅ **USE** `TwoColumn gap="lg"` for text + media layouts
- ✅ **NEVER** add `mb-X` or `mt-X` to direct Stack children

---

### **ALTERNATIVE: Custom Hero (Copy from Homepage)**

For pages needing a custom hero (like homepage), use a gradient-bordered section:

```tsx
{/* Custom Hero with Gradient Border */}
<section className="relative">
  {/* Background blurs */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
  </div>
  
  {/* Main container with gradient border */}
  <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
    
    {/* Hero Content - Centered */}
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
        <Sparkles className="w-4 h-4 mr-2" />
        Trust badge text here
      </Badge>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
        Main Headline
      </h1>
      
      <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
        Subheadline description text.
      </p>
      
      <div className="pt-1">
        <Button variant="primary" size="lg" asChild>
          <Link href="/start-project">
            Call to Action
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
    
    {/* Additional content below hero... */}
    
  </div>
</section>
```

**See full example:** `src/app/page.tsx`

---

## 📱 Mobile Design Rules

### 1. Text Sizes (Mobile-First)

```tsx
// ❌ WRONG - Fixed large text
<h1 className="text-4xl">Title</h1>

// ✅ CORRECT - Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
```

**Rules:**
- Mobile: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` (max)
- Desktop: `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`
- Always use responsive variants: `text-base md:text-lg lg:text-xl`

### 2. Spacing (Mobile-First)

```tsx
// ❌ WRONG - Fixed large spacing
<div className="mx-12 py-16">Content</div>

// ✅ CORRECT - Responsive spacing
<div className="mx-2 md:mx-4 lg:mx-8 py-4 md:py-8 lg:py-12">Content</div>
```

**Rules:**
- Mobile: `mx-1`, `mx-2`, `mx-3`, `mx-4` (max)
- Desktop: `mx-4`, `mx-6`, `mx-8`, `mx-12`
- Padding: `p-2`, `p-4`, `p-6` (mobile) → `p-6`, `p-8`, `p-12` (desktop)

### 3. Grid Layouts

```tsx
// ❌ WRONG - Fixed columns
<div className="grid grid-cols-3 gap-4">...</div>

// ✅ CORRECT - Responsive columns
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">...</div>
```

**Rules:**
- Always start with `grid-cols-1` for mobile
- Use `sm:grid-cols-2` for tablets
- Use `md:grid-cols-3` or `lg:grid-cols-4` for desktop

### 4. Button Sizes

```tsx
// ❌ WRONG - Fixed size
<Button>Click Me</Button>

// ✅ CORRECT - Responsive size
<Button size="sm">Click Me</Button>
```

**Rules:**
- Use `size="sm"` for most buttons (mobile-friendly)
- Use `size="md"` or `size="lg"` only when needed
- Buttons should stack vertically on mobile: `flex-col md:flex-row`

### 5. Card Padding

```tsx
// ❌ WRONG - Fixed padding
<Card className="p-8">Content</Card>

// ✅ CORRECT - Responsive padding
<Card className="p-4 md:p-6 lg:p-8">Content</Card>
```

**Rules:**
- Mobile: `p-4` or `p-6` (max)
- Desktop: `p-6`, `p-8`, `p-12`
- Always use responsive: `p-4 md:p-6 lg:p-8`

---

## 🎨 Design System Components

### Container Usage

```tsx
// ✅ CORRECT - Inside GlobalLayout (automatic PageLayout)
// Container automatically uses PageLayout's padding - no double padding!
<Container size="xl">
  <Card>Content</Card>
</Container>

// ✅ CORRECT - Standalone (if not using GlobalLayout - rare, like homepage)
// Standalone Container needs its own padding wrapper
<div className="px-4 sm:px-6 lg:px-8">
  <Container size="xl">
    <Card>Content</Card>
  </Container>
</div>
```

**Important**: Container has NO padding. It only constrains width. PageLayout provides all padding automatically.

**Container Sizes:**
- `sm`: `max-w-3xl` (768px)
- `md`: `max-w-5xl` (1024px)
- `default`: `max-w-7xl` (1280px)
- `lg`: `max-w-[1400px]`
- `xl`: `max-w-[1600px]` ← **Use this for standard pages**
- `full`: `max-w-full` (no constraint)

### Button Variants

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="accent">Premium/AI Feature</Button>
<Button variant="ghost">Subtle Action</Button>
<Button variant="outline">Tertiary Action</Button>
<Button variant="danger">Delete/Destructive</Button>
```

### Card Variants

```tsx
<Card variant="default">Standard Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="outlined">Outlined Card</Card>
```

### Stack - Vertical Spacing Component ⭐

The `Stack` component provides consistent vertical spacing using CSS `gap` (flexbox).

```tsx
import { Stack } from '@/lib/design-system'

// Standard usage - gap="lg" is the site standard
<Stack gap="lg">
  <Section1 />
  <Section2 />
  <Section3 />
</Stack>

// Available gap sizes
<Stack gap="sm">   {/* 8px */}
<Stack gap="md">   {/* 16px */}
<Stack gap="lg">   {/* 32px - USE THIS */}
<Stack gap="xl">   {/* 48px */}
<Stack gap="2xl">  {/* 64px */}
```

**CRITICAL RULES:**

1. **Remove conflicting margins** - Direct children of Stack should NOT have:
   - ❌ `mb-X` classes
   - ❌ `mt-X` classes  
   - ❌ `my-X` classes
   - ❌ `space-y-X` classes

2. **Use on direct children** - Stack applies spacing between its direct children only

3. **Standard gap** - Always use `gap="lg"` (32px) for top-level page sections

**Before/After Example:**

```tsx
// ❌ OLD WAY - Manual margins
<Container size="xl">
  <div className="mb-12">Header</div>
  <Card className="mb-8">Section 1</Card>
  <Card className="mb-8">Section 2</Card>
  <Card>Section 3</Card>
</Container>

// ✅ NEW WAY - Stack with gap
<Container size="xl">
  <Stack gap="lg">
    <div>Header</div>
    <Card>Section 1</Card>
    <Card>Section 2</Card>
    <Card>Section 3</Card>
  </Stack>
</Container>
```

### PowerHeaderTemplate - Hero Section ⭐ **RECOMMENDED**

The `PowerHeaderTemplate` component creates a professional hero section with video and action cards.

```tsx
import { PowerHeaderTemplate } from '@/lib/design-system'

// Compact variant (two-column: text + video)
<PowerHeaderTemplate
  title="Screened Porch Enclosures"
  subtitle="Modular Mosquito Netting Panels custom-made to fit any space."
  videoId="FqNe9pDsZ8M"
  videoTitle="Product Overview"
  variant="compact"
/>

// Stacked variant (full-width video above action cards)
<PowerHeaderTemplate
  title="Clear Vinyl Enclosures"
  subtitle="Four-season room protection. Wind, rain, and cold stay outside."
  videoId="ca6GufadXoE"
  videoTitle="Installation Guide"
  variant="stacked"
/>
```

**Props:**
- `title: string` - Main hero title (required)
- `subtitle?: string` - Descriptive text below title
- `videoId: string` - YouTube video ID
- `videoTitle: string` - Video accessibility title
- `thumbnailUrl?: string` - Custom video thumbnail URL
- `variant?: 'compact' | 'stacked'` - Layout style (default: 'stacked')

**When to Use:**
- ✅ Product landing pages
- ✅ Category pages
- ✅ Main entry pages

**Live Examples:** Visit [http://localhost:3002/design-system](http://localhost:3002/design-system) to see both variants

---

## 📋 Common Patterns

### ✅ Complete Category Page Example (from `/screened-porch`)

```tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Bug } from 'lucide-react'
import { 
  Container, Stack, TwoColumn, Frame, Text, Button,
  BulletedList, ListItem, YouTubeEmbed,
  PowerHeaderTemplate, WhyChooseUsTemplate, FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

export default function CategoryPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Category Title"
          subtitle="Clear description of the product/category"
          videoId="FqNe9pDsZ8M"
          videoTitle="Overview Video"
          variant="compact"
        />

        {/* Shared template */}
        <WhyChooseUsTemplate />

        {/* Content section */}
        <HeaderBarSection icon={Bug} label="Section Title" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">Your content here...</Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Feature one</ListItem>
                <ListItem variant="checked" iconColor="#406517">Feature two</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/page">
                    Call to Action
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <YouTubeEmbed videoId="VIDEO_ID" title="Title" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        {/* Final CTA */}
        <FinalCTATemplate />
        
      </Stack>
    </Container>
  )
}
```

### Image Gallery Pattern (from `/screened-porch`)

```tsx
<HeaderBarSection icon={Bug} label="Client Installed Projects" variant="dark">
  <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
    {GALLERY_IMAGES.map((img, idx) => (
      <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Frame>
    ))}
  </Grid>
  <div className="flex justify-center pt-6">
    <Button variant="outline" asChild>
      <Link href="/gallery">
        See Full Gallery
        <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </Button>
  </div>
</HeaderBarSection>
```

### Action Buttons (Mobile-First)

```tsx
{/* Mobile: Stacked, Desktop: Inline */}
<div className="flex flex-col md:flex-row gap-2 md:gap-4">
  <Button variant="primary" size="sm" className="flex-1 md:flex-none">
    Primary Action
  </Button>
  <Button variant="secondary" size="sm" className="flex-1 md:flex-none">
    Secondary Action
  </Button>
</div>
```

### Loading States

```tsx
if (loading) {
  return (
    <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Spinner size="lg" />
    </Container>
  )
}
```

### Error States

```tsx
if (error) {
  return (
    <Container size="xl">
      <Card className="text-center p-4 md:p-6 lg:p-8">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base">{error}</p>
        <Button size="sm" onClick={retry}>Try Again</Button>
      </Card>
    </Container>
  )
}
```

---

## ❌ Common Mistakes to Avoid

### 1. Wrong Import Path ⚠️ **CRITICAL**

```tsx
// ❌ WRONG - Don't import from /components
import { Container, Stack } from '@/lib/design-system/components'

// ✅ CORRECT - Import from design-system root
import { Container, Stack } from '@/lib/design-system'
```

### 2. Missing Stack Wrapper

```tsx
// ❌ WRONG - Manual spacing with mb-X
<Container size="xl">
  <PowerHeaderTemplate title="Title" ... />
  <HeaderBarSection className="mb-8">...</HeaderBarSection>
  <HeaderBarSection className="mb-8">...</HeaderBarSection>
</Container>

// ✅ CORRECT - Stack handles spacing
<Container size="xl">
  <Stack gap="lg">
    <PowerHeaderTemplate title="Title" ... />
    <HeaderBarSection>...</HeaderBarSection>
    <HeaderBarSection>...</HeaderBarSection>
  </Stack>
</Container>
```

### 3. Conflicting Margins on Stack Children

```tsx
// ❌ WRONG - mb-X conflicts with Stack gap
<Stack gap="lg">
  <HeaderBarSection className="mb-8">...</HeaderBarSection>
  <HeaderBarSection className="mb-8">...</HeaderBarSection>
</Stack>

// ✅ CORRECT - Let Stack handle spacing
<Stack gap="lg">
  <HeaderBarSection>...</HeaderBarSection>
  <HeaderBarSection>...</HeaderBarSection>
</Stack>
```

### 4. Double PageLayout

```tsx
// ❌ WRONG
<PageLayout>
  <Container size="xl">...</Container>
</PageLayout>

// ✅ CORRECT
<Container size="xl">...</Container>
```

### 5. Fixed Text Sizes

```tsx
// ❌ WRONG
<h1 className="text-4xl">Title</h1>

// ✅ CORRECT
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
```

### 6. Fixed Grid Columns

```tsx
// ❌ WRONG
<div className="grid grid-cols-3">...</div>

// ✅ CORRECT
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">...</div>
```

### 7. Excessive Padding

```tsx
// ❌ WRONG
<div className="p-12">Content</div>

// ✅ CORRECT
<div className="p-4 md:p-6 lg:p-8">Content</div>
```

### 8. Missing Container

```tsx
// ❌ WRONG - Content spans full width
<div>
  <HeaderBarSection>Content</HeaderBarSection>
</div>

// ✅ CORRECT - Content constrained
<Container size="xl">
  <Stack gap="lg">
    <PowerHeaderTemplate title="Title" ... />
    <HeaderBarSection>Content</HeaderBarSection>
  </Stack>
</Container>
```

### 9. Adding Padding to Container

```tsx
// ❌ WRONG - Container doesn't need padding
<Container size="xl" className="px-4">...</Container>

// ✅ CORRECT - Container uses PageLayout's padding automatically
<Container size="xl">...</Container>
```

---

## ✅ Pre-Build Checklist

Before building a new page, ensure:

### **Required Structure**
- [ ] ✅ Import from `@/lib/design-system` (NOT `/components`)
- [ ] ✅ Use `<Container size="xl">` as outermost wrapper
- [ ] ✅ Use `<Stack gap="lg">` as direct child of Container
- [ ] ✅ Use `<PowerHeaderTemplate>` for hero (category pages)
- [ ] ✅ Use `<HeaderBarSection variant="dark">` for content sections
- [ ] ✅ Use `<TwoColumn>` for text + media layouts
- [ ] ✅ End with `<FinalCTATemplate />`
- [ ] ❌ **NO** `mb-X`, `mt-X`, `my-X` on direct Stack children

### **Content Section Pattern**
- [ ] `HeaderBarSection` with icon + label + variant="dark"
- [ ] `TwoColumn gap="lg" className="items-center"`
- [ ] `Stack gap="md"` for text content side
- [ ] `BulletedList` with `ListItem variant="checked" iconColor="#HEXCODE"`
- [ ] `YouTubeEmbed variant="card"` for video side

### **Quality Checks**
- [ ] Reference `src/app/screened-porch/page.tsx` for pattern
- [ ] Test on mobile viewport (375px width minimum)
- [ ] Check that Stack spacing looks correct (32px between sections)
- [ ] Buttons are centered, not full-width
- [ ] No console errors or warnings

---

## 🎨 Marketing Page Patterns (Homepage Style)

These patterns create the beautiful, professional look of the homepage. Use them for landing pages and marketing content.

### 1. Section Cards with Gradient Borders ⭐

The signature look - rounded containers with subtle gradient backgrounds and colored borders.

```tsx
{/* Standard gradient section card */}
<section>
  <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
    <div className="flex flex-col items-center">
      {/* Centered heading */}
      <div className="text-center mb-8">
        <Heading level={2} className="text-gray-900 !mb-2">Section Title</Heading>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Section description text here.
        </p>
      </div>
      
      {/* Content */}
      <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="w-full">
        {/* Grid items */}
      </Grid>
    </div>
  </div>
</section>
```

**Color Variants:**
- Green: `from-[#406517]/5` + `border-[#406517]/20`
- Blue: `from-[#003365]/5` + `border-[#003365]/20`
- Pink: `from-[#B30158]/5` + `border-[#B30158]/20`
- Mixed: `from-[#406517]/5 via-white to-[#003365]/5`

### 2. Section Headers with Colored Bars ⭐

Full-width colored header bars above section content.

```tsx
<section>
  <div className="bg-white border-[#406517]/20 border-2 rounded-3xl overflow-hidden">
    {/* Colored Header Bar */}
    <div className="bg-[#406517] px-6 py-4 flex items-center gap-3">
      <Bug className="w-6 h-6 text-white" />
      <span className="text-white font-semibold text-lg uppercase tracking-wider">
        Section Label
      </span>
    </div>
    
    {/* Content Area */}
    <div className="p-6 md:p-8 lg:p-10">
      {/* Section content */}
    </div>
  </div>
</section>
```

**Color Options:**
- Green: `bg-[#406517]`
- Blue: `bg-[#003365]`
- Pink: `bg-[#B30158]`
- Dark: `bg-gray-900`

### 3. Button Centering - CRITICAL ⭐⭐⭐

**NEVER let buttons span full width. Always center them.**

```tsx
// ❌ WRONG - Button spans full width
<Button className="w-full">Get Quote</Button>

// ❌ WRONG - Button inherits flex-1 width
<div className="flex">
  <Button className="flex-1">Get Quote</Button>
</div>

// ✅ CORRECT - Centered button, natural width
<div className="flex justify-center">
  <Button variant="primary">Get Quote</Button>
</div>

// ✅ CORRECT - Centered with pt for spacing
<div className="flex justify-center pt-4">
  <Button variant="primary" asChild>
    <Link href="/start-project">
      Free Instant Quote
      <ArrowRight className="ml-2 w-4 h-4" />
    </Link>
  </Button>
</div>

// ✅ CORRECT - Multiple centered buttons
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
  <Button variant="primary" size="lg">Primary Action</Button>
  <Button variant="outline" size="lg">Secondary Action</Button>
</div>
```

### 4. Product/Feature Cards with Images

```tsx
<Link href={product.href} className="group">
  <Card variant="elevated" hover className="h-full overflow-hidden !p-0 !rounded-2xl">
    {/* Badge */}
    <Badge 
      className="absolute top-3 left-3 z-10 !text-white"
      style={{ backgroundColor: product.color }}
    >
      {product.badge}
    </Badge>
    
    {/* Image */}
    <Frame ratio="16/10">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </Frame>
    
    {/* Content */}
    <Stack gap="xs" className="p-4">
      <div className="flex items-center gap-2">
        <product.icon className="w-4 h-4" style={{ color: product.color }} />
        <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
          {product.subtitle}
        </Text>
      </div>
      <Heading level={4} className="!text-lg group-hover:text-[#406517] transition-colors !mb-0">
        {product.title}
      </Heading>
      <Text size="sm" className="text-gray-600 !mb-1">{product.description}</Text>
      <div className="flex items-center font-semibold text-sm" style={{ color: product.color }}>
        Learn more
        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Stack>
  </Card>
</Link>
```

### 5. Two-Column Content + Media Layout

```tsx
<TwoColumn gap="lg" className="items-center">
  {/* Text Content */}
  <Stack gap="md">
    <Heading level={2} className="!text-2xl md:!text-3xl text-gray-900">
      Section Title
    </Heading>
    <Text className="text-gray-600">
      Description paragraph...
    </Text>
    <BulletedList spacing="sm">
      <ListItem variant="checked" iconColor="#406517">Feature one</ListItem>
      <ListItem variant="checked" iconColor="#406517">Feature two</ListItem>
    </BulletedList>
    <div className="pt-2">
      <Button variant="primary" asChild>
        <Link href="/page">
          Call to Action
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>
    </div>
  </Stack>
  
  {/* Media */}
  <YouTubeEmbed
    videoId="VIDEO_ID"
    title="Video Title"
    variant="card"
  />
</TwoColumn>
```

### 6. Big Gradient CTA Section

```tsx
<section>
  <div className="bg-gradient-to-br from-[#406517] to-[#2d4710] rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
    {/* Decorative blurs */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
    
    <div className="flex flex-col items-center relative z-10 max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
        CTA Headline
      </h2>
      <p className="text-lg text-white/80 mb-8">
        Supporting text for the call to action.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="highlight" size="lg" asChild>
          <Link href="/action">
            Primary CTA
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10" asChild>
          <a href="tel:1234567890">
            <Phone className="mr-2 w-5 h-5" />
            Secondary CTA
          </a>
        </Button>
      </div>
    </div>
  </div>
</section>
```

### 7. Google Reviews Integration

```tsx
import { GoogleReviews } from '@/lib/design-system'

{/* Inside a gradient section card */}
<div className="w-full mb-8">
  <GoogleReviews 
    featurableId={process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID}
    minRating={5}
    maxReviews={9}
    carouselSpeed={8000}
  />
</div>
```

### 8. Icon Feature Cards Grid

```tsx
<Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="w-full">
  <FeatureCard 
    icon={Shield} 
    title={<span className="text-[#406517]">Feature Title</span>}
    iconColor="#406517"
    variant="elevated"
    className="!bg-[#406517]/5 !border-[#406517]/20 text-center"
  >
    Feature description text here.
  </FeatureCard>
  {/* More FeatureCards... */}
</Grid>
```

---

## 📚 Reference Files

- **Live Design System**: [http://localhost:3002/design-system](http://localhost:3002/design-system) ← **START HERE**
- **Design System Entry**: `src/lib/design-system/index.ts` (import from here)
- **Global Layout**: `src/components/GlobalLayout.tsx`

### Design System File Structure

```
src/lib/design-system/
├── index.ts              ← IMPORT FROM HERE
├── tokens.ts             ← Design tokens (colors, spacing, typography)
├── themes.ts             ← Theme definitions
├── components/           ← All component source files
│   ├── layout/           ← Container, Stack, Grid, TwoColumn, Frame
│   ├── typography/       ← Heading, Text, PageHero, PageHeader
│   ├── forms/            ← Button, Input, Select, Checkbox, etc.
│   ├── cards/            ← Card, FeatureCard, FlowCards, ItemListCard
│   ├── lists/            ← BulletedList, ListItem, OfferStack
│   ├── sections/         ← GradientSection, HeaderBarSection, CTASection
│   ├── media/            ← YouTubeEmbed, Video, ImageLightbox
│   ├── marketing/        ← GoogleReviews
│   ├── badges/           ← Badge, StatusBadge
│   ├── feedback/         ← Spinner, ProgressBar
│   ├── navigation/       ← PageLayout, Sidebar, MobileBottomNav
│   ├── overlays/         ← Modal, DeleteConfirmationDialog
│   └── utils/            ← Icon, ProofWall, Toggle
└── templates/            ← Pre-built page templates
    ├── PowerHeaderTemplate.tsx
    ├── WhyChooseUsTemplate.tsx
    ├── HowItWorksTemplate.tsx
    ├── FinalCTATemplate.tsx
    └── ...more
```

**To modify a component:** Edit the source file in the appropriate `components/` subfolder.
**To modify a template:** Edit the file in `templates/`.

### Pre-built Templates (Edit Once, Update Everywhere)

```tsx
import { 
  // Content Block Templates
  PowerHeaderTemplate,          // Hero header with video + action cards
  WhyChooseUsTemplate,          // "Why 92,000+ Customers Choose Us"
  HowItWorksTemplate,           // 3-step process (Plan → Receive → Install)
  WhoWeAreWhatWeDoTemplate,     // Two-column company info
  FinalCTATemplate,             // Big gradient CTA for page bottoms
  ProfessionalsCalloutTemplate, // "For Professionals" callout
  
  // Page Layout Templates (full page scaffolding)
  ProjectTypePageTemplate,      // For project type pages (screened-porch, etc.)
  ProductPageTemplate,          // For product detail pages
  InstallationPageTemplate,     // For installation guide pages
  SupportPageTemplate,          // For support/help pages
  GalleryPageTemplate,          // For gallery pages
} from '@/lib/design-system'
```

### Section Containers (Add Your Content)

```tsx
import { 
  GradientSection,    // Gradient-bordered section card
  HeaderBarSection,   // Section with colored header bar
  CTASection,         // Big gradient call-to-action
  TwoColumnSection,   // Responsive two-column layout
} from '@/lib/design-system'
```

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#406517` | Main brand, CTAs, success states |
| Navy Blue | `#003365` | Secondary brand, professional sections |
| Accent Pink | `#B30158` | DIY, special highlights |
| Gold/Orange | `#FFA501` | Stars, ratings, energy |

---

## 🎯 Quick Reference ⭐

### **Import Pattern** (CRITICAL)

```tsx
// ✅ CORRECT - Single import from design system
import { 
  Container, Stack, Grid, TwoColumn, Frame,
  Text, Button, BulletedList, ListItem,
  YouTubeEmbed, HeaderBarSection,
  PowerHeaderTemplate, WhyChooseUsTemplate, FinalCTATemplate,
} from '@/lib/design-system'

// ❌ WRONG - Don't import from /components
import { Container } from '@/lib/design-system/components'
```

### **Page Structure**

```tsx
<Container size="xl">
  <Stack gap="lg">
    {/* Hero: PowerHeaderTemplate OR custom gradient section */}
    {/* Templates: WhyChooseUsTemplate, HowItWorksTemplate, etc. */}
    {/* Content: HeaderBarSection with TwoColumn inside */}
    {/* CTA: FinalCTATemplate */}
  </Stack>
</Container>
```

### **Content Section Pattern** (from `/screened-porch`)

```tsx
<HeaderBarSection icon={Bug} label="Section Title" variant="dark">
  <TwoColumn gap="lg" className="items-center">
    <Stack gap="md">
      <Text className="text-gray-600">Content...</Text>
      <BulletedList spacing="sm">
        <ListItem variant="checked" iconColor="#406517">Item</ListItem>
      </BulletedList>
    </Stack>
    <YouTubeEmbed videoId="ID" title="Title" variant="card" />
  </TwoColumn>
</HeaderBarSection>
```

### Key Pattern Elements:

1. **Container size="xl"** - Outermost wrapper (1600px max-width)
2. **Stack gap="lg"** - Provides 32px spacing between sections
3. **PowerHeaderTemplate** - Hero section for category pages
4. **HeaderBarSection** - Colored header bar content sections
5. **TwoColumn** - Text + media layouts (stacks on mobile)
6. **Templates** - Shared content blocks that update site-wide

---

## 🚨 Remember

### The Bulletproof Pattern:

```
Container → Stack → PowerHeaderTemplate → HeaderBarSection content → FinalCTATemplate
```

### Golden Rules:

1. **Import from `@/lib/design-system`** - NOT `/components`
2. **Container size="xl" + Stack gap="lg"** - ALWAYS use this wrapper
3. **No mb-X on Stack children** - Stack handles ALL spacing
4. **PowerHeaderTemplate** - Use for category/product page heroes
5. **HeaderBarSection variant="dark"** - Use for content sections
6. **TwoColumn + YouTubeEmbed** - Standard content + video layout
7. **Use Templates** - WhyChooseUsTemplate, FinalCTATemplate, etc.
8. **Mobile-first always** - Start with mobile, then add desktop

### Reference Files:

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage - custom hero + templates |
| `src/app/screened-porch/page.tsx` | Category page - PowerHeaderTemplate + HeaderBarSection |
| `http://localhost:3002/design-system` | All components with live examples |

---

## 📈 Quick Stats

**Design System Includes:**
- **11 Templates** - 6 content blocks + 5 page layouts
- **4 Section Containers** - Empty containers for custom content
- **20+ Components** - Layout, typography, cards, marketing
- **100% Mobile-First** - Responsive by default

---

**Last Updated**: February 2, 2026  
**Version**: 1.0 - Mosquito Curtains Design System  
**Live Reference**: [http://localhost:3002/design-system](http://localhost:3002/design-system)



