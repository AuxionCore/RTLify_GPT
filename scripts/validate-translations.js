#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating translations...');

const localesDir = path.join(__dirname, '../public/_locales');
const requiredKeys = [
  "whatsNewTitle",
  "whatsNewMessage", 
  "currentVersionTitle",
  "changelogTitle",
  "changelogMessage",
  "viewFullChangelogButton",
  "hideChangelogButton",
  "addedLabel",
  "fixedLabel",
  "changedLabel", 
  "removedLabel",
  "changesInVersion",
  "modernIconDesign",
  "textAlignmentButtonFix",
  "claudeTextAlignmentFix",
  "mathTextDisplayFix",
  "grokSupport",
  "wxtFrameworkUpdate",
  "claudeAlignmentFix",
  "claudeElementAlignment",
  "claudeFullSupport",
  "errorToastFeature",
  "timeoutHandling",
  "popupErrorFix",
  "selectorUpdate",
  "automaticAlignment",
  "deleteAllTextSupport",
  "disableAutoPopup",
  "typingAlignmentFix",
  "userPreferences",
  "whatsNewInPopup",
  "inactiveLinksFixed",
  "textDirectionAlignment",
  "installUpdatePages",
  "viteSupport",
  "dynamicVersionDisplay",
  "typescriptSupport",
  "separatedContentPages",
  "multipleButtonsFix",
  "feedbackLinkUpdate",
  "urduTranslationRemoval",
  "textAlignmentButton",
  "mathTextLTR",
  "arabicTranslation",
  "persianTranslation",
  "hebrewTranslation"
];

function validateLocale(locale) {
  const filePath = path.join(localesDir, locale, 'messages.json');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing locale file: ${filePath}`);
    return false;
  }

  const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const missingKeys = [];
  const emptyKeys = [];

  requiredKeys.forEach(key => {
    if (!messages[key]) {
      missingKeys.push(key);
    } else if (!messages[key].message || messages[key].message.trim() === '') {
      emptyKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    console.error(`❌ ${locale}: Missing keys:`, missingKeys);
  }
  
  if (emptyKeys.length > 0) {
    console.error(`⚠️  ${locale}: Empty messages:`, emptyKeys);
  }

  if (missingKeys.length === 0 && emptyKeys.length === 0) {
    console.log(`✅ ${locale}: All translations present`);
    return true;
  }

  return false;
}

// Get all locale directories or specific locale from command line
const targetLocale = process.argv[2]; // Allow specifying a single locale
let locales;

if (targetLocale) {
  locales = [targetLocale];
  console.log(`Validating only: ${targetLocale}`);
} else {
  locales = fs.readdirSync(localesDir).filter(item => {
    return fs.statSync(path.join(localesDir, item)).isDirectory();
  });
  console.log(`Found locales: ${locales.join(', ')}`);
}

let allValid = true;
locales.forEach(locale => {
  if (!validateLocale(locale)) {
    allValid = false;
  }
});

if (!allValid) {
  console.error('\n❌ Translation validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ All translations are valid!');
  process.exit(0);
}
