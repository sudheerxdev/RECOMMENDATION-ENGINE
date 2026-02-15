# Debugging Notes

## 1. MongoDB `ENOTFOUND` / `querySrv` Errors

Symptom:

- `querySrv ENOTFOUND _mongodb._tcp.<host>`

Cause:

- Invalid `MONGODB_URI` host or placeholder URI.

Fix:

1. Open `backend/.env`.
2. Set a real Atlas URI from MongoDB Atlas "Connect > Drivers".
3. Ensure username/password are URL-safe.
4. Ensure Atlas Network Access includes your IP.

## 2. JWT Secret Validation Failure

Symptom:

- `JWT_SECRET must be at least 24 characters`

Fix:

- Set a strong secret in `backend/.env`.

Example:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Google Sign-In Fails (`503` configured error)

Symptom:

- `/api/auth/google` returns `Google sign-in is not configured on the backend`

Fix:

- Set `GOOGLE_CLIENT_ID` in `backend/.env`.

## 4. Google Sign-In Popup Works but Backend Rejects Token (`401`)

Possible causes:

- `GOOGLE_CLIENT_ID` mismatch between backend and frontend OAuth app.
- Wrong `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local`.

Fix:

1. Verify OAuth client ID in Google Cloud Console.
2. Ensure backend `GOOGLE_CLIENT_ID` matches frontend `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
3. Restart backend after env changes.

## 5. CORS Errors

Fix:

- Set `FRONTEND_URL` and optional `FRONTEND_URLS` in `backend/.env`.
- Include deployed frontend domain(s).

## 6. Resume Upload Works but URL Is Null

Cause:

- Cloudinary credentials missing or invalid.

Fix:

- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## 7. Recommendation Endpoint Returns Empty Dataset Error

Symptom:

- `Career dataset is empty. Seed career paths before requesting recommendations.`

Fix:

```bash
npm run seed
```

## 8. Build/Install Fails with Disk Space Errors (`ENOSPC`)

Fix:

1. Free several GB of disk space.
2. Remove partially installed modules:
   - `node_modules`
   - `frontend/node_modules`
   - `backend/node_modules`
3. Re-run `npm install`.
