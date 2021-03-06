const Type = require('../src');

const options = {
	port    : 1234,
	address : '0.0.0.0'
}

Type.assert([options.ssl], [undefined, Boolean]);

//process.exit(0);






class Kid {}

var kid1 = new Kid()
var kid2 = new Kid()

var input = {
	id : {
		hi : () => {},
		what: null,
		meh: 'string',
		hi1: kid2,
		hi2: Symbol('hi'),
		hi3: Kid,
		array: [{
			test: false,
			fail: true,
			fourth: [{
				fail : '1',
				hi2  : '1',
				arr  : ['1', '1'],
				x    : '1'
			},{
				fail : '2',
				hi2  : '2',
				arr  : ['2', '2'],
				x    : '2'
			}]
		}]
	},
	name : 'name string',
	age  : 42,
	kids : [kid1, kid2, 'hi', () => {}]
};

var x = process.hrtime()
Type.assert(input, {
	id : {
		hi    : Function,
		what  : null,
		meh   : String,
		hi1   : Kid,
		hi2   : Symbol,
		hi3   : Function,
		array : [{
			test   : Boolean,
			fail   : Boolean,
			fourth : [{
				fail : String,
				hi2   : String,
				arr  : [String],
				x    : String
			}]
		}]
	},
	name : String,
	age  : Number,
	kids : [NaN]
});
