export default function getUILanguageDirection(lang: string): "ltr" | "rtl" {
  const rtlLanguages = [
    "ar",
    "he",
    "iw",
    "fa",
    "ur",
    "yi",
    "jrb",
    "jpr",
    "dv",
    "ps",
    "sd",
    "ug",
  ];
  return rtlLanguages.includes(lang) ? "rtl" : "ltr";
}
