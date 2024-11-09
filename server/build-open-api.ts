import { repo, withRemult } from "remult";
import type { RemultServer } from "remult/server";

export async function buildOpenApiDoc(
  api: Pick<RemultServer<any>, "openApiDoc">,
  entities: any[]
): Promise<any> {
  return withRemult(() => {
    const apiDoc = api.openApiDoc({ title: "remult-react-todo" });
    for (const e of entities) {
      const meta = repo(e).metadata;
      const entitySchema = apiDoc.components.schemas[meta.key];
      for (const field of meta.fields) {
        if (field.options.openApi) {
          entitySchema.properties[field.key] = {
            ...entitySchema.properties[field.key],
            ...field.options.openApi,
          };
        }
      }
    }
    return apiDoc;
  });
}

// adding the `openApi` field option, based on: https://remult.dev/docs/custom-options#enhancing-field-and-entity-definitions-with-custom-options
declare module "remult" {
  interface FieldOptions<entityType, valueType> {
    openApi?: {
      example?: string;
    };
  }
}
