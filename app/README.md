# ReactJS Fully Componentized App

This community system is a web app dynaically generated and packaged by NextJS during build time, by combinaing structure and data from a headless CMS - strapi.

The app is 100% composed of ReactJS components.  See the `components` directory for the set of ReactJS components used, and see the `styles` directory for the CSS module associated with each of the components.

<details>
<summary>
Fauna Superprofile Setup
</summary>

1. For setting up the local development copy of Fauna, first run the below command to start the Fauna Docker image as a single developer node, with ephemeral data.
```
docker run --rm --name faunadb -p 8443:8443 -p 8084:8084 fauna/faunadb
```

2. In the `/cms` directory, install the npm modules and add the required environment variables. The DB_PORT would be `8443`, and DB_DOMAIN `localhost`
```
npm i
cp .env.example .env
```

3. Start the server with environment `INITIALIZE_DATA`
```
INITIALIZE_DATA=true npm run develop
```

</details>
<hr />

The application is written for nextjs and deployable on all nextjs compatible CDN + microservices and scaled deployment platforms. For build and design, start it in a shell:
```
npm i
npm run dev
```
You can use the environment variable `NEXT_PUBLIC_STRAPI_API_URL` to override the location of strapi cms, if it is not running on the same host.

```
NEXT_PUBLIC_STRAPI_API_URL=http://127.0.0.1:1337  npm run dev
```
Now RC4Community should be accessible from http://localhost:3000
