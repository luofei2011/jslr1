//单词映射表
var _table = {
	//终结符
	PRO:'S',
	T:'NT',
	N:'N',
	CONST:'C',
	S:'E',
	B:'B',
	S1:'F',
	S2:'G',
	ROP:'R',

	//终结符
    variable:'v',
	sconst:'s',
	iconst:'i',
	dconst:'d',
	while:'w',
	do:'o',
	done:'p',
	if:'f',
	then:'t',
	fi:'u',
	else:'e',
	echo:'r',
	int:'n',
	double:'b',
	array:'y',
	string:'g'
}

/*处理输入的代码为可识别文法串进行处理
 * 输入代码的预处理
 *	1.替换里面的sconst,iconst,dconst.对正确性进行处理
 *	2.对if/else/while等的区间是否封闭进行预处理
 *	3.任何串处理错误则停止.
 *	4.程序每行不需要以';'结尾.
 *	5.正常没有封闭区间的一行代表一个语句
 *	6.自己保证有良好的代码风格
 *
 */
function dealCode(){
	//存储处理后的串进行输出
    var str = '';
	//处理输入串一行一个数字存储
	var value = $("input").value
							.replace(/;/g,'')	//去掉';'
							.replace(/\/\*[\S\s]*?\*\//g,'')
							.split(/\n/g);
	//单独去掉每一行的单行注释
	for(var i in value){
		value[i] = value[i].replace(/\/\/.*?$/g,'');
	}
	value = analysis_lex(value);
	value = mergeIfElse(value);

	//按块进行语法分析
	for(var i in value){
		str += analysis_alo(value[i]+'#');
	}
	var err = '';
	if(error.length){
		console.log(error);
		for(var i in error){
			err += '<p>'+error[i]+'</p>';
		}
		$("err_").innerHTML = err;
		$("err").style.display = 'block';
		error = [];
	}
	$("display").innerHTML = str;
	console.log(Global);
}

/*合并一下存在if_else的情况*/
function mergeIfElse(value){
	var arr = [];
	for(var i=0; i<value.length; i++){
		//这句代表是if_else
		if(value[i][0] == 'f' && value[i+1][0] == 'e'){
			arr.push(value[i]+value[i+1]);
			i++;
		}
		//其它情况不做处理
		else
			arr.push(value[i]);
	}
	return arr;
}
