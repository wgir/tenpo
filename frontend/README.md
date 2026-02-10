# Tenpo Personnel Services - Frontend

A modern, high-performance web application built with React 19, Vite, and Tailwind CSS 4 for managing personnel services, clients, and transactions.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **State Management**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) & [MSW](https://mswjs.io/)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory (or use environment variables):

```env
VITE_API_URL=http://localhost:8080/api
```

### Running the Application

#### Development Mode
Runs the app in development mode with HMR.
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

#### Production Build
Builds the app for production to the `dist` folder.
```bash
npm run build
```

#### Preview Production Build
Locally preview the production build.
```bash
npm run preview
```

### Running Tests
We use Vitest and React Testing Library for unit and integration testing.

#### Run all tests (Watch Mode)
```bash
npm test
```

#### Run tests once
```bash
npm run test -- --run
```

## 🐳 Docker Support

To build and run the application using Docker:

### Build the Image
```bash
docker build -t tenpo-frontend .
```

### Run the Container
```bash
docker run -p 5173:80 tenpo-frontend
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

- `src/api`: Centralized API configuration and Axios instance.
- `src/components/ui`: Reusable, atomic UI components (Button, Input, Modal, etc.).
- `src/features`: Feature-sliced modules (Tenpistas, Transactions) containing:
  - `api`: Module-specific service calls.
  - `components`: Feature-specific UI components.
  - `hooks`: Custom React Query hooks.
  - `schemas`: Zod validation schemas.
  - `types`: TypeScript interfaces.
- `src/layouts`: Main application shell and high-level layouts.
- `src/pages`: Top-level page components.
- `src/utils`: Common utility functions (formatting, date helpers).

## 📄 License

This project is proprietary for Tenpo Personnel Services.
