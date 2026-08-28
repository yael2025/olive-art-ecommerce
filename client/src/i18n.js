import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import he from "./locales/he.json";

const savedLanguage = localStorage.getItem("language") || "he";

document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === "he" ? "rtl" : "ltr";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      he: {
        translation: he,
      },
    },

    lng: savedLanguage,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;