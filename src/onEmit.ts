import { EmitContext, Model, Namespace, navigateProgram, emitFile, resolvePath, ModelProperty, Type, Scalar, ArrayModelType, getDoc, getExamples, getProperty, ObjectValue, Value, RekeyableMap } from "@typespec/compiler";
import { Options } from "./lib.js";


function getRandomItem<T>(array: readonly T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const emitValue = (context: EmitContext, property: ModelProperty, value: Value): string => {
    switch (value.valueKind) {
        case "StringValue":
            return `"${value.value}"`;
            break;
        case "ArrayValue":
            return "[" + value.values.map((v, index, arr) => {
                return emitValue(context, property, v) + (index < arr.length - 1 ? ", " : "");
            }) + "]"

            break;
        case "ObjectValue":
            let ret = "{\n";
            value.properties.forEach(v => {
                ret += `"${v.name}": ${emitValue(context, property, v.value)},\n`
            });
            // remove the last comma
            if (ret.length > 1) {
                ret = ret.slice(0, -2);
            }
            ret = ret + "\n}";
            return ret;
            break;
        default:

    }
    console.log(`Value type ${value.valueKind} not yet supported`);
    return "TODO:1 " + value.valueKind;
}

const emitSampleValue = (context: EmitContext, model: Model, property: ModelProperty, options: Options): string => {

    const propEx = getExamples(context.program, property);
    if (propEx.length > 0) {
        const ex = getRandomItem(propEx);
        return emitValue(context, property, ex.value);
    }

    const modelEx = getExamples(context.program, model);
    if (modelEx.length > 0) {
        const ex = getRandomItem(modelEx);
        switch (ex.value.valueKind) {
            case "ObjectValue":
                const p = (ex.value as ObjectValue).properties.get(property.name);
                if (p) {
                    return emitValue(context, property, p.value);
                }
                break;
            default:
                console.log(`Value type ${ex.value.valueKind} not yet supported`);
                return "TODO:2 " + ex.value.valueKind;
        }
    }

    if (property.type.kind === "Model") {
        // check if the model has any default values
        console.log("x")
        const modelEx = getExamples(context.program, property.type);
        if (modelEx.length > 0) {
            const ex = getRandomItem(modelEx);
            switch (ex.value.valueKind) {
                case "ObjectValue":
                    let ret = "{\n";
                    ex.value.properties.forEach(v => {
                        ret += `"${v.name}": ${emitValue(context, property, v.value)},\n`
                    });
                    // remove the last comma
                    if (ret.length > 1) {
                        ret = ret.slice(0, -2);
                    }
                    ret = ret + "\n}";
                    return ret;

                    break;
                default:
                    console.log(`Value type ${ex.value.valueKind} not yet supported`);
                    return "TODO:3 " + ex.value.valueKind;
            }
        }
    }

    // return undefined if no examples provided
    return "null"; // TODO: change to undefined in TS JSON mode
}

// Emits the sample JSON for the model
const emitSample = (context: EmitContext, model: Model, options: Options): { lines: string[] } => {
    const lines: string[] = [];

    lines.push("{");

    if (model.baseModel) {
        model.baseModel.properties.forEach((prop: ModelProperty) => {
            lines.push(`\t"${prop.name}": ${emitSampleValue(context, model, prop, options)},`)
        });
    }
    model.properties.forEach((prop: ModelProperty) => {
        lines.push(`\t"${prop.name}": ${emitSampleValue(context, model, prop, options)},`)
    });

    // remove the last comma
    if (lines.length > 1) {
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    }

    // TODO: Check for open types

    lines.push(`}`)

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
                if (ns.name == options.namespace) {
                    ns.models.forEach((model: Model) => {
                        if (options.models.includes(model.name)) {
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