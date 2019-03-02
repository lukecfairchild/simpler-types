
const getTypeInfo = (value) => {
	if (value === undefined) {
		return {
			name  :'undefined',
			value : value
		};
	}

	if (value === null) {
		return {
			name  : 'null',
			value : value
		};
	}

	if (typeof value === 'number') {
		if (isNaN(value)) {
			return {
				name  : 'NaN',
				value : value
			};
		}

		return {
			name  : 'Number',
			value : value
		};
	}

	if (typeof value === 'symbol') {
		return {
			name  : 'Symbol',
			value : value
		};
	}

	if (typeof value === 'string') {
		return {
			name  : 'String',
			value : JSON.stringify(value)
		};
	}

	if (typeof value === 'function') {
		return {
			name  : 'Function',
			value : value
		};
	}

	if (typeof value === 'boolean') {
		return {
			name  : 'Boolean',
			value : value
		};
	}

	if (typeof value === 'object'
	&&  value instanceof Array) {
		return {
			name  : 'Array',
			value : JSON.stringify(value)
		};
	}

	if (typeof value === 'object'
	&&  value instanceof Object) {
		return {
			name  : Object(value).constructor.name,
			value : JSON.stringify(value)
		};
	}
}

const Type = (...args) => {
	const value = args[0];

	let type = args[1];

	const valueType = getTypeInfo(value).name;

	if (args.length === 1) {
		return valueType;
	}

	switch (type) {
		case null: {
			type = 'null';
			break;
		}

		case undefined: {
			type = 'undefined';
			break;
		}

		default: {
			if (typeof type === 'number'
			&&  isNaN(type)) {
				type = 'NaN';

			} else {
				type = type.name;
			}
		}
	}

	if (type === 'NaN'
	&&  valueType !== 'Number') {
		return true;
	}

	return valueType === type;
}

Type.get = (value) => {
	return getTypeInfo(value).name;
}

Type.assert = (value, type) => {
	const valueTypeInfo = getTypeInfo(value);
	const typeInfo      = getTypeInfo(type);

	if (!Type(value, type)) {
		throw new Error(
			`Incorrect type recieved.\n  expected: ${typeInfo.name} \n  recieved: ${valueTypeInfo.name}\n  value: ${valueTypeInfo.value}`
		);
	}
}

module.exports = Type;


class MyClass {}

var myInstance = new MyClass();

Type('', String) // true | false
Type('') // String
Type.get('') // String


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
	MyClass   : {
		value : myInstance,
		class : MyClass
	}
};

// NaN special case
for (var className in values) {
	const value = values[className].value;
	const valueInfo = getTypeInfo(value);

	if (className === 'Number') {
		try {
			Type.assert(value, NaN);
			console.log(`\x1b[31mFAILED: NaN !== ${className}: ${valueInfo.value}`);
			exitCode = 1;

		} catch (e) {
			console.log(`\x1b[32mPASSED: NaN !== ${className}: ${valueInfo.value}`);
		}

	} else {
		try {
			Type.assert(value, NaN);
			console.log(`\x1b[32mPASSED: NaN === ${className}: ${valueInfo.value}`);

		} catch (e) {
			console.log(`\x1b[31mFAILED: NaN === ${className}: ${valueInfo.value}`);
			exitCode = 1;
		}
	}
}

for (var className in values) {
	const ClassType = values[className].class;

	for (var i in values) {
		const value     = values[i].value;
		const valueInfo = getTypeInfo(value);

		if (className == i) {
			try {
				Type.assert(value, ClassType);
				console.log(`\x1b[32mPASSED: ${className} === ${valueInfo.name}: ${valueInfo.value}`);

			} catch (e) {
				console.log(`\x1b[31mFAILED: ${className} === ${valueInfo.name}: ${valueInfo.value}`);
				exitCode = 1;
			}

		} else {
			try {
				Type.assert(value, ClassType);
				console.log(`\x1b[31mFAILED: ${className} !== ${valueInfo.name}: ${valueInfo.value}`);
				exitCode = 1;

			} catch (e) {
				console.log(`\x1b[32mPASSED: ${className} !== ${valueInfo.name}: ${valueInfo.value}`);
			}
		}
	}
}

process.exit(exitCode);
