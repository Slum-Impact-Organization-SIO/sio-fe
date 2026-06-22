# SIO-FE Frontend

This repository contains the Next.js React frontend for SIO. It is configured with an automated continuous integration (CI) pipeline via GitHub Actions and pre-commit hooks, along with continuous deployment (CD) to Vercel.

## Table of Contents

- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting up Git Hooks (Pre-commit)](#setting-up-git-hooks-pre-commit)
  - [Running the Development Server](#running-the-development-server)
- [Verification and Quality Checks](#verification-and-quality-checks)
  - [Linting and Formatting](#linting-and-formatting)
- [Branching \& Contribution Rules](#branching--contribution-rules)
  - [Branch Progression Flow](#branch-progression-flow)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Project Structure

```
sio-fe/
├── .github/
│   └── workflows/
│       ├── cd.yml             # GitHub Actions CD configuration (Vercel)
│       └── ci.yml             # GitHub Actions CI configuration
├── .husky/                    # Git hooks directory (pre-commit)
├── app/                       # Next.js App Router pages and assets
├── components/                # React components (including Shadcn UI)
├── lib/                       # Helper functions and utilities (e.g. cn)
├── public/                    # Static public assets (images, icons)
├── .coderabbit.yaml           # CodeRabbit AI review configuration
├── .gitignore                 # Git ignore file for Next.js/Node
├── .prettierignore            # Prettier ignore file
├── .prettierrc                # Prettier styling configuration
├── eslint.config.mjs          # ESLint configuration
├── package.json               # Script definitions and dependency list
├── pnpm-lock.yaml             # pnpm lock file
└── tsconfig.json              # TypeScript compilation configuration
```

---

## Local Development Setup

### Prerequisites

- **Node.js**: Version 20 or higher.
- **pnpm**: Version 11.6.0 or higher. Install it globally via:
  ```bash
  npm install -g pnpm
  ```

### Installation

Clone the repository (if not already done):

```bash
git clone https://github.com/Slum-Impact-Organization-SIO/sio-fe
cd sio-fe
```

Install dependencies:

```bash
pnpm install
```

### Setting up Git Hooks (Pre-commit)

We use `husky` and `lint-staged` to automatically run code formatters and linters on modified files before each git commit.

1. The git hooks are automatically set up during `pnpm install` via the `"prepare"` script in `package.json`.
2. To test the pre-commit checks manually against staged files, run:
   ```bash
   pnpm lint-staged
   ```

Now, every time you run `git commit`, the hook defined in `.husky/pre-commit` runs automatically. If any linting or formatting checks fail, the commit is aborted so you can fix the issues.

### Running the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

Once started, the application will be available at:

- **Local Application URL:** http://localhost:3000/

---

## Verification and Quality Checks

To ensure code quality, you can run these commands locally. They align with the checks run in the CI pipeline and pre-commit hooks.

### Linting and Formatting

We use **ESLint** for code quality linting and **Prettier** for code formatting.

- **To check code style and linting issues:**
  ```bash
  pnpm run lint
  ```
- **To verify formatting:**
  ```bash
  pnpm run format:check
  ```
- **To automatically fix formatting and lint issues:**
  ```bash
  pnpm run lint:fix
  pnpm run format
  ```

---

## Branching & Contribution Rules

To maintain codebase stability, ensure all tests pass, and track history cleanly, please adhere to the following workflow and rules:

### Branch Progression Flow

All modifications must progress through our branches in the following order: `feature/*` or `bugfix/*` ➔ `dev` ➔ `staging` ➔ `main`

- **Feature/Change Branches:** Create a dedicated branch for your work (e.g., `feature/add-navbar` or `bugfix/fix-mobile-layout`).
- **Pull Requests (PRs) Required:** You must raise a separate PR for each branch transition:
  - PR from your `feature/*` or `bugfix/*` branch to `dev` (for integration testing).
  - PR from `dev` to `staging` (for staging/acceptance testing).
  - PR from `staging` to `main` (for production release).
- **No direct pushes:** Never push code directly to the `dev`, `staging`, or `main` branches. Direct pushes are disabled.
- **CI & Review Requirements:** For every PR, the CI pipeline must pass successfully, and code reviews must be approved before merging.

---

## CI/CD Pipeline

The GitHub Actions configuration files are located in `.github/workflows/`.

### 🧪 Continuous Integration (`ci.yml`)

Runs on every push or Pull Request targeting the `dev`, `staging`, or `main` branches.

**Jobs Performed:**

1. **Checkout Code:** Retrieves the repository files.
2. **Install pnpm:** Sets up pnpm version 11.6.0.
3. **Setup Node.js:** Installs Node.js v20 with pnpm caching enabled.
4. **Install Dependencies:** Installs packages strictly matching `pnpm-lock.yaml`.
5. **Lint Check:** Validates code conventions using ESLint.
6. **Format Check:** Checks code formatting using Prettier.
7. **Production Build:** Compiles the Next.js app to make sure there are no compiler/TypeScript errors.

### 🚀 Continuous Deployment (`cd.yml`)

Runs on every push to the `staging` or `main` branches.

**Jobs Performed:**

1. **Checkout Code & Setup pnpm:** Clones the repository and installs pnpm.
2. **Set Deployment Environment:** Automatically determines whether it is deploying to Vercel Staging (preview) or Production based on the target branch.
3. **Pull Vercel Environment:** Downloads environmental variables and settings from Vercel using the configured secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
4. **Build & Deploy:** Compiles the app with Vercel configuration and deploys the prebuilt outputs.
