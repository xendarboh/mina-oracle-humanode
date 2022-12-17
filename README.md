# Humanode <•> Mina zkOracle

This project originated as a hackathon submission for Mina zkIgnite Cohort 0.

The info here is specific to this oracle as a component within a larger
project. See
[xendarboh/mina-zkignite-cohort0](https://github.com/xendarboh/mina-zkignite-cohort0)
for details.

## What's under the hood

- [Remix](https://remix.run)!
- [o1-labs/snarkyjs](https://github.com/o1-labs/snarkyjs) Typescript/Javascript framework for zk-SNARKs and zkApps
- Sybil-resistant proof of unique living Human with [HUMΔNODE](https://humanode.io/)
- Authenticated session management with [Remix Auth](https://github.com/sergiodxa/remix-auth)
- Styling with [Tailwind](https://tailwindcss.com/)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

Note: The example `AUTH_HUMANODE` configuration values will work for local
development. For production deployment, a custom OAuth2 client-id is needed
from the Humanode team.

- Copy `env` config file from the example and customize:

  ```sh
  cp .env.example .env
  ```

- Start dev server:

  ```sh
  npm install
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes. See the console log for the `localhost` URL to find the app.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to. Learn more about [Remix Deployment](https://remix.run/docs/en/v1/guides/deployment).

### Docker

#### Optional Reverse Proxy with SSL

For automated SSL certificate generation, start
[nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) and
[acme-companion](https://github.com/nginx-proxy/acme-companion) with:

```sh
docker compose --profile proxy up -d
```

#### Deploy Oracle for Production

```sh
docker compose --profile production up -d
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

## Testing

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
