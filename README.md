# Simpler Types

A simplified way of verifying variable types.

## Installation

``` bash
	$ npm install simpler-types
```
## Whats new?
1.1.1 - We added the ability for the "assert" and "is" functions to accept and check multi-layered objects and arrays for types. See the "Layered Checks" section down below for examples.

## Methods
### Type.assert()
Throws an exception anytime the input does not match the type. The input and type can objects or arrays with embedded types within them or a single type.
``` javascript
	Type.assert(input, type);
```

### Type.get()
Returns the name of the type provided.
``` javascript
	Type.get(input);
```

### Type.getType()
Returns the class type of a provided variable.
``` javascript
	Type.getType(inputy);
```

### Type.is()
Returns true/false based on if input matches the type. The input and type can objects or arrays with embedded types within them or a single type.
``` javascript
	Type.is(input, type);
```

## Examples

``` javascript
	const Type = require('simpler-types');

	class MyClass {}

	const myInstance = new MyClass();

	Type.get(myInstance); // "MyClass"
	Type.get(0); // "Number"
	Type.get(''); // "String"
	Type.get(false); // "Boolean"
	Type.get(() => {}); // "Function"
	Type.get([]); // "Array"
	Type.get({}); // "Object"
	Type.get(NaN); // "NaN"
	Type.get(null); // "null"
	Type.get(undefined); // "undefined"
	Type.get(Symbol('id')); // "Symbol"

	Type.getType(myInstance); // MyClass
	Type.getType(0); // Number
	Type.getType(''); // String
	Type.getType(false); // Boolean
	Type.getType(() => {}); // Function
	Type.getType([]); // Array
	Type.getType({}); // Object
	Type.getType(NaN); // NaN
	Type.getType(null); // null
	Type.getType(undefined); // undefined
	Type.getType(Symbol('id')); // Symbol

	Type.assert(myInstance, MyClass);
	Type.assert(0, Number);
	Type.assert('', String);
	Type.assert(false, Boolean);
	Type.assert(() => {}, Function);
	Type.assert([], Array);
	Type.assert({}, Object);
	Type.assert(NaN, NaN);
	Type.assert('', NaN);
	Type.assert(null, null);
	Type.assert(undefined, undefined);
	Type.assert(Symbol('id'), Symbol);

	Type.is(myInstance, MyClass); // true
	Type.is(0, Number); // true
	Type.is('', String); // true
	Type.is(false, Boolean); // true
	Type.is(() => {}, Function); // true
	Type.is([], Array); // true
	Type.is({}, Object); // true
	Type.is(NaN, NaN); // true
	Type.is('', NaN); // true
	Type.is(null, null); // true
	Type.is(undefined, undefined); // true
	Type.is(Symbol('id'), Symbol); // true
```

### Layered Checks
``` javascript
Type.assert(input, {
	name : String,
	age  : Number,
	address : {
		street  : String,
		zipcode : Number,
		state   : String,
		country : String
	}
});

Type.is(input, {
	name : String,
	age  : Number,
	address : {
		street  : String,
		zipcode : Number,
		state   : String,
		country : String
	}
});
```

## License

Simpler Types is freely distributable under the terms of the [MIT license](https://github.com/lukecfairchild/simpler-types/blob/master/LICENSE).

