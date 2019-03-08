
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

Type.iterate = (values, types) => {
	if (typeof types !== 'object') {
		throw new Error('Invalid type given');
	}

	if (types instanceof Array) {
		const typeNames  = [];
		const valueTypes = [];

		for (let i in types) {
			const type     = types[i];
			const typeName = Type.get(type);

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

		for (let i in values) {
			const value     = values[i];
			const valueType = Type.get(value);

			valueTypes.push(valueType);

			if ((valueType === 'Object'
			&&   typeNames.includes('Object'))
			||  (valueType === 'Array'
			&&   typeNames.includes('Array'))) {
				let returns;

				for (let j in types) {
					const type = types[j];
					const typeName = getTypeName(type);

					console.log('value', value)
					console.log('type', type)

					switch (typeName) {
						case 'Object':
						case 'Array': {
							returns = [Type.iterate(value, type)];
							console.log(3, returns, toString(value))
							break;
						}

						default: {
							if (typeName !== valueType) {
								console.log(2)
								returns = [value];
							}
						}
					}

console.log('returns', returns);
					if (!returns) {
						returns = undefined;
						break;
					}
				}

				return returns;
			}

			if (!typeNames.includes(valueType)) {
				if (typeNames.includes('NaN')) {
					if (valueType === Number) {
						return [value];
					}

				} else {
					return [value];
				}
			}
		}

	} else {
		for (let key in types) {
			const value    = values[key];
			const type     = types[key];
			const typeName = getTypeName(type)
			const returns  = {};

			returns[key] = value;

			switch (typeName) {
				case 'Object':
				case 'Array': {
					returns[key] = Type.iterate(value, type);

					return returns;
					break;
				}
			}

			if (Type.get(value) !== getTypeName(type)) {
				return returns;
			}
		}
	}
}

Type.assert = (value, type) => {
	console.log(Type.is(value, type, true))
	return
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
					var x = Type.iterate(value, type, isAssert);

					return toString(x)
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
