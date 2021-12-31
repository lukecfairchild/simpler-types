# Simpler Types

A simplified way of verifying variable types.

## Installation

``` bash
	$ npm install simpler-types
```
## Whats new?
2.0.0 - Breaking changes: Type.get is defaults to returning the type and not the name, added a Type.getName() method.

## Methods
### Type.assert(input, Type)
Throws an exception anytime the input does not match the type. The input and type can objects or arrays with embedded types within them or a single type.
``` javascript
	Type.assert(input, type);
```

### Type.getName(input)
Returns the name of the type provided.
``` javascript
	Type.getName(input);
```

### Type.get(input)
Returns the class type of a provided variable.
``` javascript
	Type.get(input);
```

### Type.getType(input)
Returns the class type of a provided variable. This is the same as Type.get().
``` javascript
	Type.getType(input);
```

### Type.is(input, Type)
Returns true/false based on if input matches the type. The input and type can objects or arrays with embedded types within them or a single type.
``` javascript
	Type.is(input, type);
```

## Examples

``` javascript
	const Type = require('simpler-types');

	class MyClass {}

	const myInstance = new MyClass();

	Type.get(myInstance); // MyClass
	Type.get(0); // Number
	Type.get(''); // String
	Type.get(false); // Boolean
	Type.get(() => {}); // Function
	Type.get([]); // Array
	Type.get({}); // Object
	Type.get(NaN); // NaN
	Type.get(null); // null
	Type.get(undefined); // undefined
	Type.get(Symbol('id')); // Symbol

	Type.getName(myInstance); // "MyClass"
	Type.getName(0); // "Number"
	Type.getName(''); // "String"
	Type.getName(false); // "Boolean"
	Type.getName(() => {}); // "Function"
	Type.getName([]); // "Array"
	Type.getName({}); // "Object"
	Type.getName(NaN); // "NaN"
	Type.getName(null); // "null"
	Type.getName(undefined); // "undefined"
	Type.getName(Symbol('id')); // "Symbol"

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
const input = {
	name : 'bob',
	age  : 25,
	address : {
		streed : '123 fake str',
		zipcode : 12345,
		state   : 'AB',
		country : 'CD'
	}
};

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
}); // true
```

## License

Simpler Types is freely distributable under the terms of the [MIT license](https://github.com/lukecfairchild/simpler-types/blob/master/LICENSE).

