# RC4Conferences
A set of scalable components for communities to build, manage, and run virtual conferences of any size.

To get set launch:
1. Move to project directory and install packages. 
```
cd rc4conf && npm i
```
2. To start the library in watch mode, run
```
npm start
```
3. Now go to `RC4Community` or any other local repository and link the package using 
```
npm link ../path/to/RC4Conferences/rc4conf
```
4. Import the sample `EventButton` Component as shown below on any page.
```
import Head from "next/head";
import { EventButton } from "rc4conf";
import { Stack } from "react-bootstrap";
import { getStrapiURL } from "../../lib/api";

function Home() {
  return (
    <div>
      <Head>
        <title>Form</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Stack className="mx-auto">
        <h1 className="mx-auto mt-3">Preview of Event Component</h1>
        <EventButton bg={"yellow"} margin="auto" strapiFunc={getStrapiURL} strapiCollName={"discourses"} />
      </Stack>
    </div>
  );
}

export default Home;


```
5. Component library launched successfully!
