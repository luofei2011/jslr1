/*
 *	全局变量数组,维护所有的变量
 *
 *	存储方式:
 *		Global = [
 *			var1: [
 *				val: iconst/dconst/sconst,
 *				type: int/double/string
 *			],
 *			var2: [
 *				val: ...,
 *				type: ...
 *			],
 *			.
 *			.
 *			.
 *			varn: [
 *				val: ...,
 *				type: ...
 *			]
 *		]
 * */
var Global = [];

function hasType(str) {

	//只声明不赋值语句
	var eql = /^(int|double|string)\s+[a-zA-Z][a-zA-Z0-9_]*(\[\s*\])?$/;

	//整型
	var int_reg = /^(int)\s+[a-zA-Z][a-zA-Z0-9_]*\s*=\s*-?\d+$/;
	//double型
	var double_reg = /^(double)\s+[a-zA-Z][a-zA-Z0-9_]*\s*=\s*(-?\d+)(.\d+)?$/;
	//string类型
	var str_reg = /^(string)\s+[a-zA-Z][a-zA-Z0-9_]*\s*=\s*['"][a-zA-Z0-9]*['"]$/;

	//数字赋值
	var eql_num = /^[a-zA-Z][a-zA-Z0-9_]*\s*=\s*-?\d+(.\d+)?$/;
	//字符串赋值
	var eql_str = /^[a-zA-Z][a-zA-Z0-9_]*\s*=\s*['"][a-zA-Z0-9_]*['"]$/;
	//变量直接赋值
	var eql_var = /^[a-zA-Z][a-zA-Z0-9_]*\s*=\s*[a-zA-Z][a-zA-Z0-9_]*$/;

	if(eql.test(str))
		return 1;
    if(int_reg.test(str))
		return 2;
	if(double_reg.test(str))
		return 3;
	if(str_reg.test(str))
		return 4;
	if(eql_num.test(str))
		return 5;
	if(eql_str.test(str))
		return 6;
	if(eql_var.test(str))
		return 7;
	// 对于一般的算数表达式 a = (2*3) / (4-3)
	return 8;
}

function storeVar(str) {
	//var str = $('input').value;
	//console.log( str );
	//第一步检查是否为赋值或则声明语句
	var type = hasType(str),
		isArr = false;
	if(type){
		//通用的变量名提取
		var name = str.replace(/(int|double|string)\s*/g,'')
						.replace(/(\[\s*\])?(\s*=\s*.+)?/g,'');

		// 判断是否是数组声明
		if( str.indexOf('[') != -1 && str.indexOf(']') != -1 ) {
			isArr = true;
		}
		//初始化这个变量
		//初始化声明处理
		if(type < 5){
			Global[name] = [];
		//赋值处理
		}else{
			if(Global[name] == undefined){
				error.push('变量'+name+'未声明!');
				return false;
			}
			if(type == 7){
				//得到第二个变量名
				var name_2 = str.replace(/.+=\s*/g,'');
				if(Global[str.replace(/.+=\s*/g,'')] == undefined){
					error.push('变量'+name_2+'未声明!');
					return false;
				}
			}
		}

		switch(type) {
			case 1:
				Global[name]['type'] = str.slice(0,str.indexOf(' '));
				if(str.slice(0,str.indexOf(' ')) === 'string')
					Global[name]['val'] = '';
				else
					Global[name]['val'] = 0;
				break;
			case 2:
				Global[name]['val'] = parseInt(str.replace(/.+=\s*/g,''));
				Global[name]['type'] = 'int';
				break;
			case 3:
				Global[name]['val'] = parseFloat(str.replace(/.+=\s*/g,''));
				Global[name]['type'] = 'double';
				break;
			case 4:
				Global[name]['val'] = str.replace(/.+=\s*['"]/g,'')
											.replace(/'|"/g,'');
				Global[name]['type'] = 'string';
				break;
			case 5:
				Global[name]['val'] = parseFloat(str.replace(/.+=\s*/g,''));
				//double
				if(str.replace(/.+=\s*/g,'').indexOf('.') != -1)
					Global[name]['type'] = 'double';
				else
					Global[name]['type'] = 'int';
				break;
			case 6:
				Global[name]['val'] = str.replace(/.+=\s*['"]/g,'')
											.replace(/'|"/g,'');
				Global[name]['type'] = 'string';
				break;
			case 7:
				Global[name]['val'] = Global[name_2].val;
				Global[name]['type'] = Global[name_2].type;
				four_pro.push({
					op: '=',
					arg1: name_2,
					result: name,
					index: four_pro.length + 1
				});
				break;
			default:
				return false;
		}
		return true;
	}else{
		return false;
	}
}
