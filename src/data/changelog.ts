export interface ChangelogEntry {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
  removed?: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "3.0.0",
    date: "2025-08-11",
    added: [
      "Modern icon design"
    ],
    fixed: [
      "Text alignment button not appearing on ChatGPT website",
      "Text alignment button sometimes not appearing on Claude.ai website", 
      "Mathematical text display issues in RTL languages"
    ]
  },
  {
    version: "3.0.0-beta.1",
    date: "2025-05-03",
    added: [
      "Support for Grok.com website"
    ],
    changed: [
      "Updated extension with WXT framework for better performance and maintainability"
    ],
    fixed: [
      "Text alignment issues on Claude.ai website"
    ]
  },
  {
    version: "2.0.1",
    date: "2025-04-20",
    fixed: [
      "Element alignment improvements and bug fixes on Claude.ai website"
    ]
  },
  {
    version: "2.0.0",
    date: "2025-04-11",
    added: [
      "Full support for Claude.ai website",
      "Error toast functionality with badge updates and styling adjustments"
    ],
    fixed: [
      "Timeout handling and error messaging for form element retrieval in text alignment feature",
      "Popup opening after setting error toast message in service worker"
    ]
  },
  {
    version: "1.2.1",
    date: "2025-03-26",
    fixed: [
      "Updated selectors to display alignment button according to new site style"
    ]
  },
  {
    version: "1.2.0",
    date: "2025-03-23",
    added: [
      "Automatic alignment after cutting or pasting text",
      "Support for deleting all text at once"
    ],
    changed: [
      "Disabled automatic popup window opening on every extension update"
    ],
    fixed: [
      "Text alignment changing while typing after clicking \"Text Alignment\" button"
    ]
  },
  {
    version: "1.1.1",
    date: "2025-03-20",
    added: [
      "User preference saving for repeated use"
    ],
    changed: [
      "Display what's new alert in popup instead of new tab when extension is updated"
    ],
    fixed: [
      "Inactive links on popup page"
    ]
  },
  {
    version: "1.1.0",
    date: "2025-03-14",
    added: [
      "Text direction alignment based on first letter in conversation",
      "User preference saving for repeated use",
      "Extension installation and update pages",
      "Vite support"
    ],
    changed: [
      "Dynamic extension version display in popup",
      "TypeScript support implementation"
    ]
  },
  {
    version: "1.0.1", 
    date: "2025-03-08",
    changed: [
      "Separated feature functions into separate content pages"
    ],
    fixed: [
      "Multiple \"Text Alignment\" buttons appearing on main chat page",
      "Updated feedback link in popup to correct extension URL"
    ],
    removed: [
      "Urdu translation (Chrome Web Store does not support this language)"
    ]
  },
  {
    version: "1.0.0",
    date: "2025-03-06",
    added: [
      "Text alignment button functionality",
      "Mathematical text display from left to right in RTL languages",
      "Arabic translation",
      "Persian translation", 
      "Hebrew translation"
    ]
  }
];

export function getCurrentVersionChanges(currentVersion?: string): ChangelogEntry | null {
  if (!currentVersion) {
    currentVersion = "3.0.0"; // fallback version
  }
  return changelog.find(entry => entry.version === currentVersion) || null;
}

export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
