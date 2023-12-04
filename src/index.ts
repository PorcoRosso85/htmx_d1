import { todoHonoApp } from "./todo";
import { Hono } from "hono";

const app = new Hono()

app.route('/', todoHonoApp.app)

export default app