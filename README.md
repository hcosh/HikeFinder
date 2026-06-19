# HikeFinder

## Running Locally

The web app lives in [app](app) and uses Vite.

```bash
cd app
npm ci
npm run dev
```

## Docker And Fly.io

This project now ships as a Docker container for Fly.io.

What that means:
- The app is built into static files during the Docker image build.
- Those files are served by `nginx` inside a small production container.
- Fly.io runs that container directly instead of running the Vite dev server.

Files involved:
- [Dockerfile](Dockerfile): multi-stage build that compiles the app and produces a lean runtime image.
- [docker/nginx.conf](docker/nginx.conf): serves the built app on port `8080` and falls back to `index.html` for SPA routes.
- [.dockerignore](.dockerignore): keeps the image context small for faster builds.

Build the image locally:

```bash
docker build -t hikefinder .
```

Run the container locally:

```bash
docker run --rm -p 8080:8080 hikefinder
```

Deploy with Fly.io:

```bash
fly deploy
```

Notes for Fly free tier:
- This is a static frontend served by `nginx`, so memory and CPU needs are modest.
- The container listens on port `8080`; make sure your Fly app is configured with that internal port.