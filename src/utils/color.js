import chroma from 'chroma-js';

export const active = (color) => chroma(color).darken(0.6).css();

export default {
  active,
};
