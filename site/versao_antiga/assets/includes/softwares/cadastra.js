function cadastrar() {
	var itens = "";
	var form=document.getElementById("formulario");
	var ligacao = "";
	for (var i=0;i<form.length;i++)
	{
	  if(form.elements[i].type == "radio"){
		  if(form.elements[i].checked == true){
			nomeItens += form.elements[i].name+";";
			itens +=  ligacao+form.elements[i].name+"="+form.elements[i].value;
			ligacao = "&";
		  }
	  }else if(form.elements[i].type == "checkbox"){
		  if(form.elements[i].checked == true){
			nomeItens += form.elements[i].name+";";
		  	itens +=  ligacao+form.elements[i].name+"="+form.elements[i].value;
			ligacao = "&";
		  }
	  }else if(form.elements[i].type == "textarea"){
		nomeItens += form.elements[i].name+";";
		itens +=  ligacao+form.elements[i].name+"="+form.elements[i].value;
		ligacao = "&";
	  }else if(form.elements[i].type == "text"){
		itens +=  ligacao+form.elements[i].name+"="+form.elements[i].value;
		ligacao = "&";
	  }else if(form.elements[i].type == "hidden"){
		itens +=  ligacao+form.elements[i].name+"="+form.elements[i].value;
		ligacao = "&";
	  }else{
		itens +=  ligacao+form.elements[i].name+"="+form.elements[i].value;
		ligacao = "&";
	  }
	}
    xmlhttp.open('post','includes/softwares/cadastrar.php',true);
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = resposta;
	//nome,fk_ninhada,pesoParto,peso15,peso30,peso45,peso60,peso90,vacinaRecombinante,vacinaAntigripal,vacinaAntirabica,fotos,status
	xmlhttp.send(itens);
}
function resposta() {
	if(xmlhttp.readyState == 1 ){
		//document.getElementById("aguarde").innerHTML = '<img src="../../imagens/loading.gif" />';
		document.getElementById("span_erromsg").innerHTML = 'Aguarde ...';
	}else if(xmlhttp.readyState == 4 ){
		if (xmlhttp.status == 200 || xmlhttp.status==0){
			var response = xmlhttp.responseText;
			document.getElementById("aguarde").innerHTML = '';
			document.getElementById("span_erromsg").innerHTML = response;
		}else if(xmlhttp.status == 404){
			document.getElementById("aguarde").innerHTML = '';
			document.getElementById("span_erromsg").innerHTML = "Pagina n&atilde;o encontrada.";
		}else{
			document.getElementById("aguarde").innerHTML = '';
			document.getElementById("span_erromsg").innerHTML = "Ocorreu um erro desconhecido.<br /> Tente novamente mais tarde, ou contate o administrador do sistema.";	
		}
	}
}
function excluir(id_,obj){
	if(confirm("Deseja realmente excluir este item?")){
		var id = id_;
		//var url = url_;
		xmlhttp.open('post','includes/softwares/excluir.php',true);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.onreadystatechange = function resposta_excluir() {
			if(xmlhttp.readyState == 1 ){
				//document.getElementById("aguarde").innerHTML = '<img src="../../imagens/loading.gif" />';
		document.getElementById("span_erromsg").innerHTML = 'Aguarde ...';
			}else if(xmlhttp.readyState == 4 ){
				if (xmlhttp.status == 200 || xmlhttp.status==0){
					var response = xmlhttp.responseText;
					document.getElementById("aguarde").innerHTML = '';
					document.getElementById("span_erromsg").innerHTML = response;
					removerLinha(obj);
				}else if(xmlhttp.status == 404){
					document.getElementById("aguarde").innerHTML = '';
					document.getElementById("span_erromsg").innerHTML = "Pagina n&atilde;o encontrada.";
				}else{
					document.getElementById("aguarde").innerHTML = '';
					document.getElementById("span_erromsg").innerHTML = "Ocorreu um erro desconhecido.<br /> Tente novamente mais tarde, ou contate o administrador do sistema.";
				}
			}
		}
		xmlhttp.send('id_software='+id);
	}
}
function removerLinha(obj) {
	// Capturamos a referência da TR (linha) pai do objeto
	var objTR = obj.parentNode.parentNode;
	// Capturamos a referência da TABLE (tabela) pai da linha
	var objTable = objTR.parentNode;
	// Capturamos o índice da linha
	var indexTR = objTR.rowIndex;
	// Chamamos o método de remoção de linha nativo do JavaScript, passando como parâmetro o índice da linha  
	objTable.deleteRow(indexTR);
} 