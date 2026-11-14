// build_vectors stages (figma-vector-illustration): the vector frame's name shows how far the drawing is — "Hotdog · vector · 1 thô",
// "… · 2 khối", "… · 3 chi tiết", then the plain name at lock. A test run renamed the frame by hand once and then forgot, so the
// stage now rides on the build call itself.

// the frame name for a stage: "<base> · <stage>", or the base alone when the stage is "" (lock)
export const stageFrameName = (base: string, stage: string): string => (stage ? `${base} · ${stage}` : base);

// a frame already carrying a stage of this base ("Hotdog · vector · 2 khối" for base "Hotdog · vector"), or the base itself
export const isStageOf = (name: string, base: string): boolean =>
  name === base || (name.startsWith(`${base} · `) && /^\d/.test(name.slice(base.length + 3)));
