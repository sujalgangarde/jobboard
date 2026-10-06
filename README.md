# JobBoard

## Run locally
Backend:  cd backend && mvn spring-boot:run
Frontend: cd frontend && npm install && npm run dev
Local MySQL: user root, password set in DB_PASSWORD env var or application.properties.
Admin login (local): admin / admin123

## Deploy (summary)
1. Push to a PRIVATE GitHub repo (do not commit .env files).
2. Database: Aiven free MySQL -> copy host, port, user, password.
3. Backend: Render > New Web Service > connect repo > Root Directory: backend > Runtime: Docker.
   Add env vars from backend/.env.example. Custom domain: api.yourdomain.me
4. Frontend: Cloudflare Pages > connect repo > Root: frontend > Build: npm run build > Output: dist
   Env var: VITE_API_URL=https://api.yourdomain.me  (and NODE_VERSION=20)
   Custom domain: yourdomain.me
5. Cloudflare > SSL/TLS > set mode "Full (strict)" and turn on "Always Use HTTPS".
