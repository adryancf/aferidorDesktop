let qtde_tabela = 0;

var array_softwares;
var array_hardwares;
var array_softwares_completo;

//CRIA AS TABELAS DE HARDWARE E SOFTWARE
function criarTabela(data){

  try{
    var cabecalho = Object.keys(data)[0];

    //NO CASO DO SOFTWARE, ONDE O CABELALHO É O SEGUNDO ELEMENTO DO JSON
    if(cabecalho == 0)
    {
      cabecalho = Object.values(data)[0];
      if (cabecalho.indexOf("COMPLETO")!= -1) {
        array_softwares_completo = data;
        return;
      }
      criarTabelaSoftwares(data);
    }
    else{
      criarTabelaHardwares(data);
    }

    $("#modalResultado").modal('show');
    document.getElementById('defaultOpen').click();
    $(".btn-visualizar-resultado").show();
  }
  catch(e){
    console.log('Erro ao criar a tabela = ', e);
  }

}

function criarTabelaHardwares(data){

  nomeHardwares = {
    "data_hora_cadastro": "Data do Scanner",
    "sistema_operacional": "Sistema Operacional",
    "nome_maquina": "Nome da Máquina",
    "tipo_aferidor": "Tipo de Máquina",
    "motherboard": "Placa Mãe",
    "processador": "Processador",
    "memoria_ram": "Memória RAM",
    "hd": "HD",
    "placa_video": "Placa de Vídeo",
    "drivers": "Drivers"
  }

  // Remove o cabeçalho do objeto
  let cabecalho = Object.keys(data)[0];
  delete data[Object.keys(data)[0]];

  array_hardwares = data;
  let dataArray = Object.entries(data);  // Converte o objeto em um array de arrays [chave, valor]

  //NO CASO DE JA EXISTIR UMA TABELA, REMOVO ELA
  if($("#table_hw").length){
    $("#" + cabecalho).remove();
    $("#defaultOpen").remove();
  }

  //CRIO O CONTEUDO DA TAB
  let divContainer = $('<div>').addClass('tabcontent').attr('id', cabecalho);
  let tabela = $('<table>').addClass('table table-hover shadow-sm table-bordered').attr('id', 'table_hw');
  let corpoTabela = $('<tbody>');

  $('#tab').append(
    $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').text(cabecalho).attr('id', 'defaultOpen')
  );

  dataArray.forEach(([chave, valor]) => {
    let linha = $('<tr>');
    let valor_aux = valor;

    if(chave == "data_hora_cadastro"){
      valor_aux = formatarData(valor, null, null);
    }

    if(chave == "tipo_aferidor"){
      $("#tipo").val(valor);
    }
    
    linha.append(
      $('<td>').text(nomeHardwares[chave]).addClass('fw-semibold'),
      $('<td>').html(valor_aux)
    );
    
    corpoTabela.append(linha);
  });

  tabela.append(corpoTabela);
  divContainer.append(tabela);
  $('#bodyTab').append(divContainer);
}

function criarTabelaSoftwares(data){

  let cabecalho = Object.values(data)[0];
  delete data[Object.keys(data)[0]];

  let dataArray = Object.entries(data);
  array_softwares = data;

  //NO CASO DE JA EXISTIR UMA TABELA, REMOVO ELA
  if($("#table_sw").length){
    $("#" + cabecalho).remove();
    $(".tablinks").not("#defaultOpen").remove();
  }

  //CRIO O CONTEUDO DA TAB
  let divContainer = $('<div>').addClass('tabcontent').attr('id', cabecalho);
  let tabela = $('<table>').addClass('table table-hover shadow-sm table-bordered').attr('id', 'table_sw');
  let corpoTabela = $('<tbody>');

  $('#tab').append(
    $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').text(cabecalho)
  );

  dataArray.forEach(([chave, valor]) => {
    let linha = $('<tr>');

    tabela.addClass('text-center')
    linha.append($('<td>').text(valor));      
    
    corpoTabela.append(linha);
  });

  divContainer.append(
    `<div class="alert alert-primary" role="alert">
    <h6 class="text-center mb-0 fw-500">Foram encontrados ${((array_softwares.length) - 1)} softwares!</h6>
    </div>`
  );

  tabela.append(corpoTabela);
  divContainer.append(tabela);
  $('#bodyTab').append(divContainer);
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
