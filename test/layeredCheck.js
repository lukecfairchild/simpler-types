const Type = require('../src');

const options = {}

Type.assert([options.undefined], [undefined, Boolean]);

class Class {}

var instance1 = new Class()
var instance2 = new Class()

var input = {
	object : {
		function  : () => {},
		null      : null,
		string    : 'string',
		class     : instance2,
		symbol    : Symbol('hi'),
		function2 : Class,
		array     : [{
			bool  : false,
			bool2 : true,
			array : [{
				string  : '1',
				string2 : '1',
				array   : ['1', '1'],
				string3 : '1'
			},{
				string  : '2',
				string2 : '2',
				array   : ['2', '2'],
				string3 : '2'
			}]
		}]
	},
	string : 'string',
	number : 42,
	array  : [instance1, instance2, 'hi', () => {}]
};

Type.assert(input, {
	object : {
		function  : Function,
		null      : null,
		string    : String,
		class     : Class,
		symbol    : Symbol,
		function2 : Function,
		array     : [{
			bool  : Boolean,
			bool2 : Boolean,
			array : [{
				string  : String,
				string2 : String,
				array   : [String],
				string3 : String
			}]
		}]
	},
	string : String,
	number : Number,
	array  : [NaN]
});
