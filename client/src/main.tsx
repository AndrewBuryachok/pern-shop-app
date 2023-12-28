import React from 'react';
import ReactDOM from 'react-dom/client';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import globalRU from './translations/ru/global.json';
import globalUK from './translations/uk/global.json';

i18next.use(initReactI18next).init({
  defaultNS: 'global',
  interpolation: { escapeValue: false },
  lng: localStorage.getItem('lang') || navigator.language.split('-')[0],
  fallbackLng: 'ru',
  resources: { ru: { global: globalRU }, uk: { global: globalUK } },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
);
