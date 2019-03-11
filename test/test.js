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

var x = process.hrtime()
var y = process.hrtime()
// console.log((y[1] - x[1]) / 1000000)

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
				arr  : ['1'],
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

//---------------------------------------------Start of Justins Test's

const testObjectsArray = [
	{
		consoleLog: console.log("Test 1 - Making sure nested types work with Strings in Objects"),
		testObjectData: {
			person: {
				name: "Justin",
				age: 21,
				awesome: true,
				subscribe: () => {},
				sym: Symbol("hello world"),
				soul: null,
				religon: undefined,
				worth: NaN,
				hasNo: kid1,
				or: kid2,
				table: {},
				computer: []
			}
		},
		testObjectTypes: {
			person: {
				name: String,
				age: Number,
				awesome: Boolean,
				subscribe: Function,
				sym: Symbol,
				soul: null,
				religon: undefined,
				worth: NaN,
				hasNo: Kid,
				or: Kid,
				table: Object,
				computer: Array
			}
		}
	},
	{
		consoleLog: console.log("Test 2 - Testing nested Arrays inside a parent Object"),
		testObjectData: {
			house: {
				thing: [1,2],
				otherThing: ['1', '2'],
				cat: [true, false],
				in: [null, null],
				the: [undefined, undefined],
				hat: [NaN, NaN],
				cooks: [() => {}, () => {}],
				good: [[], []],
				stuff: [{}, {}],
				moreStuff: [Symbol('hello'), Symbol('there')],
				evenMoreStuff: [kid1, kid2]
			}
		},
		testObjectTypes: {
			house: {
				thing: [Number],
				otherThing: [String],
				cat: [Boolean],
				in: [null],
				the: [undefined],
				hat: [NaN],
				cooks: [Function],
				good: [Array],
				stuff: [Object],
				moreStuff: [Symbol],
				evenMoreStuff: [Kid]
			}
		}
	},
	{
		consoleLog: console.log("Test 3 - Testing Object inside a parent Array"),
		testObjectData: [
			{
				name: "Justin",
				age: 21,
				awesome: true,
				subscribe: () => {},
				sym: Symbol("hello world"),
				soul: null,
				religon: undefined,
				worth: NaN,
				hasNo: kid1,
				or: kid2,
				table: {},
				computer: []
			}
		],
		testObjectTypes: [
			{
				name: String,
				age: Number,
				awesome: Boolean,
				subscribe: Function,
				sym: Symbol,
				soul: null,
				religon: undefined,
				worth: NaN,
				hasNo: Kid,
				or: Kid,
				table: Object,
				computer: Array
			}
		]
	}
]
testObjectsArray.map(test => {
	Type.assert(test.testObjectData, test.testObjectTypes)
})