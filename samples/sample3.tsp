import "@typespec/http";

using Http;

namespace Samples;

@example(#{name: "Store 1", address: #{street: "123 Main St", city: "Stockholm"}})
@example(#{name: "Store 2", address: #{street: "456 Elm St", city: "Gothenburg"}})
@example(#{name: "Store 3", address: #{street: "789 Oak St", city: "Malmo"}})
model Store {
  name: string;
  address: Address;
}
@example(#{street: "123 Main St", city: "Stockholm"})
@example(#{street: "456 Elm St", city: "Gothenburg"})
@example(#{street: "789 Oak St", city: "Malmo"})
model Address {
  street: string;
  city: string;
}

@route("/stores")
interface Stores {
  list(@query filter: string): Store[];
  read(@path id: Store): Store;
}