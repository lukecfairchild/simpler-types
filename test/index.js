
const toString = (value) => {
	switch (value) {
		case null:
		case undefined:
			return value;
	}

	switch (typeof value) {
		case 'symbol':
			return value.toString();
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
		case 'object': {
			if (value instanceof Array) {
				let arrayString = '[';

				for (let i = 0; i < value.length; i++) {
					arrayString += toString(value[i]);

					if (i < value.length - 1) {
						arrayString += ', ';
					}
				}

				return arrayString + ']';
			}

			let objectSting = '{';

			let i = 0;

			for (let key in value) {
				objectSting += key + ': ' + toString(value[key]);

				if (Object.keys(value).length - 1 > i) {
					objectSting += ', ';
				}

				i++;
			}

			return objectSting + '}';
		}
	}
}

const Type = require('../src');

let exitCode = 0;

if (Type.is(['string'], [Object])) { // true, incorrect
	console.log(`\x1b[31mFAILED: ['string'] !== [Object]`);
	exitCode = 1;

} else {
	console.log(`\x1b[32mPASSED: ['string'] !== [Object]`);
}


try {
	Type.assert('string', Object);
	console.log(`\x1b[31mFAILED: String !== Object`);
	exitCode = 1;

} catch (e) {
	console.log(`\x1b[32mPASSED: String !== Object`);
}

class BlankClass {}

const testInstance = new BlankClass();

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
	BlankClass : {
		value : testInstance,
		class : BlankClass
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

try {
	require('./layeredCheck.js');
	console.log(`\x1b[32mPASSED: Layered Check`);

} catch (e) {
	console.log(`\x1b[31mFAILED: Layered Check`, e);
	exitCode = 1;
}

process.exit(exitCode);