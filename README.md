# Simple Type Assert

A simplified way of verifying variable types.

## Installation

``` bash
	$ npm install simple-type-assert
```

## Methods
### Type.assert()
Throws an exception anytime the input does not match the type.
``` javascript
	Type.assert(input, type);
```

### Type.get()
Returns the name of the type provided.
``` javascript
	Type.get(input);
```

### Type.is()
Returns true/false based on if input matches the type.
``` javascript
	Type.is(input, type);
```

## Examples

``` javascript
	const Type = require('simple-type-assert');

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

## License

Simple Type Assert is freely distributable under the terms of the [MIT license](https://gitlab.com/lukecfairchild/simple-type-assert/blob/master/LICENSE).

