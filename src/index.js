
const Type = {};

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
const getValueType = (value) => {
	if (value === undefined) {
		return undefined;
	}

	if (value === null) {
		return null;
	}

	if (typeof value === 'number') {
		if (isNaN(value)) {
			return NaN;
		}

		return Number;
	}

	if (typeof value === 'symbol') {
		return Symbol;
	}

	if (typeof value === 'string') {
		return String;
	}

	if (typeof value === 'function') {
		return Function;
	}

	if (typeof value === 'boolean') {
		return Boolean;
	}

	if (typeof value === 'object'
	&&  value instanceof Array) {
		return Array;
	}

	if (typeof value === 'object'
	&&  value instanceof Object) {
		return Object(value).constructor;
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

	if (typeof type === 'function'
	&&  type.name) {
		return type.name;
	}

	return type.constructor.name;
}
const isType = (value, type) => {
	const typeName  = getTypeName(type);
	const valueType = Type.get(value);

	if (typeName === 'NaN'
	&&  valueType !== 'Number') {
		return true;
	}

	return valueType === typeName;
}

Type.getType = getValueType;

Type.iterate = (values, types, indent) => {
	if (typeof types !== 'object') {
		return;
	}

	indent = indent || 0;

	if (types instanceof Array) {

		// Only 1 type is supported per array
		if (types.length > 1) {
			const typesNames = [];

			types.forEach(type => typesNames.push(getTypeName(type)));

			throw new Error(`You can only specify 1 type per array: [${typesNames.join(', ')}]`);
		}

		// Convert Types to nameTypes
		const typeNames = [];

		for (let i in types) {
			const type     = types[i];
			const typeName = getTypeName(type);

			switch (typeName) {
				case 'Object':
				case 'Array': {
					typeNames.push(typeName);
					break;
				}
				default: {
					typeNames.push(getTypeName(type));
				}
			}
		}

		for (let i = values.length -1; i >= 0 ; i--){
			const value         = values[i];
			const valueTypeName = Type.get(value);
			const valueType     = getValueType(value);

			if (!typeNames.includes(valueTypeName)) {
				if (types.includes(NaN)) {
					if (valueType === Number) {
						const data = new Array(i);
						data.push(`\x1b[41m${toString(value)}\x1b[0m`);

						return {
							expected : 'NaN',
							received : 'Number',
							data     : `[${data.join(', ')}]`
						};
					}

				} else {
					const data = new Array(i);

					data.push(`\x1b[41m${toString(value)}\x1b[0m`);

					return {
						expected : `${typeNames.join(' || ')}`,
						received : valueTypeName,
						data     : `[${data.join(', ')}]`
					};
				}
			}

			switch (valueType) {
				case Object:
				case Array: {
					const iterate = Type.iterate(value, types[0], indent);

					if (iterate) {
						const data = new Array(i);
						data.push(iterate.data);

						return {
							expected : iterate.expected,
							received : iterate.received,
							data     : `[${data.join(', ')}]`
						};
					}
				}
			}
		}

	} else {
		for (let key in types) {
			const value      = values[key];
			const type       = types[key];
			const typeName   = getTypeName(type)

			switch (typeName) {
				case 'Object':
				case 'Array': {
					const iterate = Type.iterate(value, type, indent + 1);

					if (iterate) {
						return {
							expected : iterate.expected,
							received : iterate.received,
							data     : `{\n${'    '.repeat(indent + 1)}${key}: ${iterate.data}\n${'    '.repeat(indent)}}`
						};
					}
				}
			}

			if (!isType(value, type)) {
				const valueType = Type.get(value);

				return {
					expected : getTypeName(type),
					received : valueType,
					data     : `{\n${'    '.repeat(indent + 1)}${key}: \x1b[41m${toString(value)}\x1b[0m\n${'    '.repeat(indent)}}`
				};
			}
		}
	}
}

Type.assert = (value, type) => {
	if (typeof type === 'object'
	&&  type instanceof Object) {
		const iterate = Type.iterate(value, type);

		if (iterate) {
			throw new Error(
				`Incorrect type received.\n  Expected: ${iterate.expected} \n  Received: ${iterate.received}\n     Value: ${iterate.data}`
			);
		}

	} else if (!Type.is(value, type, true)) {
		throw new Error(
			`Incorrect type received.\n  Expected: ${getTypeName(type)} \n  Received: ${Type.get(value)}\n     Value: ${toString(value)}`
		);
	}
}

Type.get = (value) => {
	return getTypeName(getValueType(value))
}

Type.is = (value, type) => {
	if (typeof type === 'object'
	&&  type instanceof Object) {
		const iterate = Type.iterate(value, type);

		return !iterate;
	}

	return isType(value, type);
}


module.exports = Type;
