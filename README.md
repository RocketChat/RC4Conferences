# RC4Conferences

RC4Conferences now has two production pieces:

- `app/`: a statically exported Next.js frontend for public event pages
- `event-server/`: an Express + MongoDB API for events, CMS-like content, and low-volume assets via GridFS

The legacy Strapi CMS and `open-event-server` flow are being removed. The production model is now:

1. Manage content in MongoDB through `event-server`
2. Build the frontend as static files
3. Publish `app/out/` to your static host

## Architecture

Public endpoints:

- `GET /v1/events`
- `GET /v1/events/:idOrIdentifier`
- `GET /v1/speakers/event/:idOrIdentifier`
- `GET /v1/sessions/event/:idOrIdentifier`
- `GET /v1/cms/*`
- `GET /v1/files/:filename`

Protected endpoints:

- `POST|PUT|DELETE /v1/events`
- `POST|PUT|DELETE /v1/speakers`
- `POST|PUT|DELETE /v1/sessions`
- `POST /v1/cms/*`
- `POST /v1/files`

Protected writes require `x-api-key: $API_KEY_SECRET`.

## Local setup

### Event server

```bash
cd event-server
cp .env.example .env
npm install
npm run build
npm run dev
```

Required env:

- `MONGODB_URI`
- `API_KEY_SECRET`
- `CORS_ORIGIN`

### Seed content

```bash
cd event-server
npm run seed
```

### Frontend

```bash
cd app
cp .env.example .env.local
npm install
npm run build:static
```

Static output is written to `app/out/`.

Required frontend env:

- `NEXT_PUBLIC_EVENT_SERVER_URL`
- `NEXT_PUBLIC_BASE_PATH` if deploying under a subpath
- `NEXT_PUBLIC_SERVER_STREAM_LINK0` and `NEXT_PUBLIC_SERVER_STREAM_LINK1` if you use the mainstage livestream page

## Production notes

- The frontend is static-only by design.
- Legacy in-browser creation, editing, and greenroom auth are no longer part of the production frontend.
- MongoDB GridFS is suitable for speaker images and other low-volume assets.
- If asset volume grows, move file storage behind Cloudinary or object storage and keep the frontend pointing at those URLs.

## Deploy flow

1. Deploy `event-server` behind HTTPS.
2. Set `NEXT_PUBLIC_EVENT_SERVER_URL` to that API origin.
3. Run `npm run build:static` in `app/`.
4. Publish `app/out/` to your CDN or static host.
