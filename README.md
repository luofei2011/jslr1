jslr
====

javascript实现的LR(1)分析表构建
1.通过文法的输入(只能如下的格式:).用LR(1)算法构建分析表
			V={S,E,T}
			T={i,-,(,)}
			S->E
			E->T
			E->E-T
			T->i
			T->(E)
 *(1)文法目前只能支持单独的字母,后期会加入映射转换的功能如(if->con | I->C);
 *(2)你不需要在刚输入的时候就使用拓广文法,后期程序会自动添加
 *(3)最好按照给定的格式,第一行是非终结符集合,第二行是终结符集合
2.给analysis_alo()函数传入一个string的参数(必须以'#')结尾.该函数能分析出
  此字符串是否能通过该文法分析,返回状态'acc'或则出错.
3.该程序目前还没有操作本地文件的功能,因此若想保存数据是能手动copy
4.函数式编程过程...没想好如何用面向对象来体现.

VERSION
====
1.0

example
====
V={S,E,T}
	T={i,-,(,)}
	S->E
	E->T
	E->E-T
	T->i
	T->(E)
测试串:i-(i)-i#
