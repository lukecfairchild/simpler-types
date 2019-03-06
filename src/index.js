
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

const Type = {};

Type.getTypeName = (type) => {
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

Type.assert = (value, type) => {
	if (!Type.is(value, type)) {
		throw new Error(
			`Incorrect type recieved.\n  expected: ${Type.getTypeName(type)} \n  recieved: ${Type.get(value)}\n  value: ${toString(value)}`
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
	const valueType = Type.get(value);

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


module.exports = Type;
