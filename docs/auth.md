# Authentication

- Auth is handled via custom JWTs.
- `api/` issues and verifies tokens using PyJWT/python-jose + passlib.
- Passwords are hashed and stored in the database.
- The React app in `web/` sends the JWT in the Authorization header.
