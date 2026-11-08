# AI product design — patterns, trust and human control

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ai-product.md (Telos 12) @ 3c0e291 — translated, complete

Platform pages: `../apple-hig/references/generative-ai.md`, `../apple-hig/references/machine-learning.md`.
Copy for AI states and errors: `../ux-writing/references/principles.md`.

## Contents
1. AI products differ from deterministic software
2. Define the use case
3. Six groups of AI UX patterns
4. Conversation design
5. Error and recovery
6. Autonomy and agents
7. Privacy, safety and fairness
8. Evaluating AI UX
9. Design system for AI
10. The designer's role
11. Checklist

---

## 1. AI products differ from deterministic software

Traditional software usually gives predictable output; AI produces probabilistic output that can be wrong, change, or be unexplainable.
UX must therefore manage **expectation, input quality, uncertainty, trust, control and recovery**.

## 2. Define the use case

Do not start with "add a chatbot". Define the job, the data, the risk level, the value AI adds over a rule-based system, and the success
criteria. Classify the AI as: assisting the user, generating content, predicting, recommending, or acting on its own. **The higher the
autonomy, the more it needs permission, preview, approval and audit.**

## 3. Six groups of AI UX patterns

| Group | What it contains | Rules |
|---|---|---|
| **Wayfinders** | Starter prompts, examples, suggested actions, templates, guided setup — help people past the blank page | Personalise by context but allow skipping |
| **Input patterns** | Prompt composer, attachments, multimodal input, variables/chips, slash commands, prompt enhancement | Show constraints, format, which data is used, and how to fix the input |
| **Tuners** | Regenerate, variations, parameters, style, length, constraints, iterative refine | Keep history/versions so a good output is never lost; allow compare and branch when needed |
| **Human-in-the-loop / Governors** | Preview, approve, edit, reject, stop, undo, scope, escalation | Hard-to-reverse actions need confirmation; batch actions need a summary and exceptions; **no dark patterns pushing users to accept AI** |
| **Trust builders** | Citation/source, appropriate confidence, explanation, limitations, model/data notice, progress, provenance | Citations must be verifiable; never show falsely precise confidence; convey uncertainty in terms of the decision the user must make |
| **Identifiers** | Mark content/actions as AI-generated and which system is responsible | Do not over-humanise the brand/personality so users believe the AI understands, remembers or has authority beyond reality |

## 4. Conversation design

Define system capability, persona/tone, turn-taking, context window, repair and escalation. Responses must be scannable; use structured
output / cards / actions when they work better than paragraphs. Let users edit the prompt, reference a previous item and reset context.

## 5. Error and recovery

Failures: hallucination, refusal, timeout, unsafe output, missing data, tool failure, partial completion, action conflict.
Messages must distinguish **"don't know"**, **"not allowed"**, **"can't access"** and **"temporary error"**. Offer guided retry, edit input,
an alternative, or handoff to a human.

## 6. Autonomy and agents

Progressive model: **suggest → draft → execute with approval → execute within scope → autonomous monitoring**.
Each level needs boundary, permission, budget/time limit, status, log and a **kill switch**. An agent reports its plan/actions at a level that
helps the user stay in control without creating noise.

## 7. Privacy, safety and fairness

Minimise data, disclose retention/training use, redact sensitive information and separate workspaces. Design specific consent — never
bundled. Test bias across groups, abuse/misuse, prompt injection and data leakage. High-stakes domains need expert review and a fallback.

## 8. Evaluating AI UX

Measure task success and quality, not just "nice-looking responses". Evaluation includes:
- Offline benchmark / golden set.
- Human rating with a rubric.
- Factuality/grounding and citation validity.
- Latency, cost and failure rate.
- Override / edit / retry rate.
- Trust calibration: users trust at the right time and doubt at the right time.
- Longitudinal impact, not only first impression.

## 9. Design system for AI

Machine-readable tokens/components, usage rules, content schemas and examples help AI generate consistent output. The design system needs
patterns for prompt, source, generation status, approval and error. AI consumers need deeper constraints and documentation than component
pictures. (Token/component structure: `../figma-ui-flow/references/design-system.md`.)

## 10. The designer's role

The designer shifts from producing individual screens to framing, orchestration, system rules, curation and evaluation. Key skills:
research, content/conversation, systems thinking, data literacy, prototyping with AI/code, safety and business trade-offs.

## 11. Checklist

- [ ] AI solves a clear job, not just a trend.
- [ ] Capability/limitations are communicated.
- [ ] Output can be edited, retried, undone or escalated.
- [ ] Source/confidence used correctly and verifiable.
- [ ] Autonomy has scope, permission, log and stop.
- [ ] Data handling and consent are clear.
- [ ] Evaluation has a rubric, a failure set and guardrails.

Main sources (Telos Academy, Vietnamese): AI UX patterns; observing AI for UI/UX design (early 2026); how AI improves UI/UX; will AI replace
designers; UI/UX product design and AI; the Design System × AI series.
