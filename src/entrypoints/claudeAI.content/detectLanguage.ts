export default async function detectLanguage(inputText: string) {
  const result = await browser.i18n.detectLanguage(inputText);

  if (result && result.languages) {
    const lang = result.languages[0].language;
    return lang;
  } else {
    throw new Error("Language detection failed");
  }
}
