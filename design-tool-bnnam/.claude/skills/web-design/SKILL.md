---
name: web-design
description: End-to-end website design knowledge — telling a marketing website from a digital product (goals, metrics, team), web agency vs product team, the full build process (direction, UX and structure with sitemap / flow / wireframe, homepage anatomy and responsive layout, content and media, development handoff, QA and launch with accessibility, performance, SEO, analytics, then post-launch measurement), six web UX principles, choosing no-code tools such as Framer, and a website handoff checklist. Use whenever the work is a website, landing page, corporate site, blog, web app or responsive web layout rather than a native app screen, including Vietnamese requests such as "thiết kế website", "làm landing page", "bố cục trang chủ", "sitemap cho web", "web responsive thế nào", "bàn giao website", "có nên dùng Framer". For native iPhone screens use apple-design-iphone; for Android use material-design-3; for the Figma build loop use figma-ui-flow.
---

# web-design — designing a website end to end

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/web.md @ 3c0e291 — translated, complete

The tool-demo skills target native mobile apps. This skill adds the **website view**: what kind of web thing you are making, the
process from brief to launch, and what to hand off. Figma mechanics stay in `../figma-ui-flow/SKILL.md` and
`../figma-agent-tools/SKILL.md`; visual layout fundamentals (grid, spacing, hierarchy) in `../mobile-ui-master/SKILL.md`;
accessibility rules in `../mobile-ux-fundamentals/references/accessibility.md`; copy in `../ux-writing/SKILL.md`.

## 1. Marketing website or digital product — decide first
It is a spectrum, not two boxes: landing pages, corporate sites and blogs sit near marketing; e-commerce and learning platforms in
the middle; task management, SaaS, social networks and software products near product.

| Aspect | Marketing website | Digital product |
|---|---|---|
| Role | An asset supporting marketing / business | The product or a core business unit |
| Value | Communicate and lead to conversion | Help people do recurring work |
| Relationship | Usually short visits | Long-term; retention matters |
| Success | Traffic, leads, conversion, SEO | Activation, task success, retention, revenue |
| Change | By campaign / content / brand | Continuous, by roadmap and behaviour data |
| Team | Agency / project, brief → deadline | Cross-functional product team, iteration |

**Common mistake:** designing a showcase website like complex software, or a product like an ad page that values impression over the task.

## 2. Web agency vs product team
- **Agency:** works by project, scope, budget and deadline; the goal is delivering what was promised to the client. People serve many
  clients and grow speed, visual storytelling and brief communication.
- **Product team:** a long-term R&D unit; ownership continues after release; decisions come from product metrics, technical debt and roadmap.
- **Web designer** prioritises communication, brand, content hierarchy, conversion and responsiveness. **Product designer** prioritises
  mental models, flows, states, data, systems and long-term outcomes. Many real roles do both — the distinction tells you which skill
  the job is asking for.

## 3. The process, end to end

### 3.1 Direction
- Business goal: introduce, generate leads, sell, recruit, or self-service.
- Audience, pain points, traffic sources, device / context.
- Primary / secondary conversion and their metrics.
- Page scope, languages, CMS, integrations, legal and maintenance.
- Content owner, approver and timeline.

### 3.2 UX and structure
Research users / competitors → inventory and audit content → define IA / sitemap → main user flows → content outline → wireframes.
**Sitemap** answers *what the site contains*, **flow** answers *how people move*, **wireframe** answers *where information sits*.

### 3.3 UI and layout
- The **homepage answers fast:** who this is, what they offer, for whom, whether it's trustworthy, and what to do next.
- Typical anatomy: header / navigation · hero / value proposition · proof · benefits / services · cases / testimonials · CTA · footer —
  **order follows the goal**, not a fixed template.
- Inner pages adopt the homepage's system but prioritise their own task.
- Layout uses grid, container, columns, gutters, whitespace and visual hierarchy.
- **Responsive = redesign hierarchy and navigation per breakpoint**, not shrinking the desktop.

### 3.4 Content and media
- Content strategy sets message, tone, taxonomy and journey. Foundation content = service / about pages; dynamic content = blog /
  cases / news. **Design with real copy as early as possible.**
- Images: relevant to the message, a clear focal point, enough resolution, suitable crop, alt text.
- Custom media differentiates; stock saves cost but needs a consistent selection, a license check, and no clichés.
- Prepare responsive images, sizes and optimised formats.

### 3.5 Development handoff
Front end builds layout, interaction, responsiveness, accessibility and performance; back end / CMS handles content, data,
authentication, integrations and business logic. **The designer hands off:** states, breakpoints, assets, tokens, animation,
error / empty / loading, and content rules.

### 3.6 QA and launch
- Functional: forms, links, search, filters, payment / integrations.
- Responsive / cross-browser / cross-device.
- Accessibility: keyboard, focus, semantics, contrast, screen-reader smoke test.
- Content: spelling, metadata, redirects, alt text, 404 page.
- Performance: images, fonts, scripts, Core Web Vitals.
- SEO: semantic HTML, title / description, canonical, structured data, sitemap.xml, robots.
- Analytics / consent and conversion events.
- Backup, security, ownership and a rollback plan.

### 3.7 After launch
Track errors, performance, funnels, search queries, conversion and feedback. A website needs content operations, SEO and
maintenance; a digital product also needs activation, retention, cohorts and a roadmap. **Release starts the measure–learn–improve loop.**

## 4. Six UX principles for the web
1. **User-centricity** — decide from needs and context.
2. **Consistency** — predictable elements and behaviour.
3. **Hierarchy** — clear priority of content and CTA.
4. **Context** — fit the device, moment and visit goal.
5. **User control** — back, cancel, undo, recovery.
6. **Accessibility** — everyone can reach and operate it.

## 5. When the "website" is really a mobile app
General principles: easy actions, consistency, clear feedback, user-centred, lean, intuitive navigation, touch-optimised, accessible.
iOS follows the HIG (`../apple-design-iphone/SKILL.md`), Android follows Material (`../material-design-3/SKILL.md`). **Never copy
pixels between platforms** while ignoring their conventions, navigation and permission behaviour. An app still goes strategy / UX →
UI / prototype → testing / data; Figma is a tool in many steps, not a substitute for product design. Mind safe areas, keyboard,
gestures, offline / poor network, permissions, notifications, Dark Mode and touch-target size.

## 6. No-code and technology choice
Framer suits landing pages, portfolios, blogs or sites that need visuals / motion and fast publishing; its built-in CMS, breakpoints
and hosting reduce handoff. **Don't pick a tool just because it is easy to design in** — weigh data, integrations, SEO,
localization, performance, ownership, export / migration and long-term cost.

## 7. Website handoff checklist
- [ ] Sitemap, flows and content inventory signed off.
- [ ] Desktop / mobile and breakpoint behaviour clear.
- [ ] Components and their states, error / loading / empty complete.
- [ ] Real copy, media and licenses checked.
- [ ] Accessibility and keyboard behaviour described.
- [ ] SEO metadata, headings and URL plan have an owner.
- [ ] Analytics events and conversions defined.
- [ ] CMS roles, backup, maintenance and support clear.
- [ ] Design QA done before launch.

## 8. Further reading (Vietnamese, Telos)
- Web vs Product series [P1](https://academy.telos.vn/web-vs-product-su-khac-biet-la-gi-phan-1-co-so/), [P2](https://academy.telos.vn/web-vs-product-su-khac-biet-la-gi-phan-2-goc-nhin-san-pham-ngu-dung/), [P3](https://academy.telos.vn/web-vs-product-goc-nhin-designer/), [P4](https://academy.telos.vn/web-vs-product-web-agency-vs-product-team/) — product spectrum, value, roles, organisation.
- [Website 101](https://academy.telos.vn/xay-dung-website-101-web-design/) — design, content, technical and media groups.
- [Learning web design](https://academy.telos.vn/thiet-ke-web-can-hoc-nhung-gi-va-bat-dau-tu-dau/) — process from IA to handoff.
- [Website layout](https://academy.telos.vn/bo-cuc-website-la-gi-mot-huong-dan-tu-tong-the-den-truc-quan/) — anatomy and layout.
- [6 UX principles](https://telos.vn/6-nguyen-tac-ux-can-biet-trong-thiet-ke-web/) and [images for websites](https://telos.vn/5-cach-de-su-dung-anh-hieu-qua-cho-website/).
- [8 mobile principles](https://academy.telos.vn/8-nguyen-tac-thiet-ke-app-cho-ios-va-android/) and [mobile app in Figma](https://academy.telos.vn/thiet-ke-giao-dien-app-bang-figma-tu-ui-den-product-design/).
- [Framer](https://telos.vn/framer-nen-tang-no-code-bien-y-tuong-thanh-website/) and [front end](https://telos.vn/tam-quan-trong-khi-hoc-front-end-trong-doanh-nghiep/).

## Workflow (a website request)
1. Place it on the spectrum (§1) — this sets goals, metrics and how much product thinking it needs.
2. Fill §3.1 direction; ask only for what is missing.
3. Sitemap → flows → content outline → wireframes (§3.2), with real copy as early as possible.
4. Homepage first (§3.3), then inner pages on the same system; design each breakpoint's hierarchy and navigation.
5. Hand off with the §7 checklist; plan §3.6 QA and §3.7 measurement.

## Self-check before reporting
- [ ] Marketing vs product position stated and reflected in goals / metrics.
- [ ] Homepage answers who / what / for whom / trust / next step.
- [ ] Each breakpoint redesigned, not just scaled.
- [ ] Real copy, alt text, licensed media.
- [ ] Handoff covers states, breakpoints, assets, tokens, animation, content rules; §7 checklist complete.
