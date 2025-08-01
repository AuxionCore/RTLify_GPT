import { RTL_LANGUAGES } from '../constants';

export default function getUILanguageDirection(lang: string): "ltr" | "rtl" {
  return RTL_LANGUAGES.includes(lang as any) ? "rtl" : "ltr";
}
