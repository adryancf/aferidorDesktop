//Verifica duplicidade entre maquina - funcionario 

//A excessão é nos casos do usuário selecionar as opções "Não cadastrado" e "Não localizado" e no modo de edição
//Modo de edição - O id da maquina esta na url e o mesmo é inserido via imput na página

function verificacaoDuplicidade() {

    //MODO DE EDIÇÃO
    var idHardware = document.querySelector('input[name="id_hardware"]').value;
    var edicao = false;

    if (idHardware === '') {
        // O valor de id_hardware está vazio
        console.log('Modo de cadastro');
    } else {
        // O valor de id_hardware não está vazio, ou s
        console.log('Modo de edição da maquina: ', idHardware);
        edicao = true;
    }


    //MODO DE CADASTRO

	//Verificar duplicidade
    var podeContinuar = true;
	var element = document.getElementById("fk_funcionario");
    var idFuncionario = element.value;

    if(idFuncionario != 10 && idFuncionario != 432 && !edicao){

        var a = new XMLHttpRequest();
        a.open('post','includes/hardwares/verificar.php',true);
        a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        a.send("idFuncionario=" + idFuncionario);
        
        // Defina o callback a ser chamado quando a resposta for recebida
        a.onreadystatechange = function() {
            
            if (a.readyState === 4 && a.status === 200) 
            {
                // Verifica se o nome ja existe no cadastro
                if(a.responseText == "true")
                {
                    //Se existir exibe um poup-up para confirmação
                    if(!confirm("Este usuário está cadastrado em duas máquinas! Deseja continuar?"))
                    {
                        //Se o usuario clicar em cancelar ele nao envia os dados
                        console.log("Refaça o cadastro!");
                        podeContinuar = false
                    }
                    
                
                }

                //Em caso positivo envia os dados para o cadastro
                if(podeContinuar)
                {
                    cadastrar();
                }
                    
            }

        };
    }
    else{ 
        cadastrar(); 
    } 

	
}


