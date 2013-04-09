var $ = function(selector) { 
	return document.getElementById(selector);
}

/*用到的全局变量*/
var pro = [];	//产生式的数组形式存储
var I = [];		//存储项目集范族
var vt_arr = [];//终结符和非终结符集合
var V = [];		//非终结符集合
var T = [];		//终结符集合
var pro_G = []; //存储拓广文法产生式

/*判断元素是否在数组中*/
/*
 * @param array value	待比较的目标数组
 * @param string arr	待比较的值
 * @return int|bool		若找到则返回位置下标,否则返回false
 * */
function is_inArray(value,arr) {
	for(var i in arr)
		if(arr[i] == value) return i;
	return false;
}

/*找出所有的V+T*/
function get_v_t(value) {
	var vt = value.join('')
				  .replace(/\$|(->)/g,'').split('');
	for(var i in vt){
		if(!is_inArray(vt[i],vt_arr))
			vt_arr.push(vt[i]);
	}
}

/*
 *	以数组方式存储产生式的左右项
 *	@param array value	待处理的产生式数组
 *	@example:
 *		S->R处理后为:
 *		pro['S'] = 'R';
 *
 * */
function storePro(value) {
	var left = [];
	for(var i in value){
		var str_L = value[i].slice(0,1);
		var str_R = value[i].slice(3,value[i].length);
		if(!is_inArray(str_L,left)){
			left.push(str_L);
			pro[str_L] = [];
		}
		pro[str_L].push(str_R);
	}
}

/*处理输入产生式中的空格*/
function rmvNull(value) {
	var newArr = [];
	for(var i in value){
		if(value[i].length){
			newArr.push(value[i]
				  .replace(/ /g,''));	//去除空格
		}
	}
	/*拓广文法*/
	newArr.unshift('$->S');
	return newArr;
}

/*获得所有的非终结符*/
function setV(value) {
	return value.replace(/(V={)|}/g,'').split(',');
}

/*获得所有的终结符*/
function setT(value) {
	return value.replace(/(T={)|}/g,'').split(',');
}

/*右边栏显示项目集范族*/
function r_dis(value){
	var str ='';
	for(var i in value){
		str += 'I['+i+']={'+value[i]+'}</br>';
	}
	$("display").innerHTML = str;
}

/*显示分析表函数*/
function my_dis() {
	var str = '';
	str += 'the action table:</br>';
	for(var i in action){
		for(var j in action[i]){
			if(action[i][j].length)
				str += 'action['+i+','+j+']='+action[i][j] + '</br>';
		}
	}
	str += 'the goto table:</br>';
	for(var i in _goto){
		for(var j in _goto[i]){
			if(_goto[i][j].length)
				str += 'goto['+i+','+j+']='+_goto[i][j] + '</br>';
		}
	}
	$("display").innerHTML = str;
}

/*获取页面中文本框的输入值,并进行相应的处理*/
function getValue() {
	var value = $("input").value.split(/\n/g);
	V = setV(value.shift());		//获得所有的非终结符
	T = setT(value.shift());		//获得所有的终结符
	value = pro_G = rmvNull(value); //去除空格并且拓广文法
	get_v_t(value);					//获取到所有的V+T
	storePro(value);				//存储拓广文法产生式
	getLR_I();				//递归产生项目集范族
	//r_dis(I);				//显示产生的项目集范族
	action_goto();			//产生action和goto表
	my_dis();				//打印action和goto表
}

/*
 *	闭包函数
 * @param array I 传递的需要求闭包的项目
 * @param array C 记录产生的闭包集合
 * @return array C	最终的闭包集合
 *
 * */
function closure(I) {
	var C = I || [];	
	/*记录闭包中的项目数*/
	var len = C.length;
	while(1){
		for(var item in C) {
			var str = C[item].slice(C[item].indexOf('.')+1,C[item].indexOf('.')+2);
			/*满足这种产生式:A->a.Bp,a*/
			if(str.length && str != ','){
				/*'.'后面是终结符则停止*/
				if(is_inArray(str,T))
					continue;
				var first = C[item].slice(C[item].indexOf('.')+2,C[item].length).replace(/,/g,'')[0];
				/*遍历拓广文法G'中产生式的左部*/
				for(var i in pro){
					/*找到以B开始的项目*/
					if(str == i){
						/*遍历出以B开始的产生式,并把他们加'.'以后加入闭包中*/
						for(var j in pro[i]){
							var yeta = i + '->.' + pro[i][j] + ',' + first;
							/*循环处理C中的每项,去重.直到C的大小不再改变*/
							if(!is_inArray(yeta,C))
								C.push(yeta);
						}
					}
				}
			}
		}
		/*大小不再改变则停止寻找闭包*/
		if(C.length > len){
			len = C.length;
		}else{
			break;
		}
	}
	return C;
}

/*
 *	交换string中两个元素的位置
 *	@function 交换'.'和其后面一个元素的位置
 * */
function changeIndex(str){
	var indx = str.indexOf('.');
	if(indx != -1){
		var str_arr = str.split('');
		var ex_str = str_arr[indx];
		str_arr[indx] = str_arr[indx+1];
		str_arr[indx+1] = ex_str;
		str = str_arr.join('');
	}
	return str;
}

/*
 *	GOTO函数
 * @param array I	闭包集合
 * @param string X	标志元素
 * @param array	J	记录可以求闭包的项目
 * @return array	返回项目J的闭包
 *
 * */
function GO(I,X) {
	var J = [];	
	for(var item in I){
		var str = I[item].slice(I[item].indexOf('.')+1,I[item].indexOf('.')+2);
		if(str == X){
			var copy_item = I[item];
			J.push(changeIndex(copy_item));
		}
	}
	return closure(J);
}

/*
 *	判断两个数组是否相等,可以不同顺序
 * @example:
 *		a = [1,3,5]; b = [3,5,1]
 *		a和b是相等的
 *
 * */
function is_eql_arr(arr_1,arr_2) {
	/*第一步就判断长度是否相等*/
	if(arr_1.length != arr_2.length)
		return false;
	/*设置标志位*/
	var flag = false;
	for(var i in arr_1){
		for(var j in arr_2){
			if(arr_1[i] == arr_2[j]){
				flag = true;
				break;
			}
		}
		if(!flag)
			return false;
		flag = false;
	}
	return true;
}

/*
 *	利用closure()和GO计算LR(1)项目集范族
 * @param boolean flag	已经产生状态的标志
 * @param int	num		当前递归的数组I项目
 * @param int   len		当到I最后一项时,判断I是否还能增加
 * @param now_item	array	目前正在递归的项目I
 *
 * */
function getLR_I() {
	/*设置一个标志*/
	var flag = false;
	var num = 0;
	var len = 0;	//while结束的标志
	/*初始化项目*/
	var now_item = closure(['$->.S,#']);
	I.push(now_item);	//I[0]

	/*递归求解项目集*/
	while(1){
		for(var vt in vt_arr){
			var _t = GO(now_item,vt_arr[vt]);
			if(_t.length){
				/*循环遍历I中的所有项,若存在则不做处理*/
				for(var all in I){
					if(is_eql_arr(_t,I[all])){
						flag = true;
						break;
					}
				}
				if(!flag) I.push(_t);
				/*清除状态标志位*/
				flag = false;
			}
		}
		now_item = I[++num];
		len = I.length;
		/*到最后一项后需要判断是结束递归还是继续递归*/
		if(num == I.length){
			if(I.length > len){
				/*递归处理I中的每项,给他们求闭包*/
				continue;
			}
			break;
		}
	}
}

/*维护两张表*/
var action = [];
var _goto = [];

/*返回相同的项目集下标*/
function get_pos(arr) {
	for(var i in I){
		if(is_eql_arr(arr,I[i]))
			return i;
	}
	return -1;
}

/*
 *	分析表的构造
 * @param array action	构造的action表
 * @param array _goto	构造的goto表
 * */
function action_goto() {
	for(var i in I){
		//需要初始化一下两张表
		action[i] = [];
		_goto[i] = [];
		/*[A->a.ap,b] in I[i] && a in T*/
		for(var j in I[i]){
			var a = I[i][j].slice(I[i][j].indexOf('.')+1,I[i][j].indexOf('.')+2);
			if(is_inArray(a,T)){
				var s = get_pos(GO(I[i],a));
				if(s > -1)
					action[i][a] = 'S'+s;
			}
			if(a == ','){
				var J = is_inArray(I[i][j].slice(0,I[i][j].indexOf('.')),pro_G);
				if(J)
					action[i][I[i][j][I[i][j].length-1]] = 'r'+J;
			}
		}
		/*GO(I[k],B) = I[i] && B in V*/
		for(var k in V){
			var go = get_pos(GO(I[i],V[k]))
			if(go > -1)
				_goto[i][V[k]] = go;
		}
		if(is_inArray('$->S.,#',I[i]))
			action[i]['#'] = 'acc';
	}
}

window.onload = function() {
	/*初始化文本框中的值*/
	(function() {
		var init = 'V={S,L,R}\nT={*,i,=}\nS->L=R\nS->R\nL->*R\nL->i\nR->L\n';
		$("input").value = init;
	})();
};
