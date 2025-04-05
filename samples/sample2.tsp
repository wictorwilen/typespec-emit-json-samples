import "@typespec/protobuf";

using Protobuf;

@package({
  name: "addressbook",
})
namespace Samples;

enum PhoneType {
  MOBILE: 0,
  HOME: 1,
  WORK: 2,
}

model PhoneNumber {
  @field(1) number: string;
  @field(2) type: PhoneType;
}

@example(#{name:"John Doe", id:32, email:"john@doe.com", phones: #[
  #{number:"1234567890", type: PhoneType.MOBILE},
  #{number:"0987654321", type: PhoneType.HOME}
]})
model Person {
  @field(1) name: string;
  @field(2) id: int32;
  @field(3) email: string;
  @field(4) phones: PhoneNumber[];
}