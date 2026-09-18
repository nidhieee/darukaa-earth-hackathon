# CI/CD and Developer Experience

## Pre-commit Hooks

We implemented unified pre-commit checks at the repository root to cover both frontend and backend automatically:

1. **Husky & lint-staged (Frontend)**:
   - Husky (`v9.1.7`) is configured at the repo root.
   - The `.husky/pre-commit` hook runs `lint-staged` targeting `src/**/*.{js,jsx,css}` inside the `web/` directory.
   - `lint-staged` auto-formats with Prettier and checks for errors using ESLint.

2. **Python pre-commit (Backend)**:
   - Python's `pre-commit` framework (`v4.6.2`) is installed.
   - The `.pre-commit-config.yaml` file configures `black` (`v24.10.0`) and `flake8` (`v7.1.1`) targeting the `^api/` directory.
   - The `.husky/pre-commit` script cascades into running `.venv/Scripts/pre-commit run`, seamlessly combining both sets of checks into a single Git hook.
   
## GitHub Actions CI

Automated checks run on `push` and `pull_request` via `.github/workflows/ci.yml`.

- **Frontend CI**: Uses Node 20 (`actions/setup-node@v4`), installs dependencies in `web/`, and runs `npm run build` to verify production compilation.
- **Backend CI**: Uses Python 3.11 (`actions/setup-python@v5`), installs `api/requirements.txt`, and runs `flake8 . --max-line-length=100` to enforce code quality.

## Local Development Command

A unified local dev experience has been set up at the root of the repository.

- `concurrently` is installed as a dev dependency.
- Running `npm run dev` at the repo root spawns both the FastAPI backend and the Vite frontend simultaneously.
- Output is color-coded (blue for API, green for WEB) for excellent developer visibility.
