export const BETA_MODE = typeof window !== 'undefined'
  && localStorage.getItem('arcane-beta-mode') === 'true';
