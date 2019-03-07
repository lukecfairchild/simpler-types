
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

const getTypeName = (type) => {
	if (type === undefined) {
		return 'undefined';
	}

	if (type === null) {
		return 'null';
	}

	if (typeof type === 'number'
	&&  isNaN(type)) {
		return 'NaN';
	}

	return type.name;
}


const Type = {};

Type.iterate = (values, types) => {
	if (typeof types !== 'object') {
		console.log(typeof types, types)
		throw new Error('Invalid type given');
	}

	if (types instanceof Array) {
		if (!Type.is(values, Array)) {
			return false;
		}

		if (!types.length) {
			return  true;
		}

		for (let typesIndex in types) {
			const type = types[typesIndex];

			for(var i = values.length -1; i >= 0 ; i--){
				const value = values[i];

				if (Type.is(value, type)) {
					values.splice(i, 1);
				}
			}
		}

		if (values.length) {
			return false;
		}

	} else {
		if (!Type.is(values, Object)) {
			return false;
		}

		for (let key in types) {
			const value = values[key];
			const type  = types[key];

			if (!Type.is(value, type)) {
				return false;
			}
		}
	}

	return true;
}

Type.assert = (value, type) => {
	if (!Type.is(value, type)) {
		throw new Error(
			`Incorrect type recieved.\n  expected: ${getTypeName(type)} \n  recieved: ${Type.get(value)}\n  value: ${toString(value)}`
		);
	}
}

Type.get = (value) => {
	if (value === undefined) {
		return 'undefined';
	}

	if (value === null) {
		return 'null';
	}

	if (typeof value === 'number') {
		if (isNaN(value)) {
			return 'NaN';
		}

		return 'Number';
	}

	if (typeof value === 'symbol') {
		return 'Symbol';
	}

	if (typeof value === 'string') {
		return 'String';
	}

	if (typeof value === 'function') {
		return 'Function';
	}

	if (typeof value === 'boolean') {
		return 'Boolean';
	}

	if (typeof value === 'object'
	&&  value instanceof Array) {
		return 'Array';
	}

	if (typeof value === 'object'
	&&  value instanceof Object) {
		return Object(value).constructor.name;
	}
}

Type.is = (value, type) => {
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
			switch (typeof type) {
				case 'string':
				case 'boolean': {
					throw new Error('Invalid type given');
				}
				case 'number': {
					if (!isNaN(type)) {
						throw new Error('Invalid type given');
					}

					type = 'NaN';

					break;
				}
				case 'function': {
					if (!type.name) {
						throw new Error('Invalid type given');
					}

					type = type.name;

					break;
				}
				case 'object': {
					return Type.iterate(value, type);
				}
			}
		}
	}

	const valueType = Type.get(value);

	if (type === 'NaN'
	&&  valueType !== 'Number') {
		return true;
	}

	return valueType === type;
}


module.exports = Type;

/* temp examples

class Kid {}

var kid1 = new Kid()
var kid2 = new Kid()



var input = {
	name : '',
	age  : 42,
	kids : [kid1, kid2]
};


Type.assert(input, {
	name : String,
	age  : Number,
	kids : [Kid]
});

// */
