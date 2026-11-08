# Figma practice: files, auto layout, components, variables, AI

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/figma-practice.md @ 3c0e291 — translated, complete (the section
> "Designer — background with shape + blur" lives in `../screen-background/references/technique.md`)

Knowledge is a lens for thinking, not a procedure. Where a team rule (`../bnnam-standards/SKILL.md`) or the tool demo's file
standard (`../figma-ui-flow/references/file-standards.md`) is more specific, it wins.

## Contents
Part A — Advanced Figma practice: system, prototype, performance
1. File setup
2. Auto layout
3. Constraints and responsive
4. Components
5. Variables and tokens
6. Advanced prototyping
7. Dev Mode and handoff
8. File performance
9. Plugin governance
10. AI workflow
11. Audit checklist

Part B — Figma, AI and collaboration
12. Where Figma sits in product design
13. A professional file structure
14. Components and variants — common mistakes
15. Prototype and motion
16. Designer–developer collaboration
17. Plugins, templates and community resources
18. Three groups of AI in Figma
19. AI UX patterns
20. The designer's role in the AI era
21. Figma / AI checklist
22. Sources

Part C — Screen backgrounds (shapes + blur) → `../screen-background/references/technique.md`

---

## Part A — Advanced Figma practice: system, prototype, performance

## 1. File setup
A cover with owner / status / version; pages for foundations, components, flows, exploration and archive; sections per feature.
Meaningful naming conventions that describe readiness. Large libraries split into foundations, core components and domain components to
reduce dependencies. (The tool demo's page skeleton: `manage_pages{template}` — `../figma-agent-tools/SKILL.md`.)

## 2. Auto layout
Understand direction, gap, padding, alignment, wrap, hug, fill and fixed. Nested auto layout mirrors the interface structure; avoid
needlessly deep nesting. Absolute position only for real overlays / badges. Test by changing content, resizing and localising.

## 3. Constraints and responsive
Constraints describe the relation to the parent; auto layout describes distribution among siblings. Use min / max, variable modes and
breakpoint components when the system supports them. Don't create a separate frame for every size if a rule can express it.

## 4. Components
A stable anatomy; expose the properties consumers need; hide internal layers. Component sets along logical dimensions. Nested instances
and slots for composition. Add descriptions, preferred values and examples. Audit unused / duplicates before publishing
(`scripts/system-audit.js`). Depth: `atomic-design.md` §5–6.

## 5. Variables and tokens
Collections for color, spacing / number, related typography, and content if needed. Modes for light / dark, brand or density. Alias
primitive → semantic → component; avoid components pointing straight at primitives when theming is needed. Keep names in sync with code
and document fallbacks. Depth: `tokens.md`, `system-binding.md`.

## 6. Advanced prototyping
Interactive components for repeated states; variables for conditions / values; overlays for menus / dialogs; preserve scroll and smart
animate used on purpose. A prototype needs a scenario, a start point and instructions. Specify modal focus / escape even though Figma
doesn't fully simulate accessibility. Workflow: `../figma-prototype-flow/SKILL.md`.

## 7. Dev Mode and handoff
Mark ready for dev, use annotations, link stories and versions. Developers read variables / tokens, assets, measurements and code hints;
the designer supplies the logic inspect can't infer. Never use a screenshot in place of the source component. Handoff content:
`../ux-review-handoff/references/handoff-spec.md`.

## 8. File performance
Reduce oversized images, hidden layers, vector points, nested components and stray prototype connections. Archive exploration, split
files sensibly and publish libraries under control. Poor performance hurts collaboration and increases errors.

## 9. Plugin governance
An allow / review list; check permissions and data. Old plugins can break; keep an alternative workflow. Never build a critical pipeline
on a plugin with no owner. Templates / community assets need a license and provenance.

## 10. AI workflow
AI for drafts, content, images and renaming; Make for coded prototypes; Agent / MCP for cross-tool workflows. A good prompt has a goal,
context, design system, constraints, states, content and acceptance criteria. Always review structure, tokens, accessibility, code
quality and data.

## 11. Audit checklist
- [ ] Layers and pages have naming / status.
- [ ] Auto layout survives long content and resizing.
- [ ] Instances aren't detached at will.
- [ ] Variants / properties don't explode into combinations.
- [ ] Variable aliases support theming.
- [ ] Components have descriptions and states.
- [ ] Prototypes have a scenario / error path.
- [ ] Handoff has logic and a version.
- [ ] Plugins / AI follow the data policy.

---

## Part B — Figma, AI and collaboration

## 12. Where Figma sits in product design
Figma supports ideation, diagrams, wireframes, UI, components, prototypes, review and inspect. It is a collaboration environment, not the
whole UX process. Research, problem framing, business decisions, analytics and implementation still need their own methods and roles.

Core advantages: runs on the web, real-time collaboration, link sharing, comments, version history, components / styles, prototypes and
developer inspect. So BA / PM can describe flows, designers manage the interface, developers read the spec and stakeholders review — all
in one reference.

## 13. A professional file structure
- Pages by stage or domain; a clear cover and status.
- Sections group flows / features; frames instead of groups for layout.
- Layers, components and properties named by meaning.
- Auto layout for flexible structure; constraints for relations inside a frame.
- Styles / variables / tokens for color, type, spacing and theme.
- Libraries split foundations / components when scale requires.
- Prototype flows have an entry point, a scenario and a name.
- Archive / deprecated clearly marked; never delete history at will.

## 14. Components and variants — common mistakes
A component holds reusable structure; an instance stays linked to its source. Variants describe versions of the same nature — size /
state / emphasis. Component properties change text, boolean, instance or variant without detaching.

Common mistakes:
1. Unplanned properties with default names that are hard to find.
2. Variants for every content change.
3. Ignoring component properties, creating too many copies.
4. Variant explosion from meaningless combined dimensions.
5. Detaching instances, losing system updates.
6. Groups instead of frames, no auto layout.
7. Unnamed layers, arbitrary scaling, no systematisation.

Before adding a property, ask what the consumer needs to change, which combinations are valid, and how the code API will map to it.

## 15. Prototype and motion
A prototype tests the flow and communicates behaviour. Define trigger, action, transition, state and feedback. Smart Animate interpolates
differences between layers with the same name / structure; effective for state changes, but easily produces fake motion if the hierarchy
is wrong.

Good motion helps users understand source–destination, hierarchy, system status or the result of an action. Keep duration / easing
consistent, provide reduced motion and never let animation block the task. Complex prototypes must test errors, validation, keyboard and
data states, not only the happy path.

## 16. Designer–developer collaboration
Figma reduces file round-trips but doesn't solve alignment by itself. A good process:
1. Developers review feasibility from the wireframe.
2. Designers use tokens / components and describe edge cases.
3. Dev Mode / inspect supplies measurements, assets and variables.
4. Comments for specific issues; big decisions recorded in docs / meetings.
5. Handoff has acceptance criteria and a version.
6. Design QA compares the build with the behaviour, not only pixels.

BA / PM can use FigJam / wireframes to clarify requirements; developers can prototype constraints; marketing can reuse assets. Manage edit
/ library permissions to protect the source of truth.

## 17. Plugins, templates and community resources
Plugins help with icons, content, images, accessibility checks, renaming and data. But a plugin is a dependency: check the publisher,
permissions, what data is sent, update frequency and output. Templates / UI kits are for learning structure or moving fast; audit license,
accessibility, naming and fit with the brand / system before using them.

## 18. Three groups of AI in Figma
- **Group 1 — task assistance:** First Draft, generating / rewriting / translating text, replacing content, generating / editing images,
  removing backgrounds, upscaling, renaming layers and suggesting interactions. An acceleration layer; review the output for content,
  hierarchy, bias and accessibility.
- **Group 2 — prompt-to-code and working prototypes:** Figma Make builds UI with logic / state from a prompt; Figma Sites supports
  design-to-publish. Suits stakeholder demos, validation, dropdowns / filters / forms, or interactions traditional prototypes struggle
  with. Generated code needs review of architecture, security, performance, data and maintainability; "it runs" doesn't mean
  production-ready.
- **Group 3 — Agents and MCP:** an agent can run a chain of tasks in Figma; MCP is the gateway for external AI to read context / the
  design system or do work under granted permissions. Choose an agent when the work stays inside Figma; MCP when it must connect to a
  codebase / other tools. Control scope, permissions, sensitive data, audit trail and human approval.

Features, plans and access conditions change fast; account details in the source articles are only valid at publication — check Figma's
current documentation.

## 19. AI UX patterns
AI products have nondeterministic output and need their own patterns:
- **Wayfinders:** example prompts, suggestions, starters so newcomers know where to begin.
- **Input patterns:** prompt composer, attachments, multimodal input, prompt enhancement.
- **Tuners:** parameters, constraints, regenerate, variations and refine.
- **Human-in-the-loop / governors:** review, edit, approve, undo, stop, and scoping the permission to act.
- **Trust builders:** sources / citations, confidence, limitations, progress, explanation and data-use notices.
- **Identifiers:** a clear way to show AI / brand so users know which system they are dealing with.

Patterns must address uncertainty, control and trust. Avoid anthropomorphism that misleads users about capability; distinguish a
suggestion from an action already executed; always offer recovery when the AI is wrong. More: `../mobile-ux-fundamentals/references/ai-product.md`.

## 20. The designer's role in the AI era
AI lowers the cost of "good enough" output but raises the need for framing, systems thinking, curation and validation. Designers need to:
- write clear context / constraints instead of only image prompts
- provide a machine-readable design system
- judge logic, desirability, feasibility and viability
- design trust, permissions, fallbacks and human control
- check accessibility, bias, privacy and failure modes
- understand code / data enough to review output and collaborate

## 21. Figma / AI checklist
- [ ] The file has structure, naming, status and an owner.
- [ ] Components / variants aren't duplicated or exploded.
- [ ] Responsive behaviour and edge states are described.
- [ ] Prototypes are tied to a scenario / test question.
- [ ] Handoff has a version and acceptance criteria.
- [ ] Plugins / templates have had permissions / licenses checked.
- [ ] AI input contains no data outside policy.
- [ ] AI output is reviewed for UX, code, accessibility and content.
- [ ] AI actions have suitable control, undo and audit.

## 22. Sources
Telos (Vietnamese):
- Part A: [9 Figma don'ts](https://telos.vn/figma-va-nhung-cam-ki-khi-dung-ui-ux-design/),
  [variant mistakes](https://telos.vn/5-sai-lam-cua-nguoi-moi-khi-su-dung-variant-trong-figma/),
  [Figma tips](https://telos.vn/khoa-hoc-figma-va-7-meo-tiet-kiem-thoi-gian-thiet-ke/),
  [Smart Animate](https://telos.vn/tutorial-su-dung-smart-animate-trong-figma/),
  [Figma at the centre](https://telos.vn/xay-dung-doi-ngu-voi-cong-cu-figma-lam-trung-tam/), the plugin / UI kit articles in the
  catalogue, [AI P1](https://academy.telos.vn/ai-trong-figma/) and [AI P2](https://academy.telos.vn/ai-trong-figma-la-gi-p2-figma-make-to-agent/).
- Part B: [Figma as the UI/UX standard](https://telos.vn/figma-su-lua-chon-tieu-chuan-cho-thiet-ke-ui-ux/) — web platform /
  collaboration · [9 don'ts](https://telos.vn/figma-va-nhung-cam-ki-khi-dung-ui-ux-design/) and
  [5 variant mistakes](https://telos.vn/5-sai-lam-cua-nguoi-moi-khi-su-dung-variant-trong-figma/) — file / component organisation ·
  [Figma tips](https://telos.vn/khoa-hoc-figma-va-7-meo-tiet-kiem-thoi-gian-thiet-ke/) and
  [Smart Animate](https://telos.vn/tutorial-su-dung-smart-animate-trong-figma/) — workflow / prototype ·
  [Figma for BA/DEV/IT](https://telos.vn/4-cach-su-dung-figma-cho-ba-dev-it/) and
  [Figma at the centre](https://telos.vn/xay-dung-doi-ngu-voi-cong-cu-figma-lam-trung-tam/) — collaboration ·
  [AI in Figma P1](https://telos.vn/ai-trong-figma-huong-dan-bat-tinh-nang-ai-trong-figma/) and
  [P2](https://academy.telos.vn/ai-trong-figma-la-gi-p2-figma-make-to-agent/) — three tool layers, Make, Agent and MCP ·
  [AI UX patterns](https://academy.telos.vn/ai-ux-pattern-la-gi/) — six pattern groups for AI products ·
  [AI for UI/UX early 2026](https://academy.telos.vn/quan-sat-ai-cho-ui-ux-design-dau-2026/) and
  [UI/UX product design with AI](https://academy.telos.vn/ui-ux-product-design-va-a-i-hoc-sao-cho-dung/) — changing designer skills.

---

## Part C — Screen backgrounds (shapes + blur)

Moved, not repeated: structure, the three blur methods, blur amounts (one layer ≥ 200 / ≈ 23 % of the long edge; Combined ~120 + ~200),
light vs dark overlays, bleeding past the frame edge, palette roles, the four side-by-side versions, alpha tokens and bound gradient stops,
and the platform limits (Live Activity, Dynamic Island, widgets, animated backgrounds) are all in
`../screen-background/references/technique.md` §1–8.
