
# User Stories

## 1. User Registration and Authentication
- As a new user, I want to sign up and verify my account so I can access the platform securely.
- As a returning user, I want to log in and out securely to protect my data.
- As a user, I want to reset my password if I forget it.

## 2. Contact Management
- As a user, I want to create, view, update, and delete contacts to manage my network.
- As a user, I want to group contacts and manage contact groups for better organization.
- As a user, I want to import/export contacts (CSV, Excel) for flexibility.
- As a user, I want to search and filter contacts easily.
- As a user, I want to see real-time updates when contacts are changed by others.
- As a user, I want to lock a contact while editing to prevent conflicts.

## 3. Organisation Management
- As a user, I want to create, view, update, and delete organisations.
- As a user, I want to manage organisation members (invite/remove).
- As an admin, I want to control permissions for organisation members.

## 4. Real-Time Collaboration
- As a user, I want to see who else is editing a contact or organisation in real time.
- As a user, I want to receive notifications for changes made by others.

## 5. Offline and PWA Support
- As a user, I want to use the app offline and have my changes sync when I reconnect.
- As a user, I want to install the app as a PWA for a native-like experience.

## 6. Responsive and Accessible UI
- As a user, I want the interface to be responsive and accessible on any device.
- As a user, I want clear error messages and helpful feedback.

## 7. Secure Data and Privacy
- As a user, I want my data to be stored securely and only accessible to authorized users.
- As an admin, I want audit logs for critical actions.

## 8. Analytics and Dashboard
- As a user, I want to see analytics and stats about my contacts and organisations.

---

# Code Style Guide

## General
- Use TypeScript for all code (frontend and backend) for type safety.
- Use ES6+ syntax (arrow functions, destructuring, etc.).
- Prefer functional components and React hooks.
- Use async/await for asynchronous operations.
- Use camelCase for variables/functions, PascalCase for components/classes, and kebab-case for files.
- Use Prettier and ESLint for formatting and linting.
- Write clear, descriptive comments and JSDoc for functions/classes.

## Frontend
- Organize code by feature (components, contexts, hooks, pages, stores, types).
- Use Tailwind CSS for styling and utility classes.
- Keep components small, focused, and reusable.
- Use React context for global state and custom hooks for shared logic.
- Use React Query for data fetching and caching.
- Use optimistic updates for a responsive UI.
- Use service workers and Dexie for offline/PWA support.
- Use modular file structure: `components/`, `hooks/`, `contexts/`, `pages/`, `feature/`, `lib/`, `stores/`, `types/`.

## Backend
- Organize code by domain: `controllers/`, `services/`, `repositories/`, `entities/`, `use cases/`, `lib/`, `validators/`.
- Use middleware for authentication, authorization, and error handling.
- Validate all inputs using Zod schemas.
- Use Mongoose for MongoDB data access and schema validation.
- Keep controllers thin; put business logic in services and use cases.
- Use async/await and handle errors with custom error classes.
- Use socket.io for real-time features and event-driven updates.

## Testing
- Write unit and integration tests for critical logic and endpoints.
- Place all tests in the `tests/` directory, mirroring the main code structure.

## Documentation
- Use JSDoc for documenting functions, classes, and complex logic.
- Keep the README up to date with setup, usage, and deployment instructions.
- Document API endpoints and data models (see `jsdoc.json`).

---

## Example Naming Conventions
- Components: `ContactForm.tsx`, `OrganisationCard.tsx`, `Dashboard.tsx`
- Contexts: `UserContext.tsx`, `ContactsContext.tsx`, `ContactsUpdateContext.tsx`
- Services: `UserService.ts`, `ContactService.ts`, `OrganisationService.ts`
- Repositories: `UserRepository.ts`, `ContactsRepository.ts`, `OrganisationsRepository.ts`
- Use Cases: `ContactUseCases.ts`, `OrganisationUseCases.ts`
