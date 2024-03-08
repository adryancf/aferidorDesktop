let qtde_tabela = 0;

let array_softwares;
let array_hardwares;

nomeHardwares = {
  "data_hora_cadastro": "Data do Scanner",
  "sistema_operacional": "Sistema Operacional",
  "nome_maquina": "Nome da Máquina",
  "tipo_aferidor": "Tipo de Aferidor",
  "motherboard": "Placa Mãe",
  "processador": "Processador",
  "memoria_ram": "Memória RAM",
  "hd": "HD",
  "placa_video": "Placa de Vídeo",
  "drivers": "Drivers"
}


//CRIA AS TABELAS DE HARDWARE E SOFTWARE
function criarTabela(data){

  try{
    var cabecalho = Object.keys(data)[0];
    var hardware = true;

    //NO CASO DO SOFTWARE, ONDE O CABELALHO É O SEGUNDO ELEMENTO DO JSON
    if(cabecalho == 0)
    {
      cabecalho = Object.values(data)[0];
      if (cabecalho.indexOf("COMPLETO")!= -1) 
          return;
      hardware = false;
    }

    if(qtde_tabela == 2){
      array_hardwares = {};
      array_softwares = {};

      $(".tabcontent").remove();
      $(".tablinks").remove();

      qtde_tabela = 0;
        
    }

    delete data[Object.keys(data)[0]]; // Remove o cabeçalho do objeto

    //CRIO O CONTEUDO DA TAB
    var divContainer = $('<div>').addClass('tabcontent').attr('id', cabecalho);
    var tabela = $('<table>').addClass('table table-hover shadow-sm table-bordered');
    var corpoTabela = $('<tbody>');

    // Converte o objeto em um array de arrays [chave, valor]
    var dataArray = Object.entries(data);

    // CRIO O BOTAO DAS TABS E CRIO AS TABELAS
    if(hardware){
      $('#tab').append(
        $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').text(cabecalho).attr('id', 'defaultOpen')
      );

      array_hardwares = data;

      dataArray.forEach(([chave, valor]) => {
        var linha = $('<tr>');
        var valor_aux = valor;

        if(chave == "data_hora_cadastro"){
          valor_aux = formatarData(valor, null, null);
        }

        
        linha.append(
          $('<td>').text(nomeHardwares[chave]).addClass('fw-semibold'),
          $('<td>').html(valor_aux)
        );
        
        corpoTabela.append(linha);
      });

    }
    else{
        $('#tab').append(
            $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').text(cabecalho)
        );

        array_softwares = data;

        dataArray.forEach(([chave, valor]) => {
          var linha = $('<tr>');
    
          tabela.addClass('text-center')
          linha.append($('<td>').text(valor));      
          
          corpoTabela.append(linha);
        });

        divContainer.append(
          `<div class="alert alert-primary" role="alert">
          <h6 class="text-center mb-0 fw-500">Foram encontrados ${((array_softwares.length) - 1)} softwares!</h6>
          </div>`
        );

    }
        
    tabela.append(corpoTabela);
    divContainer.append(tabela);
    $('#bodyTab').append(divContainer);

    $("#modalResultado").modal('show');

    document.getElementById('defaultOpen').click();

    qtde_tabela = qtde_tabela + 1;
    $(".btn-visualizar-resultado").show();
  }
  catch(e){
    console.log('Erro ao criar a tabela = ', e);
  }

}


//LOGICA PARA ABRIR AS TABS E MOSTRAR O CONTEUDO (HARDWARE E SOFTWARE)
function openTab(evt, tabName) {

  //Seleciona todos os elementos com o id=tabcontent E os esconde
  tab_content = document.getElementsByClassName("tabcontent");
  for(var i = 0; i<tab_content.length; i++){
    tab_content[i].style.display = "none";
  }

  //DESATIVA TODOS OS LINKS COM A CLASSE TABLINKS
  tab_links = document.getElementsByClassName("tablinks");
  for(i = 0; i<tab_links.length; i++){
    //replace substitui a classe active por nada
    tab_links[i].className = tab_links[i].className.replace(" active", "");
  }

  //MOSTRAR A TAB ATUAL
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
