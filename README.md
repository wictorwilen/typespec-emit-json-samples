# TypeSpec Emit JSON samples

[![npm version](https://badge.fury.io/js/typespec-emit-json-samples.svg)](https://www.npmjs.com/package/typespec-emit-json-samples)
[![npm](https://img.shields.io/npm/dt/typespec-emit-json-samples.svg)](https://www.npmjs.com/package/typespec-emit-json-samples)
[![MIT](https://img.shields.io/npm/l/typespec-emit-json-samples.svg)](https://github.com/wictorwilen/typespec-emit-json-samples/blob/master/LICENSE.md)
[![GitHub issues](https://img.shields.io/github/issues/wictorwilen/typespec-emit-json-samples.svg)](https://github.com/wictorwilen/typespec-emit-json-samples/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/wictorwilen/typespec-emit-json-samples.svg)](https://github.com/wictorwilen/typespec-emit-json-samples/issues?q=is%3Aissue+is%3Aclosed)

[TypeSpec](https://typespec.io) emitter for models to create JSON example objects.

## Installation

To install the package, use npm:

```bash
npm install typespec-emit-json-samples
```

## Usage

This package is designed to work with the TypeSpec compiler. After installing, you can use it to generate JSON sample objects.

## Configuration

Use the following configuration in the `tspconfig.yaml`

- **namespace** (string, required) - the namespace where the models are found
- **models** (array(string), required) - the actual models to create samples from  
- **outDir**: (string) - the output directory

``` yaml
emit:
  - "typespec-emit-json-samples"
options:
  "typespec-emit-json-samples":
    "namespace": "PersonView"
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

Created by [Wictor Wilén](https://www.wictorwilen.se). For inquiries, contact [wictorwilen@microsoft.com](mailto:wictorwilen@microsoft.com).