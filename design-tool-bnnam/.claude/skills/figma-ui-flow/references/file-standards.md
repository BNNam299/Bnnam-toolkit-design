# File standards, naming and layout

## Contents
1. File and page structure
2. Naming rules
3. Auto Layout — mandatory standard
4. Frame sizes and layout grids by platform
5. Sections, status and versions
6. File hygiene

---

## 1. File and page structure

### 1.1 Splitting files
| File type | Contains | Who edits |
|---|---|---|
| `[Brand] Foundations` | Variables, styles, icons, brand imagery | Design system owner |
| `[Brand] Components` | Component library, published as a Library | Design system owner |
| `[Product] – [Feature]` | Screens, flows, prototype for one feature | Feature designer |
| `[Product] – Explorations` | Free-form ideas, never used as a source of truth | Anyone |

Small projects (one person, one app) may merge Foundations + Components into the product file, but still keep separate pages.

### 1.2 Standard page order
```
📘 Cover            cover image: name, status, owner, last updated
📝 Brief            goals, users, constraints, document links
🧪 Explore          drafts, moodboard, exploration directions
🎨 Foundations      displays variables/styles (swatches, type specimen, spacing)
🧩 Components       main components + Playground
📱 Screens          screens organized by flow
▶️ Prototype        wired flows for testing
✅ Ready for dev    only approved work
🗄 Archive          old versions, rejected directions (don't delete, so the reasoning can be looked up)
```
Emoji make the page list quick to scan; if the team dislikes emoji, use number prefixes `00 Cover`, `10 Brief`…

### 1.3 Cover
A 1920×960 frame with: project name, status (🟡 In progress / 🟢 Ready / ⚪ Archived), owner, last updated date, PRD/ticket link. Update it every time the status changes.

## 2. Naming rules

### 2.1 General
- Use `/` to create hierarchy: Figma groups them automatically in the picker (`color/text/primary`, `Button/Primary`).
- Lowercase + hyphens for tokens: `color/surface/raised`, `space/4`.
- Title Case for components and properties: `List Row`, `State=Pressed`.
- English for technical names (tokens, components, layers) to match code; other languages may be used for content, descriptions and annotations.

### 2.2 Screens
`[Flow] / [Screen] / [State]` — e.g. `Checkout / Payment / Error – card declined`.
Add a platform suffix for multi-platform work: `… / iOS`, `… / Android`.

### 2.3 Inner layers
| Type | Name | Example |
|---|---|---|
| Screen region | fixed names (designer standard) | `Top Container`, `Content`, `Bottom Container` |
| Layout block inside a region | functional noun | `actions`, `Summary Container`, `Group List` |
| Text | role | `title`, `subtitle`, `body`, `label`, `caption` |
| Icon | `icon/<name>` | `icon/chevron-right` |
| Image | `image/<content>` | `image/avatar` |
| Free decoration | `decor/<description>` | `decor/blob-top` |
| Overlay | `overlay/<description>` | `overlay/scrim` |

Layer names should match the variable/property names dev will use — this makes Dev Mode and Code Connect easier to read.

### 2.4 Forbidden
`Frame 123`, `Group 4`, `Rectangle 9`, `Copy`, `Final`, `Final-final-v2`, dates in layer names.

## 3. Auto Layout — mandatory standard

### 3.1 When
- **Yes:** every content container — buttons, cards, lists, forms, nav, the entire screen.
- **No:** illustrations, decorative layers, intentional absolute positioning (a corner badge → use "Ignore auto layout"/absolute position inside the Auto Layout frame).

### 3.2 Sizing behavior
| Setting | Use when |
|---|---|
| **Hug** | Size follows content: button, chip, tag |
| **Fill** | Fills the parent: text in a card, row in a list, input in a form |
| **Fixed** | Only with a real reason: 24×24 icon, avatar, device frame |

Rule of thumb: **parent Fixed or Fill, child Fill or Hug.** Long text set to Fill + auto height so it wraps.

### 3.3 Spacing
- `gap` and `padding` always bind to spacing variables (4/8 scale: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- Use **gap** between elements and **padding** for inner edges — never insert transparent rectangles as spacers.
- `Space between` for navigation bars and headers with two ends.
- Min/max width for long reading text (≈ 45–75 characters per line on web) and for flexible components.
- Wrap for chips and tags; Grid layout (if your Figma version has it) for card grids.

### 3.4 Nesting
Don't nest deeper than necessary: if a frame has only one child and no padding/fill/stroke of its own, remove it. Typical depth for a screen: 4–6 levels.

### 3.5 Testing
Stretch the screen width 320 → 430 (mobile) or 1280 → 1920 (web): no overlaps, no clipped text, spacing stays intact.

## 4. Frame sizes and layout grids by platform

### 4.1 Mobile
| Platform | Main design frame | Also test | Suggested grid |
|---|---|---|---|
| iOS | **New project: 402 × 874**, r44, top safe area 62 / bottom 34. **Existing project: the size of the screens already designed in that file** — keep their aspect ratio so new screens line up with the old ones | 375 (small), 440 (Pro Max) | 4 columns, margin 16, gutter 8–16 |
| Android | 360 × 800 or 412 × 915 | 600+ (foldable/tablet) | 4 columns, margin 16, gutter 8–16 |

Respect safe areas: status bar, Dynamic Island, home indicator (iOS); status bar, gesture bar (Android). Use device frames/safe-area frames as reference layers and don't draw content over them.

### 4.2 Tablet and Web
| Breakpoint | Frame | Grid |
|---|---|---|
| Tablet | 768 / 834 / 1024 | 8 columns, margin 24–32, gutter 16–24 |
| Desktop | 1280 / 1440 | 12 columns, max content 1120–1200, gutter 24 |
| Wide | 1920 | 12 columns, content doesn't stretch indefinitely — has a max width |

> Device sizes change with each hardware generation. When a project targets specific devices, re-check the current dimensions.

### 4.3 Grid
- Save layout grids as shared **styles** (`grid/mobile`, `grid/desktop`).
- A 4pt baseline grid on mobile keeps text aligned; optional for web.

## 5. Sections, status and versions

- Use **Sections** to group screens by flow; name each Section after its flow. Mark "Ready for dev" per Section.
- Status labels on the canvas (component or sticky): `🟡 WIP`, `🔵 In review`, `🟢 Approved`, `🔴 Needs changes`.
- **Versions:** save versions manually (Save to version history) at each milestone: before a major direction change, after each review gate, before publishing the library. Version name: `v1.2 – Add dark mode to Settings`.
- **Branching** (if your plan has it): every major change to a library file goes through a branch + review before merging.

## 6. File hygiene

Before every presentation or handoff:
1. Delete unused hidden layers and experimental frames that strayed outside Explore.
2. No default names left (run `audit_design` then `rename_by_rule`, or a rename plugin).
3. No orphaned styles/variables (defined but unused) — or note the reason for keeping them.
4. Detach instances only when unavoidable and record why; detached instances are design debt.
5. Heavy images: compress before inserting; illustrations use real images or placeholders with the correct aspect ratio.
6. Tidy canvas: screens laid out in an aligned grid with even spacing (e.g. 200px between screens, 400px between Sections).
