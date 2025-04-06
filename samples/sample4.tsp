import "@typespec/json-schema";

using JsonSchema;

@jsonSchema
namespace Samples;


model Vehicle {
    make: string;
    brand: string;
    @minValue(1900) year: int32;
}
@example(#{make: "Toyota", brand: "Corolla", year: 2020, doorCount: 4})
model Car extends Vehicle {
    doorCount: int32;
}
@example(#{make: "Audi", brand: "e-tron", year: 2020, batteryCapacity: 95, doorCount:4})
model ElectricCar extends Car {
    batteryCapacity: int32;
}
@example(#{make: "Ford", brand: "F-150", year: 2020, cargoCapacity: 2000, doorCount: 4})
model Truck extends Car {
    cargoCapacity: int32;
}
@example(#{make: "Harley Davidson", brand: "Street 750", year: 2020, hasSidecar: false})
model Motorcycle extends Vehicle {
    hasSidecar: boolean;
}
@example(#{make: "Volvo", brand: "FH16", year: 2020, passengerCapacity: 30})
model Bus extends Vehicle {
    passengerCapacity: int32;
}
@example(#{name: "Alice Doe", vechicles: #[]})
model Person {
    @example("John Doe")
    name: string;
    vechicles: Vehicle[];
}
