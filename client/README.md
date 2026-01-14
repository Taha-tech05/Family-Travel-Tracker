# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Standalone Mode (Client-Only)

This application can run in a standalone "Client-Only" mode without requiring the Node.js backend or PostgreSQL database. This is useful for demos or simpler deployments.

### How to Enable
1.  Open the `client` directory.
2.  Edit or create a `.env` file (see `.env.example`).
3.  Set `VITE_USE_LOCAL_STORAGE=true`.

In this mode, data is persisted in the browser's `localStorage` and will survive page reloads (but not clearing browser data).

### How to Switch to Backend Mode
To revert to using the full backend + database:
1.  Set `VITE_USE_LOCAL_STORAGE=false` in `.env`.
2.  Ensure your Node.js backend and PostgreSQL database are running.
