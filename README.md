This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## JSON Server Setup

JSON data is stored in the `./db.json` file and accessed using `json-server`.

To run the JSON Server:

```bash
npm run json-serve
```

The application runs on port **4000**.

## Environment Variables

Create a `.env.local` file and set the following environment variables:

```ini
JSON_SERVER_BASE_URL="http://localhost:4000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```
