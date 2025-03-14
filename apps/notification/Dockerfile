# syntax=docker/dockerfile:1.14

ARG NODE_VERSION=23.6.0

FROM node:${NODE_VERSION}-alpine AS alpine

FROM alpine AS base

ENV PROJECT=notification
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app
WORKDIR /app

RUN npm --global install corepack@latest
RUN corepack enable
RUN corepack install

FROM base AS builder

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec turbo run build --filter="${PROJECT}"

FROM builder AS pruned

RUN pnpm --filter="${PROJECT}" --prod deploy pruned
WORKDIR /app/pruned

FROM alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=pruned /app/pruned .

CMD ["npm", "start"]
