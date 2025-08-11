# Changelog Management System

This system provides a structured way to manage and display version changes for the RTLify GPT extension.

## Files Overview

### `/src/data/changelog.ts`
Central data file containing all version history in a structured format.

#### Structure:
```typescript
interface ChangelogEntry {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
  removed?: string[];
}
```

### How to Add a New Version

1. **Update `/src/data/changelog.ts`:**
   Add a new entry at the beginning of the `changelog` array:
   ```typescript
   {
     version: "3.1.0",
     date: "2025-07-15",
     added: [
       "New feature description"
     ],
     fixed: [
       "Bug fix description"
     ]
   }
   ```

2. **Update translation files:**
   Add version-specific messages to all language files in `/public/_locales/`:
   ```json
   "version310Title": {
     "message": "Version 3.1.0",
     "description": "Version 3.1.0 title"
   }
   ```

3. **The system automatically:**
   - Shows current version changes in the "What's New" page
   - Displays appropriate changelog in popup notifications
   - Maintains full version history

## Translation Keys

### Core changelog keys:
- `changelogTitle` - "Release History" title
- `changelogMessage` - Description of changelog section
- `viewFullChangelogButton` - Button to show full history
- `hideChangelogButton` - Button to hide history
- `currentVersionTitle` - Current version section title

### Change type labels:
- `addedLabel` - "Added:" label
- `fixedLabel` - "Fixed:" label  
- `changedLabel` - "Changed:" label
- `removedLabel` - "Removed:" label

### Dynamic content:
- `changesInVersion` - Shows count of changes in popup

## Features

### 📱 What's New Page
- Prominently displays current version changes
- Expandable/collapsible full changelog
- Automatic date formatting per locale
- Color-coded change types with icons

### 🔔 Popup Notifications
- Smart change count in notifications
- Links to full "What's New" page
- Fallback to generic messages

### 🌍 Multi-language Support
- All text pulled from translation files
- Date formatting respects user locale
- RTL language support maintained

## Benefits

✅ **Easy Maintenance:** Add new versions by updating one data file  
✅ **Consistent Presentation:** Uniform styling and structure  
✅ **Automatic Integration:** Changes appear everywhere automatically  
✅ **Better UX:** Users can explore full history if interested  
✅ **Translation Ready:** All text translatable through standard i18n  

## CSS Classes

- `.current-version-section` - Highlighted current version
- `.version-section` - Regular version entries  
- `.change-type.added/fixed/changed/removed` - Color-coded change types
- `.changelog-content.hidden` - Toggle visibility
- `.toggle-button` - Expand/collapse button
