# Darukaa.Earth

(placeholder — full architecture, schema, setup instructions, and CI/CD 
explanation will be written in Phase 5)

## Local Development Setup

We recommend using the unified dev script to start both the FastAPI backend and the Vite frontend simultaneously. From the repository root, simply run:

```bash
npm run dev
```

*Note: This command uses the virtual environment at `.venv/Scripts/python` (Windows). If you are on Mac/Linux, you may need to adjust the `dev:api` script in `package.json` to use `.venv/bin/python` instead.*

If you need to run them separately:
- **Backend**: `cd api && uvicorn main:app --reload --port 8000`
- **Frontend**: `cd web && npm run dev`
