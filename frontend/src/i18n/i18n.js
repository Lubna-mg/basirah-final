import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en }
  },
  fallbackLng: "ar",
  lng: localStorage.getItem("lang") || "ar",
  interpolation: { escapeValue: false }
});

export default i18n;
