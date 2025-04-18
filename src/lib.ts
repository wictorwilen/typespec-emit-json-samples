import { createTypeSpecLibrary, JSONSchemaType } from "@typespec/compiler";

export interface Options {
    "namespace": string | string[];
    "models": string[] | string;
    "outDir": string;
    "setUndefinedToNull": boolean,
    "fillArrays": boolean,
    "arraySize": number,
    "randomize": boolean
}

export const $lib = createTypeSpecLibrary({
    name: "@wictorwilen/typespec-emit-json-samples",
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
                "namespace": { type: ["string", "array"], items: { type: "string" } },
                "models":  { type: ["string", "array"], items: { type: "string" } },
                "outDir": { type: "string", format: "absolute-path" },
                "setUndefinedToNull": { type: "boolean", default: true },
                "fillArrays": { type: "boolean", default: false },
                "arraySize": { type: "number", default: 1 },
                "randomize": { type: "boolean", default: false }
            },
            required: ["namespace", "models"]
        } as JSONSchemaType<Options>
    }
});