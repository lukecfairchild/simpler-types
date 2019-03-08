const Type = require('../src');


class Kid {
	constructor () {
		this.hi = 'hello';
	}
	hi () {
		console.log('hi');
	}
}

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
		array: ['hi','', {
			test: true,
			fail: true,
			fourth: [{
				fail : '',
				hi   : '',
				arr  : ['', ''],
				x    : ''
			},{
				fail : '',
				hi   : '',
				arr  : ['', ''],
				x    : ''
			}]
		}]
	},
	name : 'name string',
	age  : 42,
	kids : [kid1, kid2, 'hi', () => {}]
};

// var x = process.hrtime()
Type.assert(input, {
	id : {
		hi    : Function,
		what  : null,
		meh   : String,
		hi1   : Kid,
		hi2   : Symbol,
		hi3   : Function,
		array : [String, {
			test   : Boolean,
			fail   : Boolean,
			fourth : [{
				fail : String,
				hi   : String,
				arr  : [String],
				x    : NaN
			}]
		}]
	},
	name : String,
	age  : Number,
	kids : [NaN]
});

// var y = process.hrtime()
// console.log(y[1] - x[1])


