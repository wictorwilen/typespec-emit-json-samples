import { createTypeSpecLibrary, JSONSchemaType } from "@typespec/compiler";

export interface Options {
    "namespace": string;
    "models": string[];
    "outDir": string;
}

export const $lib = createTypeSpecLibrary({
    name: "typespec-emit-json-samples",
    diagnostics: {
        // Add diagnostics here.
    },
    state: {
        // Add state keys here for decorators.
    },
    emitter: {
        options: {
            type: "object",
            additionalProperties: false,
            properties: {
                "namespace": { type: "string" },
                "models": { type: "array", items: { type: "string" } },
                "outDir": { type: "string", format: "absolute-path" }
            },
            required: ["namespace", "models"]
        } as JSONSchemaType<Options>
    }
});