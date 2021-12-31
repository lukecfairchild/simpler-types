const debug = false;

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
};
const toTypeString = (value) => {
	switch (Type.getName(value)) {
		case 'Array'  :
		case 'Object' : {
			if (value instanceof Array) {
				let arrayString = '[';

				for (let i = 0; i < value.length; i++) {
					arrayString += toTypeString(value[i]);

					if (i < value.length - 1) {
						arrayString += ', ';
					}
				}

				return arrayString + ']';
			}

			let objectSting = '{';

			let i = 0;

			for (let key in value) {
				objectSting += key + ': ' + toTypeString(value[key]);

				if (Object.keys(value).length - 1 > i) {
					objectSting += ', ';
				}

				i++;
			}

			return objectSting + '}';
		}

		default : {
			return getTypeName(value);
		}
	}
};
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
};
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
};
const isType = (value, type) => {
	const typeName  = getTypeName(type);
	const valueType = Type.getName(value);

	if (typeName === 'NaN'
	&&  valueType !== 'Number') {
		return true;
	}

	return valueType === typeName;
};
const iterate = (values, types, indent) => {
	if (typeof types !== 'object') {
		return;
	}

	indent = indent || 0;

	const space = '  '.repeat(indent);

	if (types instanceof Array) {
		if (Type.getName(values) !== 'Array') {
			return {
				expected : toTypeString(types),
				received : toString(values),
				data     : '',
				meta     : undefined
			};
		}

		const valueResults  = values.map((value) => {
			if (debug) console.log(`${space}VALUE:`, toString(value));
			const typeResults = types.map((type) => {
				const typeName      = getTypeName(type);
				const valueTypeName = Type.getName(value);
				const valueType     = getValueType(value);
				if (debug) onsole.log(`${space}  Testing:`, typeName, typeName === 'NaN');

				switch (typeName) {
					case 'Object' :
					case 'Array'  : {
						const iterateResults = iterate(value, type, indent + 1);
						if (debug) console.log(`${space}    Error1: ${typeName}`, !iterateResults);
						return !iterateResults
					}
					case 'NaN' : {
						if (valueTypeName === typeName) {
							if (debug) console.log(`${space}    Error2: ${typeName}`, false);
							return false
						}

						return true;
					}
					default : {
						if (valueTypeName !== typeName) {
							if (debug) console.log(`${space}    Error3: ${typeName}`, false);
							return false
						}
					}

					if (debug) console.log(`${space}    Matched1: ${typeName}`, true);
					return true;
				}
			});

			if (debug) console.log('typeResults', typeResults);
			if (debug) console.log('value:', toString(value));

			if (typeResults.includes(true)) {
				return true;
			}

			return false;
		});

		if (debug) console.log('valueResults', valueResults);

		if (valueResults.includes(false)) {
			return {
				expected : toTypeString(types),
				received : toString(values),
				data     : '',
				meta     : undefined
			};
		}

	} else {
		for (let key in types) {
			const value      = values[key];
			const type       = types[key];
			const typeName   = getTypeName(type);
			if (debug) console.log(`${space}VALUE:`, value);

			if (debug) console.log(`${space}  Testing:`, typeName);

			switch (typeName) {
				case 'Object':
				case 'Array': {
					const result = iterate(value, type, indent + 1);

					if (result) {
						if (debug) console.log(`${space}    Error4: ${typeName}`);
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
				if (debug) console.log(`${space}    Error5: ${typeName}`);
				const valueType = Type.getName(value);
				const data      = `{\n${'    '.repeat(indent + 1)}${key}: \x1b[41m${toString(value)}\x1b[0m\n${'    '.repeat(indent)}}`;

				return {
					expected : getTypeName(type),
					received : valueType,
					data     : data
				};
			}

			if (debug) console.log(`${space}    Matched2: ${typeName}`);
		}
	}
};


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
			`Incorrect type received.\n  Expected: ${getTypeName(type)} \n  Received: ${Type.getName(value)}\n     Value: ${toString(value)}`
		);
	}
};
Type.getName = (value) => {
	return getTypeName(getValueType(value))
};
Type.getType = getValueType;
Type.get = getValueType;
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
};


module.exports = Type;
