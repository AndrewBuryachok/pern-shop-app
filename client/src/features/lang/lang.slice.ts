import i18next from 'i18next';
import { createSlice } from '@reduxjs/toolkit';

export const langSlice = createSlice({
  name: 'lang',
  initialState: {},
  reducers: {
    toggleCurrentLanguage: () => {
      const lang = i18next.language === 'uk' ? 'en' : 'uk';
      i18next.changeLanguage(lang);
      localStorage.setItem('lang', lang);
    },
  },
});

export default langSlice.reducer;

export const { toggleCurrentLanguage } = langSlice.actions;
