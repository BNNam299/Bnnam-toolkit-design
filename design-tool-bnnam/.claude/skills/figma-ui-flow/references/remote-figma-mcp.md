# Running figma-ui-flow on the official Figma MCP (remote)

Read this file when the session has **only** the official Figma MCP (`use_figma`, `get_metadata`…). If the session has `figma-agent` (`figma_status`, `render_tree`…), read `run-with-figma-agent.md` and the `figma-agent-tools` skill instead.

## Contents
1. Requirements and connection check
2. The toolset and when to use each tool
3. Standard loop: Read → Search → Write small → Look → Fix
4. Safety rules for writing
5. Plugin API recipes and common errors
6. When there is no MCP

> The Figma MCP tool list changes over time. Always trust the actual tool list in the session over this document. If the environment has Figma's official `figma-use` skill, read it for Plugin API details; this file covers **process and quality standards**.

---

## 1. Requirements and connection check

- Writing to the canvas requires the **remote Figma MCP server** (`https://mcp.figma.com/mcp`, OAuth sign-in). The desktop server (running through the Figma app) is read-only.
- Writing to files outside Drafts requires a **Full seat**. Write features may be in beta and may later be billed per use.
- Read tools are rate-limited by plan; write tools are usually exempt. → Avoid unnecessary reads (e.g. screenshotting a whole page when you only need one frame).
- Permission errors or a file that can't be found: call `whoami` to see which account is signed in, then tell the user.

## 2. The toolset and when to use each tool

| Tool | Use when | Notes |
|---|---|---|
| `whoami` | Permission errors, checking account/seat | |
| `get_metadata` | First step for any file/node: get the layer tree (ID, name, type, position, size) as compact XML | Cheap. Use it to break things down before calling heavy tools. Not for Figma Make files |
| `get_screenshot` | Viewing the design; verifying after a write | Capture exactly the node you need, not a whole large page |
| `get_design_context` | Getting the full context (structure + styles + reference code) of a node to understand it or convert it to code | Heavy — break it down with `get_metadata` first |
| `get_variable_defs` | Listing variables/styles used in the selection | Used in token audits |
| `search_design_system` | **Mandatory before creating a component**: find existing components, variables, styles in connected libraries | Core rule #3 |
| `use_figma` | Every write operation: create/edit/delete pages, frames, components, variants, variables, styles, text, images; and also checks (running read-only JS) | Runs Plugin API JavaScript in the file |
| `generate_figma_design` | Capturing a running app/website as Figma layers | Produces flat layers not linked to the library → use only for reference/quick mockups, not as the canonical design source |
| `create_new_file` | Creating an empty Design/FigJam file | |
| `generate_diagram` | Drawing diagrams (flowchart, sequence, gantt) in FigJam | Good for user flows and sitemaps in the brief stage |
| Code Connect (the `*code_connect*` tools) | Connecting Figma components to components in the codebase | Handoff stage |

Selection principle: **`use_figma` for structured writes** (using real components and variables); `generate_figma_design` only when you need a quick capture of a running interface.

## 3. Standard loop

```
READ     get_metadata (page/node) → understand structure, find node IDs
LOOK     get_screenshot (target node) → understand the current visuals
SEARCH   search_design_system → reusable components/variables/styles
PLAN     List the small writes, each one a verifiable unit
WRITE    use_figma — one unit (one component, one section, one screen)
LOOK     get_screenshot of the node just written → compare with intent
FIX      If it's off, fix it right away before writing the next unit
```

A reasonable size for one write: one component with its variants; one variable collection; one screen. Never bundle "the whole design system" into one script.

Each `use_figma` script should:
- Start by fetching nodes by ID (`await figma.getNodeByIdAsync(id)`) or finding the page by name — never rely on the user's current selection.
- `return` a small object describing the result (created node IDs, counts, warnings) for the next step to use.
- Be wrapped in `try/catch` and return clear errors.

## 4. Safety rules for writing

1. **Scope:** only write within the page/section the user specified, or pages created by the agent (`🧪 Explore`, `🤖 Agent sandbox`).
2. **Never delete** nodes the user created. If something needs replacing → create a new version beside it, rename the old one to `old/…`, and ask the user whether to delete it.
3. **Editing important things** (main library components, widely used variables) → report the impact scope (how many instances) first and wait for approval.
4. **Prefer branches** (if the plan supports them) for large changes to library files.
5. **Never rename/delete a variable** that is bound — it breaks every place that uses it. Add a new variable, migrate gradually, then clean up.
6. **Keep a log:** at the end of the session, list every node ID created/edited in the report.

## 5. Plugin API recipes and common errors

The JavaScript recipes (variables, binding, Auto Layout, text, components, audit) work the same in `use_figma` and `execute_code`: see `../figma-agent-tools/references/plugin-api-recipes.md`. Common errors: `../figma-agent-tools/references/troubleshooting.md`.

| Symptom specific to the remote MCP | Fix |
|---|---|
| The `use_figma` tool doesn't appear | You're on the desktop server, the client doesn't support writes yet, or the remote server needs reinstalling/re-authenticating |
| Rate limit | Reduce read calls: use `get_metadata` then read only the right node; combine checks into one `use_figma` script |

## 6. When there is no MCP

Switch to Designer mode: same process, the output is instructions for a person. For each step, state clearly:
- **Where:** panel/menu (e.g. Right sidebar → Auto layout → `+`, or the `Shift + A` shortcut).
- **What:** specific values, specific names.
- **Check:** the sign it's correct (e.g. "stretch the card, the content wraps automatically, padding stays at 16").

You can include a token table as JSON for the user to import with a variables import plugin, after running `scripts/check_tokens.py`.
