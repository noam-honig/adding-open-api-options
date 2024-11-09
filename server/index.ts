import express from "express";
import { remultExpress } from "remult/remult-express";
import swaggerUi from "swagger-ui-express";
import { Task } from "../shared/task.js";
import fs from "fs";
import { buildOpenApiDoc } from "./build-open-api.js";
const app = express();
const entities = [Task];
const api = remultExpress({
  entities,
});
app.use(api);

const openApiDocument = await buildOpenApiDoc(api, entities);
fs.writeFileSync("tmp/openApi.json", JSON.stringify(openApiDocument, null, 2));
app.get("/api/openApi.json", (req, res) => {
  res.json(openApiDocument);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(3002, () => console.log("server started"));
