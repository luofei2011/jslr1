    // 存储四元式
var four_pro = [],

	// 存储所有出现过的值,按顺序存储.
    sy_value = [],

	// 按序存储出现的变量
	var_value = [],

	// 存储所有变量的地址
	addr_reg = [],

	// 为还原条件表达式做准备
	condition_exp = [],

    // 存储条件类型 > <
    con_type = '',

    // 记录当前的条件表达式类型
    TYPE = '',  // if/if-else/while

    // 结果回写指针
    go_step = 0,

    // 记录while开始的位置
    begin_w = 0;

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
			index: four_pro.length + 1,
            result: four_pro.length + 2 // 跳到下一句
		});

        // 记录无条件跳转的步数
        if ( TYPE === 'f' || TYPE === 'w' || TYPE === 'e' ) {
            go_step ++;
        }
	}

	// 翻译输出语句
	if ( arg.indexOf('r') != -1 ) {
		four_pro.push({
			op: 'echo',
			arg1: sy_value.pop(),
			index: four_pro.length + 1,
            result: four_pro.length + 2 // 跳到下一句
		});

        // 记录无条件跳转的步数
        if ( TYPE === 'f' || TYPE === 'w' || TYPE === 'e' ) {
            go_step ++;
        }
	}

    // 条件语句
    if ( arg.indexOf('R') != -1 ) {

        // 顺序出栈condition_exp中的内容即可 如: i < 10
        var __con = con_type + condition_exp.pop();
            con_type = '';

        var exp = condition_exp.pop();
            exp += __con; 

        // 若是while语句, 则记录开始位置
        if ( TYPE === 'w' ) {
            begin_w = four_pro.length + 1;
        }
            
        // 打印四元式
        four_pro.push({
            op: exp[1],
            arg1: sy_value.pop(),
            arg2: sy_value.pop(),
            result: four_pro.length + 3,    // if的下下一句是真入口
            index: four_pro.length + 1
        });

        // 空跳转语句
        four_pro.push({
            op: 'goto',
            result: 'XXX',
            index: four_pro.length + 1
        });
    }
}

// 回填步数
function backFill() {

    var i,
        len = four_pro.length;

    for ( i = 0; i < len; ) {
        
        // 回填第一项步数
        if ( four_pro[i].result === 'XXX' ) {
            console.log( go_step );

            // 跳到指定位置
            four_pro[i].result = four_pro[i].index + go_step + 1;
            break;
        }

        i += 1;
    }
}

// 打印四元式
function showFourPro() {

    var _result = '', i,
        len = four_pro.length;

    for ( i = 0; i < len; ) {

        _result += four_pro[i].index + ', < ' + four_pro[i].op + ', ' + ( four_pro[i].arg1 || '' ) + 
                   ', ' + ( four_pro[i].arg2 || '' ) + ', ' + ( four_pro[i].result ) + ' ></br>';
        i += 1;
    }

    $('display').innerHTML =  _result;

    // 清空中间结果, 继续执行
    four_pro = [];
    sy_value = [];
    var_value = [];
    addr_reg = [];
    condition_exp = [];
    con_type = '';
    TYPE = ''; 
    go_step = 0;
}
