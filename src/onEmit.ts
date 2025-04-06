import { EmitContext, Model, Namespace, navigateProgram, emitFile, resolvePath, ModelProperty, Scalar, ArrayModelType, getDoc, getExamples, getProperty, ObjectValue, Value, RekeyableMap, EnumValue, EnumMember } from "@typespec/compiler";
import { Options } from "./lib.js";
import { log } from "console";

const INDENT_SIZE = 4;

const line = (indent: number, text: string): string => {
    return `${" ".repeat(indent * INDENT_SIZE)}${text}`;
}

const addLine = (lines: string[], indent: number, text: string): void => {
    lines.push(line(indent, text));
}

function getRandomItem<T>(array: readonly T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const emitValue = (context: EmitContext, property: ModelProperty, value: Value, indent: number): string => {
    let ret = "";
    switch (value.valueKind) {
        case "NullValue":
            return "null";
        case "StringValue":
        case "NumericValue":
            return `"${value.value}"`;
        case "ArrayValue":
            if (value.values.length > 0) {
                ret = "[\n";
                ret += value.values.map((v, index, arr) => {
                    return line(indent + 1, emitValue(context, property, v, indent + 1));
                }).join(",\n");
                ret = ret + "\n";
                ret += line(indent, "]");
            } else {
                // check if the array type has some examples
                const name = ((property.type as ArrayModelType).indexer.value as Model).name;
                const model = ((property.type as ArrayModelType).indexer.value as Model);
                const examples = getExamples(context.program, model);
                if (examples.length > 0) {
                    ret = "[\n";
                    const ex = getRandomItem(examples);

                    ret += line(indent + 1, `${emitValue(context, property, ex.value, indent + 1)}\n`);

                    ret += line(indent, "]");
                } else {
                    ret = "[]";
                }
            }
            return ret;
            break;
        case "ObjectValue":

            ret = "{\n";
            value.properties.forEach(v => {
                ret += line(indent + 1, `"${v.name}": ${emitValue(context, property, v.value, indent + 1)},\n`);
            });

            // remove the last comma
            if (ret.length > 1) {
                ret = ret.slice(0, -2);
            }
            ret = ret + "\n";

            ret = ret + line(indent, "}");

            return ret;
            break;
        case "EnumValue":
            return `"${(value.value as EnumMember).name}"`;
            break;
        default:

    }
    console.log(`Value type ${value.valueKind} not yet supported`);
    return "\"#invalid " + value.valueKind + "\"";
}

const emitSampleValue = (context: EmitContext, model: Model, property: ModelProperty, options: Options, indent: number): string => {

    const propEx = getExamples(context.program, property);
    if (propEx.length > 0) {
        const ex = getRandomItem(propEx);
        return emitValue(context, property, ex.value, indent);
    }

    const modelEx = getExamples(context.program, model);
    if (modelEx.length > 0) {
        const ex = getRandomItem(modelEx);
        switch (ex.value.valueKind) {
            case "ObjectValue":
                const p = (ex.value as ObjectValue).properties.get(property.name);
                if (p) {
                    return emitValue(context, property, p.value, indent);
                }
                break;
            default:
                console.log(`Value type ${ex.value.valueKind} not yet supported`);
                return "TODO:2 " + ex.value.valueKind;
        }
    }

    if (property.type.kind === "Model") {
        // TODO: not done yet
        // check if the model has any default values
        if (property.type.name === "Array") {
            const model = (property.type as ArrayModelType).indexer.value as Model;
            const examples = getExamples(context.program, model);
            if (examples.length > 0) {
                const ex = getRandomItem(examples);
                let ret = "[\n";
                ret += line(indent + 1, emitValue(context, property, ex.value, indent + 1));
                ret += "\n";
                ret = ret + line(indent, "]");
                return ret;
            }
        } else {
            const modelEx = getExamples(context.program, property.type);
            if (modelEx.length > 0) {
                const ex = getRandomItem(modelEx);
                switch (ex.value.valueKind) {
                    case "ObjectValue":
                        let ret = line(indent, "{\n");
                        ex.value.properties.forEach(v => {
                            ret += line(indent + 1, `"${v.name}": ${emitValue(context, property, v.value, indent + 1)},\n`);
                        });

                        ret = ret + line(indent, "\n}");
                        return ret;

                        break;
                    default:
                        console.log(`Value type ${ex.value.valueKind} not yet supported`);
                        return "TODO:3 " + ex.value.valueKind;
                }
            }
        }
    }
    // TODO: Scalar handling

    // return null if no examples provided
    return "null"; // TODO: change to undefined in TS JSON mode
}

// Emits the sample JSON for the model
const emitSample = (context: EmitContext, model: Model, options: Options): { lines: string[] } => {
    const lines: string[] = [];

    const indent = 0;
    addLine(lines, indent, "{");

    if (model.baseModel) {
        model.baseModel.properties.forEach((prop: ModelProperty) => {
            addLine(lines, indent + 1, `"${prop.name}": ${emitSampleValue(context, model, prop, options, indent + 1)},`)
        });
    }
    model.properties.forEach((prop: ModelProperty) => {
        addLine(lines, indent + 1, `"${prop.name}": ${emitSampleValue(context, model, prop, options, indent + 1)},`)
    });

    // remove the last comma
    if (lines.length > 1) {
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    }

    // TODO: Check for open types
    addLine(lines, indent, "}")

    return { lines }
}


export async function $onEmit(context: EmitContext) {
    if (!context.program.compilerOptions.noEmit) {
        const options: Options = {
            models: context.options["models"],
            outDir: context.options["outDir"],
            namespace: context.options["namespace"],
        }

        const outfiles: { [key: string]: string[] } = {};
        navigateProgram(context.program, {
            namespace(ns) {
                if ((Array.isArray(options.namespace) && options.namespace.includes(ns.name))
                    || ns.name == options.namespace) {
                    ns.models.forEach((model: Model) => {
                        if ((Array.isArray(options.models) && options.models.includes(model.name))
                            || options.models === model.name) {
                            const result = emitSample(context, model, options);
                            outfiles[model.name] = result.lines;
                        }

                    });
                }


            }
        });
        if (Object.keys(outfiles).length != 0) {
            const out = Object.keys(outfiles).map(async (key) => {
                await emitFile(context.program, {
                    path: resolvePath(options.outDir ?? context.emitterOutputDir, `sample-${key}.json`),
                    content: outfiles[key].join(`\n`),
                })
            });
        }
        else {
            context.program.trace("emit", "No models found");
        }

    }
}