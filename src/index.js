
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
