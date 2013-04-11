<?php
	$I = $_POST['I'];
	$action = $_POST['action'];
	$goto = $_POST['goto'];
	
	//写入项目集范族
	$val =  explode('@@',$I);
	$file_T = fopen("I.txt",'wa');
	if(!$file_T)
		echo 'no such file!';
	for($i=0; $i<count($val)-1; $i++){
		$word = 'I['.$i.']={'.$val[$i].'}'."\n";
		fwrite($file_T,$word);
	}
	fclose($file_T);

	//写入action表
	$val = explode('@@',$action);
	$file_ac = fopen("action.txt",'wa');
	if(!$file_ac)
		echo 'no such file!';
	foreach($val as $value)
		fwrite($file_ac,$value."\n");
	fclose($file_ac);

	//写入goto表
	$val = explode('@@',$goto);
	$file_go = fopen("goto.txt",'wa');
	if(!$file_go)
		echo 'no such file!';
	foreach($val as $value)
		fwrite($file_go,$value."\n");
	fclose($file_go);

	//反馈信息
	echo "保存成功!";
?>
