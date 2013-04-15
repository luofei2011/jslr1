jslr
====

javascript实现的LR(1)分析表构建

1. 通过文法的输入(只能如下的格式:).用LR(1)算法构建分析表
	* 文法目前只能支持单独的字母,后期会加入映射转换的功能如(if->con | I->C);
	* 你不需要在刚输入的时候就使用拓广文法,后期程序会自动添加
	* 最好按照给定的格式,第一行是非终结符集合,第二行是终结符集合
2. 给analysis_alo()函数传入一个string的参数(必须以'#')结尾.该函数能分析出
   此字符串是否能通过该文法分析,返回状态'acc'或则出错.
3. 该程序目前还没有操作本地文件的功能,因此若想保存数据是能手动copy
4. 函数式编程过程...没想好如何用面向对象来体现.

VERSION
====
1.0

example
====
######example 1 

	V={S,E,T}
	T={i,-,(,)}
	S->E
	E->T
	E->E-T
	T->i
	T->(E)

测试串:i-(i)-i#

######example 2 代码语法分析

文法(V代表非终结符,T代表终结符):

	V={T,N,S,C,E,B,F,G,R}
	T={s,i,d,w,o,p,f,t,u,e,r,v,n,b,y,g,[,],',(,),*,/,+,-,>,<,=}
	S->TN
	S->TN=C
	S->TN[]
	S->N=E
	S->N='s'
	S->w(B)oSp
	S->f(B)tSu
	S->f(B)tSuetSu
	S->rN
	S->r'C'
	C->i
	C->d
	C->s
	T->n
	T->b
	T->y
	T->g
	E->E+F
	E->E-F
	E->F
	F->F*G
	F->F/G
	F->G
	G->(E)
	G->N
	G->N['i']
	G->i
	G->d
	B->ERE
	R-><
	R->>
	R->=
	N->v

测试代码(参照bash语法):

	int luofei = 78
	double j = 88.3
	int a[]
	if(hao>78)then
		echo 'dslfdsfdsf'
	fi
	else then
		echo i
	fi
	while(i>4)do
		echo i
		if(i>3) then
			echo 'hello world!'
		fi
	done

README
====

实现过程更详细的解读请参考[这里](http://www.cnblogs.com/Poised-flw/archive/2013/04/13/3019385.html)

