# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-beta.1] - Unreleased

### Added

- Added support for the grok.com website.

### Changed

- Updated the extension with the wxt framework for better performance and maintainability.

### Fixed

- Fixed a bug where the text alignment sometimes did not work correctly on the claude.ai website.

## [2.0.1] - 2025-04-20

### Fixed

- Improvements and bug fixes in element alignment on the claude.ai website

## [2.0.0] - 2025-04-11

### Added

- Added full support for the claude.ai website.
- Implement error toast functionality with badge updates and styling adjustments.

### Fixed

- Add timeout handling and error messaging for form element retrieval in text alignment feature.
- Ensure popup opens after setting error toast message in service worker

## [1.2.1] - 2025-03-26

### Fixed

- Fix: Changing selectors to display an align button according to the new style on the site

## [1.2.0] - 2025-03-23

### Added

- Feature: Automatic alignment even after cutting or pasting text, as well as support for deleting all text at once.

### Fixed

- Fixed a situation where typing text changes alignment even after clicking the "Text Alignment" button to the opposite direction.

### Changed

- Disable automatic pop-up window opening on every extension update.

## [1.1.1] - 2025-03-20

### Added

- Feature: Saving a user preference for repeated use.

### Fixed

- Fixing inactive links on the Popup page.

### Changed

- Display alert of what's new in the popup when extension is updated instead of a new tab.

## [1.1.0] - 2025-03-14

### Added

- Feature 1: Align text direction in chat box to first letter in conversation.
- Feature 2: Saving a user preference for repeated use.
- Adding pages for extension installations and updates.
- Installing and using vite.

### Changed

- Dynamically display extension version in popup.
- Implement ts support.

## [1.0.1] - 2025-03-08

### Changed

- Separating the 2 feature functions on a content page into 2 separate content pages: contentA, contentB.

### Fixed

- Displaying multiple "Text Alignment" buttons when landing on the main chat page.
- Update feedback link in popup.js to correct extension URL.

### Removed

- Urdu translation. Chrome extensions web store does not support this language.

## [1.0.0] - 2025-03-06

### Added

- Feature 1: Text alignment button.
- Feature 2: Align and display mathematical text from left to right even in RTL languages.
- Arabic translation.
- Persian translation.
- Hebrew translation.
