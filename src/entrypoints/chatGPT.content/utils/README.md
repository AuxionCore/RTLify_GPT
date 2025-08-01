# ChatGPT Content Script Utils

This directory contains modular utility functions for the ChatGPT text alignment feature, refactored for better maintainability and organization.

## File Structure

### Core Files
- **textAlignmentButtonRefactored.ts** - Main entry point that orchestrates all functionality

### Utils Directory

#### DOM Management
- **domHelpers.ts** - DOM query utilities and interface definitions
  - Form element detection
  - Textarea finding logic  
  - Menu container detection
  - Error handling utilities

#### Text Direction
- **textDirection.ts** - Text direction detection and alignment logic
  - RTL text detection (Hebrew, Arabic, Persian)
  - Alignment application functions
  - Auto-detection logic

#### Button Management  
- **alignmentButton.ts** - Button creation and interaction logic
  - Button creation and styling
  - Click event handling
  - State management
  - Icon SVG definitions

#### Auto-Detection
- **autoDetection.ts** - Input monitoring and auto-alignment
  - Event listener setup
  - Input handler creation
  - Monitoring interval management

#### DOM Observation
- **domObserver.ts** - DOM change monitoring
  - MutationObserver setup
  - Change detection logic
  - Re-initialization triggers

## Architecture Benefits

1. **Separation of Concerns** - Each file has a single responsibility
2. **Reusability** - Functions can be easily imported and reused
3. **Testability** - Smaller, focused functions are easier to test
4. **Maintainability** - Changes to specific functionality are isolated
5. **Readability** - Code is organized by purpose, not execution order

## Usage

The main function `displayAlignmentButton()` in `textAlignmentButtonRefactored.ts` imports and orchestrates all the utilities:

```typescript
import { getFormElements, findTextarea } from './utils/domHelpers';
import { applyRTLAlignment, applyLTRAlignment } from './utils/textDirection';
import { updateButtonState } from './utils/alignmentButton';
// ... etc
```

## State Management

State is managed through a shared object pattern:
```typescript
const alignState = { current: "left" as "left" | "right" };
```

This allows all utilities to share and modify the same state instance.

## Future Improvements

- Add unit tests for individual utility functions
- Implement error boundaries for better error handling
- Add performance monitoring for DOM operations
- Consider using a more sophisticated state management pattern if complexity grows
