// 存储四元式
// four_pro[ 1 ] = { op: '+-*/=><', arg1: '', arg2: '', result: '' };
var four_pro = [],

	// 存储所有出现过的值,按顺序存储.
    sy_value = [],

	// 按序存储出现的变量
	var_value = [],

	// 存储所有变量的地址
	addr_reg = [],

	// 当前翻译的语句类型
	code_type = '',    //while,if,if_else

	// 为还原条件表达式做准备
	condition_exp = [];

function test() {

	var value = $('input').value.split('\n'),
		i,
		len = value.length;
	
	for ( i = 0; i < len; i++ ) {

		storeVar( value[ i ] );
	}
}

function translate( arg ) {

	// 翻译赋值语句
	if ( arg.indexOf('=') != -1 && 
			sy_value.length ) {
		console.log( arg.join('') );
		four_pro.push({
			op: arg[ 1 ],
			arg1: sy_value.pop(),
			result: addr_reg.pop(),
			index: four_pro.length + 1
		});

		// 清空地址准备下一条语句
		addr_reg = [];
	}

	// 翻译输出语句
	if ( arg.indexOf('r') != -1 ) {
		four_pro.push({
			op: 'echo',
			arg1: sy_value.pop(),
			index: four_pro.length + 1
		});
	}
}
