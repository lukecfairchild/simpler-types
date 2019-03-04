# Simple Type Assert

A simplified way of verifying variable types.

## Installation

``` bash
	$ npm install simple-type-assert
```

## Example

``` javascript
	const Type = require('simple-type-assert');

	class MyClass {}

	Type.get(''); // String

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
