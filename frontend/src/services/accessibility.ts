export type FontSizePreference = 'normal' | 'large' | 'xlarge';

const FONT_SIZE_STORAGE_KEY = 'lfi_font_size_preference';

export const loadFontSizePreference = (): FontSizePreference => {
  try {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (saved === 'large' || saved === 'xlarge') {
      return saved;
    }
  } catch (e) {
    // LocalStorage inaccessible
  }
  return 'normal';
};

export const saveFontSizePreference = (pref: FontSizePreference): void => {
  try {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, pref);
  } catch (e) {
    // LocalStorage inaccessible
  }
  applyFontSize(pref);
};

export const applyFontSize = (pref: FontSizePreference): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font-scale', pref);
};
