# TypeSpec Emit JSON examples

[TypeSpec](https://typespec.io) emitter for models to create JSON sample objects.

## Installation

To install the package, use npm:

```bash
npm install typespec-emit-json-examples
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
git clone https://github.com/wictorwilen/typespec-emit-json-examples.git
cd typespec-emit-json-examples
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