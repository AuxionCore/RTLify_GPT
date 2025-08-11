# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-08-11

### Added
- Modern icon design

### Fixed
- Text alignment button not appearing on ChatGPT website
- Text alignment button sometimes not appearing on Claude.ai website
- Mathematical text display issues in RTL languages

## [3.0.0-beta.1] - 2025-05-03

### Added
- Support for Grok.com website

### Changed
- Updated extension with WXT framework for better performance and maintainability

### Fixed
- Text alignment issues on Claude.ai website

## [2.0.1] - 2025-04-20

### Fixed
- Element alignment improvements and bug fixes on Claude.ai website

## [2.0.0] - 2025-04-11

### Added
- Full support for Claude.ai website
- Error toast functionality with badge updates and styling adjustments

### Fixed
- Timeout handling and error messaging for form element retrieval in text alignment feature
- Popup opening after setting error toast message in service worker

## [1.2.1] - 2025-03-26

### Fixed
- Updated selectors to display alignment button according to new site style

## [1.2.0] - 2025-03-23

### Added
- Automatic alignment after cutting or pasting text
- Support for deleting all text at once

### Changed
- Disabled automatic popup window opening on every extension update

### Fixed
- Text alignment changing while typing after clicking "Text Alignment" button

## [1.1.1] - 2025-03-20

### Added
- User preference saving for repeated use

### Changed
- Display what's new alert in popup instead of new tab when extension is updated

### Fixed
- Inactive links on popup page

## [1.1.0] - 2025-03-14

### Added
- Text direction alignment based on first letter in conversation
- User preference saving for repeated use
- Extension installation and update pages
- Vite support

### Changed
- Dynamic extension version display in popup
- TypeScript support implementation

## [1.0.1] - 2025-03-08

### Changed
- Separated feature functions into separate content pages

### Fixed
- Multiple "Text Alignment" buttons appearing on main chat page
- Updated feedback link in popup to correct extension URL

### Removed
- Urdu translation (Chrome Web Store does not support this language)

## [1.0.0] - 2025-03-06

### Added
- Text alignment button functionality
- Mathematical text display from left to right in RTL languages
- Arabic translation
- Persian translation
- Hebrew translation
