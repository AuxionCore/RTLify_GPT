#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Auto-generating missing translation placeholders...');

const localesDir = path.join(__dirname, '../public/_locales');
const hebrewPath = path.join(localesDir, 'he', 'messages.json');

// Translation templates (you would replace these with actual translations)
const translationTemplates = {
  en: {
    modernIconDesign: "Modern icon design",
    textAlignmentButtonFix: "Fixed text alignment button not appearing on ChatGPT website",
    claudeTextAlignmentFix: "Fixed text alignment button sometimes not appearing on Claude.ai website",
    mathTextDisplayFix: "Fixed mathematical text display issues in RTL languages",
    grokSupport: "Added full support for Grok.com website",
    wxtFrameworkUpdate: "Updated extension with WXT framework for better performance",
    claudeAlignmentFix: "Fixed text alignment issues on Claude.ai website",
    // Add more as needed...
  },
  ar: {
    modernIconDesign: "تصميم أيقونة حديث",
    textAlignmentButtonFix: "إصلاح زر محاذاة النص الذي لا يظهر على موقع ChatGPT",
    claudeTextAlignmentFix: "إصلاح زر محاذاة النص الذي لا يظهر أحياناً على موقع Claude.ai",
    mathTextDisplayFix: "إصلاح مشاكل عرض النص الرياضي في لغات RTL",
    grokSupport: "إضافة دعم كامل لموقع Grok.com",
    wxtFrameworkUpdate: "تحديث الإضافة بإطار عمل WXT لأداء أفضل",
    claudeAlignmentFix: "إصلاح مشاكل محاذاة النص على موقع Claude.ai",
    // Add more as needed...
  },
  fa: {
    modernIconDesign: "طراحی آیکون مدرن",
    textAlignmentButtonFix: "رفع مشکل دکمه تراز متن که در وب‌سایت ChatGPT ظاهر نمی‌شد",
    claudeTextAlignmentFix: "رفع مشکل دکمه تراز متن که گاهی در وب‌سایت Claude.ai ظاهر نمی‌شد",
    mathTextDisplayFix: "رفع مشکلات نمایش متن ریاضی در زبان‌های RTL",
    grokSupport: "اضافه کردن پشتیبانی کامل از وب‌سایت Grok.com",
    wxtFrameworkUpdate: "به‌روزرسانی افزونه با فریم‌ورک WXT برای عملکرد بهتر",
    claudeAlignmentFix: "رفع مشکلات تراز متن در وب‌سایت Claude.ai",
    // Add more as needed...
  }
};

function generateMissingTranslations() {
  // Read Hebrew as reference
  const hebrewMessages = JSON.parse(fs.readFileSync(hebrewPath, 'utf8'));
  
  Object.keys(translationTemplates).forEach(locale => {
    const localePath = path.join(localesDir, locale, 'messages.json');
    
    if (fs.existsSync(localePath)) {
      const existingMessages = JSON.parse(fs.readFileSync(localePath, 'utf8'));
      let hasChanges = false;
      
      // Add missing translations
      Object.keys(translationTemplates[locale]).forEach(key => {
        if (!existingMessages[key]) {
          existingMessages[key] = {
            message: translationTemplates[locale][key],
            description: hebrewMessages[key]?.description || `Translation for ${key}`
          };
          hasChanges = true;
          console.log(`➕ Added ${locale}.${key}: "${translationTemplates[locale][key]}"`);
        }
      });
      
      if (hasChanges) {
        fs.writeFileSync(localePath, JSON.stringify(existingMessages, null, 2), 'utf8');
        console.log(`✅ Updated ${locale}/messages.json`);
      } else {
        console.log(`📋 ${locale}/messages.json - no changes needed`);
      }
    }
  });
}

console.log('⚠️  This script adds basic translation templates.');
console.log('⚠️  Please review and improve translations before production use.');
console.log('');

generateMissingTranslations();

console.log('');
console.log('✅ Translation template generation complete!');
console.log('📝 Review and improve the generated translations as needed.');
