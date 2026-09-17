# CI/CD

- Automated with GitHub Actions in `.github/workflows/`.
- **Frontend CI:** Checks `web/` using jobs specific to that directory.
- **Backend CI:** Checks `api/` using jobs specific to that directory.
- Husky is configured in `web/`.
- pre-commit config targets `api/`.
