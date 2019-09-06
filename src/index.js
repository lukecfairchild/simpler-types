
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
	switch (value) {
		case undefined :
		case null : {
			return value;
		}
	}

	switch (typeof value) {
		case 'boolean'  : return Boolean;
		case 'function' : return Function;
		case 'number'   : {
			if (isNaN(value)) {
				return NaN;
			}

			return Number;
		}
		case 'object' : {
			if (value instanceof Array) {
				return Array;
			}

			if (value instanceof Object) {
				return Object(value).constructor;
			}
		}
		case 'string' : return String;
		case 'symbol' : return Symbol;
	}
}
const getTypeName = (type) => {
	switch (type) {
		case undefined : return 'undefined';
		case null      : return 'null';
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
const iterate = (values, types, indent) => {
	if (typeof types !== 'object') {
		return;
	}

	indent = indent || 0;

	if (types instanceof Array) {
		let returns;

		// Only 1 type is supported per array
		if (types.length > 1) {
			const typesNames = [];

			types.forEach(type => typesNames.push(getTypeName(type)));

			return {
				expected : '1 Type in array.',
				received : `${types.length} Type's in array.`,
				data     : `\x1b[41m[${typesNames.join(', ')}]\x1b[0m`,
				meta     : {
					type    : 'exception',
					message : 'You can only have 1 Type per array'

				}
			}
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
					const result = iterate(value, types[0], indent);

					if (result) {
						const data = new Array(i);
						data.push(result.data);

						return {
							expected : result.expected,
							received : result.received,
							data     : `[${data.join(', ')}]`,
							meta     : result.meta
						};
					}
				}
			}
		}

		return returns;

	} else {
		for (let key in types) {
			const value      = values[key];
			const type       = types[key];
			const typeName   = getTypeName(type)

			switch (typeName) {
				case 'Object':
				case 'Array': {
					const result = iterate(value, type, indent + 1);

					if (result) {
						const data = `{\n${'    '.repeat(indent + 1)}${key}: ${result.data}\n${'    '.repeat(indent)}}`;

						return {
							expected : result.expected,
							received : result.received,
							data     : data,
							meta     : result.meta
						};
					}
				}
			}

			if (!isType(value, type)) {
				const valueType = Type.get(value);
				const data      = `{\n${'    '.repeat(indent + 1)}${key}: \x1b[41m${toString(value)}\x1b[0m\n${'    '.repeat(indent)}}`;

				return {
					expected : getTypeName(type),
					received : valueType,
					data     : data
				};
			}
		}
	}
}


Type.assert = (value, type) => {
	if (typeof type === 'object'
	&&  type instanceof Object) {
		const result = iterate(value, type);

		if (result) {
			let message = 'Incorrect type received.';

			if (result.meta
			&&  result.meta.message) {
				message = result.meta.message;
			}

			throw new Error(
				`${message}\n  Expected: ${result.expected} \n  Received: ${result.received}\n     Value: ${result.data}`
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
Type.getType = getValueType;
Type.is = (value, type) => {
	if (typeof type === 'object'
	&&  type instanceof Object) {
		const result = iterate(value, type);

		if (result
		&&  result.meta
		&&  result.meta.type === 'exception') {
			let message = 'Incorrect type received.';

			if (result.meta
			&&  result.meta.message) {
				message = result.meta.message;
			}

			throw new Error(
				`${message}\n  Expected: ${result.expected} \n  Received: ${result.received}\n     Value: ${result.data}`
			);
		}

		return !result;
	}

	return isType(value, type);
}


module.exports = Type;
