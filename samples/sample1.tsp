import "@typespec/json-schema";

using JsonSchema;

@jsonSchema
namespace Samples;

@example(#{name: "John Doe", address: #{street: "123 Main St", city: "Stockholm", country: "Sweden"}, nickNames: #["Johnny", "JD"]})
model Person {
  name: string;
  address: Address;
  @uniqueItems nickNames?: string[];
  cars?: Car[];
  age?: int32;
}
@example(#{street: "123 Main St", city: "Stockholm", country: "Sweden"})
model Address {
  street: string;
  city: string;
  country: string;
}

@example(#{kind: "ev", brand: "Audi", year: 2020})
@example(#{kind: "ice", brand: "BMW", year: 2015})
model Car {
  kind: "ev" | "ice";
  brand: string;
  @minValue(1900) year: int32;
}