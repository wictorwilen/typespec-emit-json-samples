# TypeSpec Emit JSON samples

[![npm version](https://badge.fury.io/js/@wictorwilen%2Ftypespec-emit-json-samples.svg)](https://www.npmjs.com/package/@wictorwilen%2Ftypespec-emit-json-samples)
[![npm](https://img.shields.io/npm/dt/@wictorwilen%2Ftypespec-emit-json-samples.svg)](https://www.npmjs.com/package/@wictorwilen%2Ftypespec-emit-json-samples)
[![MIT](https://img.shields.io/npm/l/@wictorwilen%2Ftypespec-emit-json-samples.svg)](https://github.com/wictorwilen/typespec-emit-json-samples/blob/master/LICENSE.md)
[![GitHub issues](https://img.shields.io/github/issues/wictorwilen/typespec-emit-json-samples.svg)](https://github.com/wictorwilen/typespec-emit-json-samples/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/wictorwilen/typespec-emit-json-samples.svg)](https://github.com/wictorwilen/typespec-emit-json-samples/issues?q=is%3Aissue+is%3Aclosed)

[TypeSpec](https://typespec.io) emitter for models to create JSON example objects.

## Installation

To install the package, use npm:

```bash
npm install @wictorwilen/typespec-emit-json-samples
```

## Usage

This package is designed to work with the TypeSpec compiler. After installing, you can use it to generate JSON sample objects.

## Example

TypeSpec document:

``` TypeSpec
namespace Samples;

@example(#{kind: "ev", brand: "Audi", year: 2020})
model Car {
  kind: "ev" | "ice";
  brand: string;
  @minValue(1900) year: int32;
}
```

Emitted JSON sample:

``` JSON
{
    "kind": "ev",
    "brand": "Audi",
    "year": "2020"
}
```

## Features

* Uses the `@example` decorator to generate JSON samples
* For multiple `@example` decorators a random example will be chosen
* If no examples are found on a property the emitter tries to retrieve examples through inheritance

## Configuration

Use the following configuration in the `tspconfig.yaml`

- **namespace** (string or array(string), required) - the namespacse where the models are found
- **models** (string or array(string), required) - the name of the models to create samples from  
- **outDir**: (string) - the output directory

``` yaml
emit:
  - "@wictorwilen/typespec-emit-json-samples"
options:
  "@wictorwilen/typespec-emit-json-samples":
    "namespace": "Samples"
    "models":
      - Car
      - Engine
    "outDir": "{cwd}/tsp-output"

```

## Development

To contribute or modify this package, clone the repository and install the dependencies:

```bash
git clone https://github.com/wictorwilen/typespec-emit-json-samples.git
cd typespec-emit-json-samples
npm install
```

### Build the Project

Run the following command to build the project:

```bash
npm run build
```

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Created by [Wictor Wilén](https://www.wictorwilen.se). For inquiries, contact [wictor@wictorwilen.se](mailto:wictor@wictorwilen.se).