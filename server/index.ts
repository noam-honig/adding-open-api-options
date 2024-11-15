import express from "express";
import { remultExpress } from "remult/remult-express";
import swaggerUi from "swagger-ui-express";
import { Task } from "../shared/task.js";
import { buildOpenApiDoc } from "./build-open-api.js";
const app = express();
const entities = [Task];
const api = remultExpress({
  entities,
});
app.use(api);

const openApiDocument = await buildOpenApiDoc(api, entities);

app.get("/api/openApi.json", (req, res) => {
  res.json(openApiDocument);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

app.listen(3002, () => console.log("server started"));
