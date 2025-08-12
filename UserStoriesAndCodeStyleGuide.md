# User Stories

## 1. User Registration and Authentication
- As a new user, I want to sign up with my details so that I can access the platform.
- As a returning user, I want to log in securely so that I can access my account.
- As a user, I want to log out to keep my account secure.

## 2. Contact Management
- As a user, I want to create, view, update, and delete contacts so that I can manage my network.
- As a user, I want to group contacts for better organization.

## 3. Organisation Management
- As a user, I want to create, view, update, and delete organisations so that I can manage company-related contacts.

## 4. Real-Time Updates
- As a user, I want to see real-time updates when contacts or organisations are changed by others.

## 5. Responsive UI
- As a user, I want the interface to be responsive and easy to use on any device.

## 6. Error Handling
- As a user, I want clear error messages when something goes wrong.

## 7. Secure Data
- As a user, I want my data to be stored securely and only accessible to authorized users.

## 8. Search and Filter
- As a user, I want to search and filter contacts and organisations easily.

---

# Code Style Guide

## General
- Use TypeScript for type safety in both frontend and backend.
- Use ES6+ syntax (arrow functions, destructuring, etc.).
- Prefer functional components and hooks in React.
- Use async/await for asynchronous operations.
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for components/classes).
- Use Prettier and ESLint for code formatting and linting.

## Frontend
- Organize code by feature (components, contexts, hooks, pages).
- Use Tailwind CSS for styling.
- Keep components small and focused.
- Use context for global state management.
- Use custom hooks for reusable logic.

## Backend
- Organize code by domain (controllers, services, repositories, entities).
- Use middleware for authentication and error handling.
- Validate inputs using Zod schemas.
- Use Mongoose for MongoDB data access.
- Keep controllers thin; put business logic in services.

## Testing
- Write unit and integration tests for critical logic.
- Place tests in the `tests/` directory.

## Documentation
- Use JSDoc for documenting functions and classes.
- Keep README up to date with setup and usage instructions.

---

## Example Naming Conventions
- Components: `ContactForm.tsx`, `OrganisationCard.tsx`
- Contexts: `UserContext.tsx`, `ContactsContext.tsx`
- Services: `UserService.ts`, `ContactService.ts`
- Repositories: `UserRepository.ts`, `ContactsRepository.ts`
