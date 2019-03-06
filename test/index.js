
const toString = (value) => {
	switch (value) {
		case null:
		case undefined:
			return value;
	}

	switch (typeof value) {
		case 'symbol':
		case 'function':
		case 'boolean':
			return value;
		case 'string':
			return JSON.stringify(value);
		case 'number':
			if (isNaN(value)) {
				return value;
			}

			return value;
		case 'object':
			return JSON.stringify(value);
	}
}

const Type = require('../src');

class TestClass {}

var testInstance = new TestClass();

let exitCode = 0;
const values = {
	Number    : {
		value : 1,
		class : Number
	},
	String    : {
		value : 'string',
		class : String
	},
	Function  : {
		value : () => {},
		class : Function
	},
	Boolean   : {
		value : false,
		class : Boolean
	},
	Object    : {
		value : {},
		class : Object
	},
	Array     : {
		value : [],
		class : Array
	},
	undefined : {
		value : undefined,
		class : undefined
	},
	null      : {
		value : null,
		class : null
	},
	TestClass : {
		value : testInstance,
		class : TestClass
	}
};

// NaN special case
for (var className in values) {
	const value = values[className].value;

	if (className === 'Number') {
		try {
			Type.assert(value, NaN);
			console.log(`\x1b[31mFAILED: NaN !== ${className}: ${toString(value)}`);
			exitCode = 1;

		} catch (e) {
			console.log(`\x1b[32mPASSED: NaN !== ${className}: ${toString(value)}`);
		}

	} else {
		try {
			Type.assert(value, NaN);
			console.log(`\x1b[32mPASSED: NaN === ${className}: ${toString(value)}`);

		} catch (e) {
			console.log(`\x1b[31mFAILED: NaN === ${className}: ${toString(value)}`);
			exitCode = 1;
		}
	}
}

for (var className in values) {
	const ClassType = values[className].class;

	for (var i in values) {
		const value     = values[i].value;
		const valueType = Type.get(value);

		if (className == i) {
			try {
				Type.assert(value, ClassType);
				console.log(`\x1b[32mPASSED: ${className} === ${valueType}: ${toString(value)}`);

			} catch (e) {
				console.log(`\x1b[31mFAILED: ${className} === ${valueType}: ${toString(value)}`);
				exitCode = 1;
			}

		} else {
			try {
				Type.assert(value, ClassType);
				console.log(`\x1b[31mFAILED: ${className} !== ${valueType}: ${toString(value)}`);
				exitCode = 1;

			} catch (e) {
				console.log(`\x1b[32mPASSED: ${className} !== ${valueType}: ${toString(value)}`);
			}
		}
	}
}

process.exit(exitCode);