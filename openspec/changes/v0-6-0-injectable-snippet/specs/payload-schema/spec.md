## MODIFIED Requirements

### Requirement: Capture modules are React-free
The capture modules (`src/capture/target.ts`, `src/capture/meta.ts`) SHALL have no direct or transitive imports of React or React DOM, ensuring they can be bundled into the standalone IIFE without pulling in framework dependencies.

#### Scenario: Import tree verification
- **WHEN** `src/capture/target.ts` and `src/capture/meta.ts` are analyzed for imports
- **THEN** neither module imports from `react`, `react-dom`, or any module in `src/react/`

#### Scenario: IIFE bundle contains no React
- **WHEN** `dist/feedtack.inject.js` is built and its contents are searched
- **THEN** no references to `react`, `React`, `createElement`, or `jsx` are found in the output
