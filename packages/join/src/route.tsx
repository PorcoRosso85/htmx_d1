import { Hono } from "hono";

const endpoint = "/join"

const endpoints = {
    root: ['/', ""]
}

const app = new Hono().basePath(endpoint)

app
.get(endpoints.root[0], (c) => c.html(<>join</>))

export const joinHonoApp = {
    endpoint: endpoint,
    app: app
}