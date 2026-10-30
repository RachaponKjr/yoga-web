# Yoka local development

## Production API configuration

The production frontend receives `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_HOST_IMAGE`
as Docker build arguments from the root `.env` (the deployment workflow creates it
from the `DOT_ENV` GitHub secret). They default to the HTTPS production API.
Next.js embeds these public values during build; changing only the container's
runtime environment or restarting it does not update the browser bundle.

After changing these values or pulling this fix, rebuild and recreate the frontend:

```sh
docker compose up -d --build --no-deps frontend
```

## Run everything in Docker

Start Docker Desktop, then run from the repository root:

```sh
docker compose -p yoka-local -f compose.local.yml up -d --build --wait
```

Or run `npm run docker:up`. This runs the web, admin, API and PostgreSQL in containers. Local Node.js is only needed for the npm shortcuts. The existing `yoka-api/.env` and `yoka-web/.env` supply integration credentials at runtime; they are not copied into the images. Local database and API URLs override their existing values. Next.js server requests use the Docker service address; browser requests use localhost.

- Website: http://localhost:3200
- Admin: http://localhost:3202
- API: http://localhost:3201/api/v1/health

Use `npm run docker:logs` to see logs and `npm run docker:down` to stop the stack. Database records and uploads persist in Docker volumes. Re-run `npm run docker:up` after source changes to rebuild the images. Docker publishes website/API/admin on host ports 3200/3201/3202 to avoid the existing services on 3001/3002/3100/3101/3102/8090. PostgreSQL remains on host port 55432.

## Run application servers on the host

Requires Node.js 22 and Docker Desktop (running).

From the repository root, install dependencies on first use:

```sh
npm run local:setup
```

Start the local database, API, website and admin together:

```sh
npm run dev
```

- Website: http://localhost:3100
- Admin: http://localhost:5173
- API health: http://localhost:3101/api/v1/health
- PostgreSQL: `127.0.0.1:55432`, database `yoka_local`, user `yoka`, password `yoka_local`

The launcher overrides the API and database addresses without changing existing `.env` files. The database uses a separate Docker volume and starts empty. It applies the current Prisma schema with `db push` because the historical migration is incomplete. It never resets data; review any schema warnings before proceeding.

Ctrl+C stops the application servers. `npm run local:db:stop` stops PostgreSQL while preserving its data. Ports 3100 and 3101 and the `.next-local` build directory keep this stack separate from existing servers on 3000/3001.

Payment and email integrations still use the existing per-app `.env` credentials. Use test credentials when testing those features. This setup does not create accounts or sample courses.
