<div align="center">

<picture>
  <source media="(prefers-color-scheme: light)" srcset="/public/wavereplay.svg">
  <img alt="wavereplay logo" src="/public/wavereplay_white.svg" width="50%" height="50%">
</picture>

wavereplay: surf video analysis

[![Build](https://github.com/jack-laverty/wavereplay/actions/workflows/test.yml/badge.svg)](https://github.com/jack-laverty/wavereplay/actions/workflows/test.yml)

<h3>

[Overview](#overview) | [Tech Stack](#tech-stack)

</h3>

</div>

---



## Overview

Learning to build a fullstack Next.js/React web app and maybe learning to surf good too.

It's a simple dashboard to view all your sessions and a standard video player with some additional playback controls, timestamped annotations, and a glassboard overlay.

This README is 10% user guide and 90% documentation to remind me how everything was implemented.



## Tech Stack

### [NextJS](https://nextjs.org/docs)

The whole show runs on the NextJS framework. It runs a later version so it uses the [App Router](https://nextjs.org/docs/app) to navigate between pages. [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) are used to access backend resources.
Authentication is implemented with [Supabase Auth](https://supabase.com/docs/guides/auth). React server components are used where possible. The majority of components are styled with tailwind CSS.

### [Supabase](https://supabase.com/)

Supabase database is used for all data except for the video files.

Supabase is a one stop shop database for this application because it comes configurable with services for authentication, storage, and realtime data. It's used to store user data for authentication, surf session information, and video metadata for all the individual clips in a session.


### [MinIO](https://github.com/minio/minio)

A MinIO server is used for video file storage because it's S3 API compatible and runs on everything. The server is a self hosted docker container.

### [Vault](https://www.hashicorp.com/products/vault)

Secrets are locked in here.

### [Supabase Auth](https://authjs.dev/getting-started/authentication/oauth)

Supabase Auth is used for authentication. GitHub provides a free OAuth service as the app is registered in the GitHub developer dashboard. Supabase provides [configuration docs](https://supabase.com/docs/guides/auth/social-login/auth-github) for this use case. Unauthenticated users are redirected to the login page via middleware.

Note there is some config external to the application that is required for this system

In GitHub OAuth app settings, ensure the `Authorization callback URL` is set to https:your-project.supabase.co/auth/v1/callback.

In Supabase, under Authentication > URL Configuration:
* Site URL should be the web apps base URL (e.g., http://localhost:3000 for local development)
* Redirect URLs should include http://localhost:3000/auth/callback for local development and your production callback URL.
