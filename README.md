# Simple Type Assert

A simplified way of verifying variable types.

## Installation

``` bash
	$ npm install simple-type-assert
```

## Methods
### Type.get()
Returns the type of any provided variable.
``` javascript
	Type.get(input);
```

### Type.assert()
Throws an exception anytime the input does not match the type.
``` javascript
	Type.assert(input, type);
```

## Examples

``` javascript
	const Type = require('simple-type-assert');

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
```
