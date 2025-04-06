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

const shuffleArray = <T>(array: readonly T[]): T[] => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function getRandomItem<T>(array: readonly T[], count: number = 1): T {
    const shuffledArray = shuffleArray(array);
    const selectedItems = shuffledArray.slice(0, count);
    return selectedItems as T;
}

const emitValue = (context: EmitContext, property: ModelProperty, value: Value, indent: number, options: Options): string => {
    let ret = "";
    switch (value.valueKind) {
        case "NullValue":
            return "null";
        case "NumericValue":
            return value.value.toString();
        case "StringValue":
            return `"${value.value}"`;
        case "BooleanValue":
            return value.value ? "true" : "false";
        case "ArrayValue":
            if (value.values.length > 0) {
                ret = "[\n";
                ret += value.values.map((v, index, arr) => {
                    return line(indent + 1, emitValue(context, property, v, indent + 1, options));
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
                    const exs = (options.randomize ? shuffleArray(examples) : examples).slice(0, options.arraySize);
                    ret += exs.map((ex, index) => {
                        return line(indent + 1, `${emitValue(context, property, ex.value, indent + 1, options)}`);
                    }).join(",\n");
                    ret = ret + "\n";
                    ret += line(indent, "]");
                } else {
                    // check derived models
                    if (context.options.fillArrays) {
                        const derivedModels = model.derivedModels;
                        const examples = derivedModels.map(m => getExamples(context.program, m)).flat();
                        if (examples.length > 0) {
                            ret = "[\n";
                            const exs = (options.randomize ? shuffleArray(examples) : examples).slice(0, options.arraySize);
                            ret += exs.map((ex, index) => {
                                return line(indent + 1, `${emitValue(context, property, ex.value, indent + 1, options)}`);
                            }).join(",\n");
                            ret = ret + "\n";
                            ret += line(indent, "]");

                        } else {
                            ret = "[]";
                        }
                    }
                }
            }
            if (ret.length === 0)
                ret = "[]";

            return ret;
            break;
        case "ObjectValue":

            ret = "{\n";
            value.properties.forEach(v => {
                ret += line(indent + 1, `"${v.name}": ${emitValue(context, property, v.value, indent + 1, options)},\n`);
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

const emitSampleValue = (context: EmitContext, model: Model, property: ModelProperty, options: Options, indent: number): string | undefined => {

    const propEx = getExamples(context.program, property);
    if (propEx.length > 0) {
        const exs = (options.randomize ? shuffleArray(propEx) : propEx).slice(0, 1);
        const ex = exs[0];
        return emitValue(context, property, ex.value, indent, options);
    }

    const modelEx = getExamples(context.program, model);
    if (modelEx.length > 0) {
        const exs = (options.randomize ? shuffleArray(modelEx) : modelEx).slice(0, 1);
        const ex = exs[0];
        switch (ex.value.valueKind) {
            case "ObjectValue":
                const p = (ex.value as ObjectValue).properties.get(property.name);
                if (p) {
                    return emitValue(context, property, p.value, indent, options);
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
                const exs = (options.randomize ? shuffleArray(examples) : examples).slice(0, options.arraySize);
                let ret = "[\n";
                ret += exs.map((ex, index) => {
                    return line(indent + 1, `${emitValue(context, property, ex.value, indent + 1, options)}`);
                }).join(",\n");
                ret = ret + "\n";
                ret = ret + line(indent, "]");
                return ret;
            }
        } else {
            const modelEx = getExamples(context.program, property.type);
            if (modelEx.length > 0) {

                const exs = (options.randomize ? shuffleArray(modelEx) : modelEx).slice(0, 1);
                const ex = exs[0];
                switch (ex.value.valueKind) {
                    case "ObjectValue":
                        let ret = line(indent, "{\n");
                        ex.value.properties.forEach(v => {
                            ret += line(indent + 1, `"${v.name}": ${emitValue(context, property, v.value, indent + 1, options)},\n`);
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
    if (options.setUndefinedToNull) {
        return "null";
    }
    return undefined;
}

// Emits the sample JSON for the model
const emitSample = (context: EmitContext, model: Model, options: Options): { lines: string[] } => {
    const lines: string[] = [];

    const indent = 0;
    addLine(lines, indent, "{");

    if (model.baseModel) {
        model.baseModel.properties.forEach((prop: ModelProperty) => {
            const val = emitSampleValue(context, model, prop, options, indent + 1);
            if (val !== undefined) {
                addLine(lines, indent + 1, `"${prop.name}": ${val},`);
            }
        });
    }
    model.properties.forEach((prop: ModelProperty) => {
        const val = emitSampleValue(context, model, prop, options, indent + 1);
        if (val !== undefined) {
            addLine(lines, indent + 1, `"${prop.name}": ${val},`);
        }
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
            setUndefinedToNull: context.options["setUndefinedToNull"] ?? true,
            fillArrays: context.options["fillArrays"] ?? false,
            randomize: context.options["randomize"] ?? false,
            arraySize: context.options["arraySize"] ?? 1
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