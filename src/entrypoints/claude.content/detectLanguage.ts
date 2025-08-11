import { debugError } from "../../utils/debugLogger";

type LanguageDetection = {
  language: string;
  percentage: number;
};

type DetectionResult = {
  isReliable: boolean;
  languages: LanguageDetection[];
};

function getTargetLanguagePercentages(
  detection: DetectionResult,
  targets: string[] = ["iw", "he", "ar", "fa"]
): { language: string; percentage: number }[] {
  if (!detection || !Array.isArray(detection.languages)) {
    return [];
  }

  return detection.languages
    .filter(({ language }) => targets.includes(language))
    .map(({ language, percentage }) => ({ language, percentage }));
}

/**
 * Detects if the input text is written in a right-to-left (RTL) language and returns information about the detected language.
 *
 * @param inputText - The text to analyze for RTL language detection.
 * @returns A promise that resolves to a tuple:
 *   - The first element is a boolean indicating whether an RTL language was detected.
 *   - The second element is either an object containing the detected language and its percentage, or `null` if no RTL language was detected.
 *
 * @remarks
 * This function uses the browser's i18n API to detect the language of the input text,
 * then checks for RTL languages among the detected results. If multiple RTL languages are detected,
 * the one with the highest percentage is returned.
 *
 * @throws Logs an error to the console if language detection fails, and returns `[false, null]`.
 */
export default async function detectRTLLanguage(
  inputText: string
): Promise<[boolean, { language: string; percentage: number } | null]> {
  try {
    const result = await browser.i18n.detectLanguage(inputText);
    const rtlMatches = getTargetLanguagePercentages(result);

    if (rtlMatches.length === 0) {
      return [false, null];
    }

    // Find the language with the highest percentage
    const topMatch = rtlMatches.reduce((prev, curr) =>
      curr.percentage > prev.percentage ? curr : prev
    );

    return [true, topMatch];
  } catch (error) {
    debugError("Error during language detection:", error);
    return [false, null];
  }
}
