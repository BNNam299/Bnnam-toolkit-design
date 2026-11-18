
export const DESIGN_ONLY_TOOLS: readonly string[] = [
  'set_interactions',
  'annotate',
  'set_dev_status',
  'bind_variables',
  'create_variables',
  'create_styles',
  'import_tokens',
  'export_tokens',
  'render_foundations',
  'create_component_set',
  'stress_test',
  'get_design_system',
  'search_design_system',
];

export function designOnlyError(command: string): string {
  return `${command} is Design-only and has no effect on this FigJam board.`;
}
