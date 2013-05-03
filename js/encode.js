/*
 * 对输入的多字母文法及特殊文法进行转码
 *
 * USE TIPS:
 *
 *		自己含有多个字母的文法
 *			1.开始文法写在第一行,其它的位置随意
 *			2.格式如下:
 *				PRO -> PRO PROP
 *				PROP -> SOME
 *			3.即产生式的右部与左部通过' -> '链接,注意两头的空格是必须的.
 *
 * EAXMPLE:
 *
 		PROGRAM -> NT N
		PROGRAMM -> PROGRAM
		PROGRAM -> PROGRAM PROGRAMM
		PROGRAM -> NT N=CONST
		PROGRAM -> NT N[]
		PROGRAM -> N=S
		PROGRAM -> N='sconst'
		PROGRAM -> while(B) do PROGRAM done
		PROGRAM -> if(B) then PROGRAM fi
		PROGRAM -> if(B) then PROGRAM fi else then PROGRAM fi
		PROGRAM -> echo N
		PROGRAM -> echo 'sconst'
		CONST -> iconst
		CONST -> dconst
		CONST -> 'sconst'
		NT -> int
		NT -> double
		NT -> string
		S -> S+S1
		S -> S-S1
		S -> S1
		S1 -> S1*S2
		S1 -> S1/S2
		S1 -> S2
		S2 -> (S)
		S2 -> N
		S2 -> N['iconst']
		S2 -> iconst
		S2 -> dconst
		B -> S ROP S
		ROP -> <
		ROP -> >
		ROP -> =
		N -> v
 * */
function encode() {

	/*变量区域*/
	var CONST_POS_UPPER = 65;//A-Z
	var CONST_POS_LOWER = 97;//a-z
	var _T = [];
	var _V = [];
	var _const = [];

	//获取输入框的值并进行解码
	var code = $('input').value.split(/\n/g);

	//识别出所有的非终结符
    for(var i=0; i<code.length; i++){
		var v = trim(code[i]).slice(0,code[i].indexOf(' '));
		if(i == 0)
			_V[v] = 'S';
		if(CONST_POS_UPPER == 83)
			CONST_POS_UPPER ++;
		if(_V[v] == undefined)
			_V[v] = String.fromCharCode(CONST_POS_UPPER++);
		code[i] = code[i].replace(v,_V[v]);
	}
	CONST_POS_UPPER = 65;
	
	//对文法进行转码
	var band = ['(',')','-','+','*','/','=','>','<','\'','\"','[',']','{','}',','];
    for(var i=0; i<code.length; i++){
		var t = code[i].replace(/\w*.*\s*->\s*/g,'').split(' ');
		for(var item in t){
			if(_V[t[item]] !== undefined)
				t[item] = _V[t[item]];
			//终结符,非终结符,边界符号混合的情况
			else{
				var now = '';
				var _t = t[item];
				for(var j=0; j<t[item].length; j++){
					//循环读没项,直到遇见边界符号
					if(!is_inArray(t[item][j],band) && t[item][j] != ''){
						now += t[item][j];
						if(j != t[item].length -1)
							continue;
					}
					//已识别出的非终结符
					if(_V[now] !== undefined)
						_t = _t.replace(now,_V[now]);
					//识别终结符
					else{
						if(now.length){
							if(_T[now] == undefined)
								_T[now] = String.fromCharCode(CONST_POS_LOWER++);
							_t = _t.replace(now,_T[now]);
						}
					}
					//边界符号不做处理,出现即判重压栈
					if(is_inArray(t[item][j],band)){
						if(!is_inArray(t[item][j],_const))
							_const.push(t[item][j]);
					}
					now = '';
				}			
				t[item] = _t;
			}
		}
		code[i] = code[i].replace(/\s*->\s*.+/g,'') + '->' + t.join('');
	}
	CONST_POS_LOWER = 97;

	//转换成程序能识别的文法格式
	var _V_ = [];
	var _T_ = [];
	for(var i in _V){
		_V_.push(_V[i]);	
	}
	for(var i in _T){
		_T_.push(_T[i]);	
	}
	
	//转码后的文法
	$('input').value = 'V={' + _V_.join(',') + '}\nT={' + _T_.concat(_const).join(',') + '}\n' +  code.join('\n');
}
