
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

				for (let i in value) {
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

	return type.name || type.constructor.name;
}


const Type = {};

Type.iterate = (values, types, isAssert) => {
	if (typeof types !== 'object') {
		throw new Error('Invalid type given');
	}

	if (types instanceof Array) {
		const typeTypes  = [];
		const valueTypes = [];

		let success = true;

		for (let i in types) {
			const type     = types[i];
			const typeName = Type.get(type);

			switch (typeName) {
				case 'Object':
				case 'Array': {
					typeTypes.push(typeName);

					for (let j in values) {
						const value     = values[j];
						const valueType = Type.get(value);

						switch (valueType) {
							case 'Object':
							case 'Array': {
								if (!Type.iterate(value, type, isAssert)) {
									return false
								}
							}
						}
					}

					break;
				}

				default: {
					typeTypes.push(getTypeName(type));
				}
			}
		}

		for (let i in values) {
			const value     = values[i];
			const valueType = Type.get(value);

			valueTypes.push(valueType);

			if (!typeTypes.includes(valueType)) {
				if (typeTypes.includes('NaN')) {
					if (Type.is(value, Number)) {
						success = false;
					}
				} else {
					success = false;
				}
			}
		}

		if (!success) {
			if (isAssert) {
				throw new Error(
					`1 Incorrect type received.\n  Expected: [${typeTypes.join(', ')}] \n  Received: [${valueTypes.join(', ')}]\n     Value: ${toString(values)}`
				);
			}

			return false;
		}

	} else {
		if (!Type.is(values, Object)) {
			if (isAssert) {
				throw new Error(
					`3 Incorrect type received.\n  Expected: ${getTypeName(Object)} \n  Received: ${Type.get(values)}\n     Value: ${toString(values)}`
				);
			}

			return false;
		}

		for (let key in types) {
			const value = values[key];
			const type  = types[key];

			if (typeof type === 'object'
			&&  type !== null) {
				 if (!Type.iterate(value, type, isAssert)) {
				 	return false;
				 }
			}

			if (!Type.is(value, type)) {
				if (isAssert) {
					throw new Error(
						`4 Incorrect type received.\n  Expected: ${getTypeName(type)} \n  Received: ${Type.get(value)}\n     Value: ${toString(value)}`
					);
				}

				return false;
			}
		}
	}

	return true;
}

Type.assert = (value, type) => {
	if (!Type.is(value, type, true)) {
		throw new Error(
			`Incorrect type received.\n  Expected: ${getTypeName(type)} \n  Received: ${Type.get(value)}\n     Value: ${toString(value)}`
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

Type.is = (value, type, isAssert) => {
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
					throw new Error('Invalid type given.');
				}
				case 'number': {
					if (!isNaN(type)) {
						throw new Error('Invalid type given.');
					}

					type = 'NaN';

					break;
				}
				case 'function': {
					if (!type.name) {
						throw new Error('Invalid type given.');
					}

					type = type.name;

					break;
				}
				case 'object': {
					return Type.iterate(value, type, isAssert);
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
