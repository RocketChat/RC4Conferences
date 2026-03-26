# Frontend App

This Next.js app builds a static public site from the Mongo-backed
`event-server`.

## Environment

Copy [`.env.example`](/Users/deva/Developer/ospr/RC4Conferences/app/.env.example) to `.env.local` and set:

- `NEXT_PUBLIC_EVENT_SERVER_URL`
- `NEXT_PUBLIC_BASE_PATH` if the site is deployed under a subpath
- stream variables if you use the public mainstage page

## Commands

```bash
npm install
npm run dev
npm run build:static
```

`npm run build:static` produces the exportable site in `out/`.
