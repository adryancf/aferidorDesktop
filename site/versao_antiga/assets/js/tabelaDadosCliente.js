let qtde_tabela = 0;

let array_softwares;
let array_hardwares;

//CRIA AS TABELAS DE HARDWARE E SOFTWARE
function criarTabela(data){

    //Estou usando o Jquery para criar a tabela

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
        array_hardwares.empty();
        array_softwares.empty();

        $(".tabcontent").remove();
        $(".tablinks").remove();

        qtde_tabela = 0;
        
    }

    delete data[Object.keys(data)[0]]; // Remove o cabeçalho do objeto

    if(hardware){
        $('#tab').append(
            $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').attr('id', 'defaultOpen').text(cabecalho)
        );

        array_hardwares = data;

    }else
    {
        $('#tab').append(
            $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').text(cabecalho)
        );

        array_softwares = data;

    }
        
    //CRIO O CONTEUDO DA TAB
    var divContainer = $('<div>').addClass('tabcontent').attr('id', cabecalho);
    var tabela = $('<table>').addClass('tabelaContainer');
    var corpoTabela = $('<tbody>');
        
    // Converte o objeto em um array de arrays [chave, valor]
    var dataArray = Object.entries(data);
    dataArray.forEach(([chave, valor]) => {
        var linha = $('<tr>').append(
            $('<td>').text(chave),
            $('<td>').text(valor)
        );
        corpoTabela.append(linha);
    });


    tabela.append(corpoTabela);
    divContainer.append(tabela);
    $('#bodyTab').append(divContainer);

    // Adicione a classe para ajustar o layout
    $('#containerFlex').addClass('tabelaCarregada');
    document.getElementById('tabelaContainer').style.display = 'block';
    document.getElementById('defaultOpen').click();

    qtde_tabela = qtde_tabela + 1;

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
