//全局数组,记录发生的所有错误
var error = [];

/*
 *词法分析部分,单独对每行语句进行检测
 *	@param	array	code	数组形式的代码段,按行分割
 *	@return	array	str		数组形式返回编码后的代码段
 *
 * */
function analysis_lex(code) {
	var str = [];	//记录转换后的每个语句.

	//去掉每行的前后空格
	var code = trim(code);

	for(var i=0; i<code.length; i++){
		//第一步排除掉空行
		if(code[i].length){
			var item = code[i];
			//第二步,是否出现注释不匹配的情况
			if(item.indexOf('/*') != -1 || item.indexOf('*/') != -1){
				error.push('/**/多行注释使用有误,请检查.');
				return false;
			//是while语句
			}else if(item.indexOf('while') != -1){
				//首先判断do/done是否匹配循环扫描进来一并处理
				if(!isMatch('do','done',i,code.length,code)){
					error.push('while循环结构不封闭,请检查!');
					return false;
				}
				//读进整个while块
				i++;	//done只能独占一行
				while(1){
					if(code[i].indexOf('done') != -1){
						item += ' '+code[i];
						break;
					}
					item += ' '+code[i];
					//记录下生成的变量
					storeVar(code[i]);
					i++;
				}
				str.push(trans_(item));
			//if/if_else语句
			}else if(item.indexOf('if') != -1 || item.indexOf('else') != -1){
				if(!isMatch('then','fi',i,code.length,code)){
					error.push('if或则else结构不封闭,请检查!');
					return false;
				}
				i++;
				while(1){
					if(code[i].indexOf('fi') != -1){
						item += ' ' + code[i];
						break;
					}
					item += ' ' + code[i];
					storeVar(code[i]);
					i++;
				}
				str.push(trans_(item));
			//普通的赋值语句
			/*
			 *	原则:
			 *
			 *		1.声明即为全局,无局部变量
			 *		2.变量类型不用完全匹配,但程序会自动处理
			 *		3.可重复声明变量,所之前已存在会覆盖
			 *		4.所有的变量声明以前必须有类型关键字
			 *		5.变量声明的时候可以不赋值,程序为自动给默认值
			 *		6.可销毁变量delete
			 *		7.允许多个变量同时声明,不同名字之间用','隔开
			 *
			 *	example:
			 *
			 *		int a;
			 *		int a = 4;
			 *		a = b;
			 *
			 *	method:
			 *
			 *		分两步分析.(1)赋值类型,(2)声明类型
			 *
			 * */
			}else{
				console.log(item);
				if(!storeVar(item)){
					error.push(item+': 非法赋值或者变量未定义,请检查');
					return false
				}
				str.push(trans_(item));
			}
		}
	}
	return str;
}

//对所有输入代码进行转码
function trans_(str) {
	//规定这样的界符:终结符是界符
	var band = ['(',')','-','+','*','/','=','>','<','\'','[',']'];
	var str_out = '';
	var now = '';
	//字符串已匹配好
	var str = str.replace(/\'.*?\'/g,'\'s\'');
	console.log('str:'+str );
	for(var i=0; i<str.length; i++){
		//没遇到边界符的时候一直读取数据直到最后一位
		if(!is_inArray(str[i],band) && str[i] != ' '){
			now += str[i];
			if(i != str.length-1)
				continue;
		}
		//是否为定义好的关键字
		if(_table[now.toLowerCase()] != undefined){
			str_out += _table[now];
		//不是关键字有几种情况:
		//	1.是标识符---->variable(v)
		//	2.是整数---->int(iconst)
		//	3.是浮点型---->double(dconst)
		//	4.string类型在刚开始已经匹配好
		}else{
			//判断是否为空
			if(now.length){
				//除掉开始已经匹配好的字符串变量
				if(str[i] == '\'' && str[i-2] == '\'')
					str_out += now;
				else{
					//标识符
					if(isNaN(now))
						str_out += _table['variable'];	//'v'
					//数值常量
					else{ 
						//浮点型数据
						if(now.indexOf('.') != -1)
							str_out += _table['dconst'];
						//整型数据
						else
							str_out += _table['iconst'];
					}
				}
			}
		}
		//是边界符则直接压入
		if(is_inArray(str[i],band))
			str_out += str[i];
		//记得清空当前情况
		now = '';
	}
	return str_out;
}

//根据传入参数判断是否封闭
function isMatch(st,ed,i,len,str){
	//为包含开始区
	if(str[i].indexOf(st) == -1 && str[i+1].indexOf(st) == -1)
		return false;
	//没有结束区
	for(var j=i; j<len; j++)
		if(str[j].indexOf(ed) != -1)
			return true;
	return false;
}

//消除每项数组前后空格
function trim(arr){
	for(var i in arr)
		arr[i] = arr[i].replace(/(^\s*)|(\s*$)/g,"");
	return arr;
}
