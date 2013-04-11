function save() {
	if(window.XMLHttpRequest){	//非IE
		var xmlhttprequest = new XMLHttpRequest();
	}else if(window.ActiveXObject){	//IE
		try{
			var xmlhttprequest = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e) {
			try{
				xmlhttprequest = new ActiveXObject("Microsoft.XMLhTTP");
			}catch(e){}
		}
	}
	
	xmlhttprequest.open("POST","save.php",false);
	xmlhttprequest.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	var msg = 'I=';
	for(var i in I)
		msg += I[i].join('')+'@@';
	msg += '&action=';
	for(var i in action)
		for(var j in action[i])
			msg += 'action['+i+','+j+']='+action[i][j]+'@@';
	msg += '&goto=';
	for(var i in _goto)
		for(var j in _goto[i])
			msg += 'goto['+i+','+j+']='+_goto[i][j]+'@@';
	xmlhttprequest.send(msg);
	alert(xmlhttprequest.responseText);

	//动态加载一个区域
	var show_msg = "你可以点这里浏览每张表:<a href='I.txt' target='_blank'>项目集范族</a>" +
						"<a href='action.txt' target='_blank'>action表</a>" +
							"<a href='goto.txt' target='_blank'>goto表</a>";
	$("show").innerHTML = show_msg;
	
}
