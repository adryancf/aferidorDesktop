

let socket;
let temporizador = 0;
let intervalId;

const tempo_max_conexao = 30000; 
const intervalo_conexao = 3000;
const time_noticacao = 600;

let loading = false;
let btn_envio = false;
let qtde_tabela = 0;

let array_softwares = [];
let array_hardwares = [];
let funcionarios = [];


function showConnected() {
    document.getElementById('connected').style.display = 'block';
    document.getElementById('connecting').style.display = 'none';
    document.getElementById('offline').style.display = 'none';
}

function showConnecting() {
    document.getElementById('connected').style.display = 'none';
    document.getElementById('connecting').style.display = 'block';
    document.getElementById('offline').style.display = 'none';
}

function showOffline() {
    document.getElementById('connected').style.display = 'none';
    document.getElementById('connecting').style.display = 'none';
    document.getElementById('offline').style.display = 'block';
}


$(document).ready(function(){
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "5000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    }

    showOffline();
    $('[data-toggle="tooltip"]').tooltip();


    btn_envio = false;
    qtde_tabela = 0;
    
    $("#fk_funcionario_text").autocomplete({
        appendTo: ".modal-body",
        source: function(request, response) {
            $.ajax({
                url: "assets/searchFuncionario.php",
                dataType: "json", // Assuming the response is in JSON format
                data: {
                    q: request.term
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 0,
        select: function (event, ui) {
            // Set selection
            $('#fk_funcionario_text').val(ui.item.label); // display the selected text
            $('#fk_funcionario').val(ui.item.value); // save selected id to input
            return false;
       },
       focus: function(event, ui){
            return false;
       },

    });
    
});


function criarTabela(data) {
    if(qtde_tabela < 50){

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
            array_hardwares = [];
            array_softwares = [];

            $(".tabcontent").remove();
            $(".tablinks").remove();

            qtde_tabela = 0;
        
        }

        if(hardware){
            $('#tab').append(
                $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').attr('id', 'defaultOpen').text(cabecalho)
            );
        }else
        {
            $('#tab').append(
                $('<button>').addClass('tablinks').attr('onclick', 'openTab(event, \'' + cabecalho + '\')').text(cabecalho)
            );
        }
        
        //CRIO O CONTEUDO DA TAB
        var divContainer = $('<div>').addClass('tabcontent').attr('id', cabecalho);
        var tabela = $('<table>').addClass('tabelaContainer');
        var corpoTabela = $('<tbody>');
        

        // Converte o objeto em um array de arrays [chave, valor]
        var dataArray = Object.entries(data);
        dataArray = dataArray.slice(1); // Remove a primeira linha (Cabeçalho)

        dataArray.forEach(([chave, valor]) => {
            var linha = $('<tr>').append(
                $('<td>').text(chave),
                $('<td>').text(valor)
            );
            corpoTabela.append(linha);

            //Adcionar no array
            if(hardware){
                array_hardwares.push([chave, valor]);
            }
            else
                array_softwares.push(valor);

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
}

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


function extrairDadosDaTabela() {
    var dadosGlobais = [];  // Array para armazenar dados de todas as tabelas

    // Percorra cada tabela
    $('.tabcontent').each(function() {
        var tabelaData = [];

        // Percorra as linhas da tabela atual
        $(this).find('tbody tr').each(function() {
            var chave = $(this).find('td:first-child').text();
            var valor = $(this).find('td:nth-child(2)').text();

            // Verifique se a linha contém dados válidos
            if (chave.trim() !== '' && valor.trim() !== '') {
                tabelaData.push({ chave: chave, valor: valor });
            }
        });

        // Adicione os dados da tabela atual ao array global
        dadosGlobais.push(tabelaData);
    });

    //console.log(dadosGlobais);
    return dadosGlobais;
}


//ABERTURA DO MODULO NO COMPUTADOR DO CLIETNE
document.getElementById('abrirApp').addEventListener('click', function() {
    
    window.location.href = 'aferidordesktop://open';

    // Define um temporizador para verificar se a tentativa de abrir foi bem-sucedida
    setTimeout(function() {

        // Se a janela ainda estiver na página, significa que o protocolo não está registrado
        if (document.hasFocus()) {

            //Poupup de alerta (SweetAlert2) com botao de download do aplicativo
            Swal.fire({
                title: 'Aplicativo não encontrado!',
                html: 'Clique no botão abaixo para baixar o nosso aplicativo.',
                icon: 'warning',
                confirmButtonText: '<i class="fa-solid fa-circle-down"></i> Baixar',
                confirmButtonColor: "#008000",
            }).then((result) => {
                if (result.isConfirmed) {
                
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: "Seu aplicativo já está sendo baixado!",
                            icon: "success",
                            showConfirmButton: false,
                            footer: 'Caso o download não tenha sido iniciado, <a href="#">Clique aqui</a>'
                        });
                    }
                }
            });

        }
        else
        {   
            loading = true;

            // O site tenta se conectar com o aplicativo por 30s
            intervalId = setInterval(function() {
                showConnecting();

                //Altero o timeout da notificação para nao ficar exibindo em loop
                if (temporizador >= tempo_max_conexao) {
                    console.log("Limite de tempo atingido. Não foi possível conectar.");
                    
                    loading = false;
                    clearInterval(intervalId);
                    temporizador = 0;

                    Swal.fire({
                        title: 'Não foi possível conectar!',
                        text: 'Verifique se o aplicativo está instalado e aberto. Caso sim, reinicie o aplicativo e tente novamente.',
                        icon: 'error',
                        confirmButtonText: 'Tentar novamente',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            iniciarConexaoWebSocket();
                        }
                        else
                        {
                            showOffline();
                        }

                    });
                } else {
                    iniciarConexaoWebSocket();
                    temporizador += intervalo_conexao;
                    console.log(temporizador, " segundos");
                }
            }, intervalo_conexao);

            console.log("terminei");
        }
    }, 100);
});

function iniciarConexaoWebSocket() {

    const servidorWebSocketURL = 'ws://localhost:8181';
    socket = new WebSocket(servidorWebSocketURL);

    socket.onopen = function(event) {
        console.log('Conexão WebSocket aberta:', event);
        socket.send("Cliente conectado!");
        loading = false;
        showConnected();

        toastr.clear();
        setTimeout(function() {

            // Exiba o pop-up personalizado
            toastr.success('Vá para o aplicativo e inicie o processo', 'Você está conectado!', {
                positionClass: "toast-top-right",
                tapToDismiss: true,
                "preventDuplicates": true

            });

        }, time_noticacao);

        //Para as tentativas de conexão
        clearInterval(intervalId);
    };

    socket.onmessage = function(event) {

        //Interpretar a mensagem recebida
        try{
            var json_recebido = JSON.parse(event.data);
            console.log('Json Recebido = ', json_recebido);
            console.log(qtde_tabela);

            criarTabela(json_recebido);
        }
        catch{
            console.log('Mensagem Recebida = ', event.data);
        }
        
    };

    socket.onclose = function(event) {
        if (!loading){
            toastr.clear();
            setTimeout(function() {
                toastr.error('Verifique se o aplicativo está aberto, reinicie o site e faça o processo novamente', 'Falha na conexão com o aplicativo!', {
                    positionClass: "toast-bottom-full-width",
                    preventDuplicates: true,
                    timeOut: 10000,
                    tapToDismiss: true
                        
                });
            }, time_noticacao);
            showOffline();


        }
        else
        {
            console.log("Tentativa de conexão falhou. Tentando novamente em 3 segundos...");
        }
        
        btn_envio = false;
    };

    socket.onerror = function(error) {
        console.error('Erro na conexão WebSocket:', error);

        btn_envio = false;

        if(!loading)
            showOffline();
    };
}

function enviarMensagem(mensagem) {

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(mensagem);
        console.log('Mensagem enviada para o APP (WebSocket):', mensagem);
    } 
    else {
        console.error('A conexão com o aplicativo não está aberta.');
    }
}

document.getElementById('conectar').addEventListener('click', function() {
    setTimeout(iniciarConexaoWebSocket, 500);
});

$("#formularioEnvio").submit(function(event) {
    
    //ENVIA REQUISÃO PARA O SERVIDOR
    //Fecha o formulario de envio
    $('.modal').modal('hide');

   // Cria um objeto JSON com os valores
   var array_infos = {
        //nome: $("#fk_funcionario_text").val(),
        fk_funcionario: $("#fk_funcionario").val(),
        email: $("#email").val(),
        numero: $("#numero").val(),
        tipo_formulario: $("#tipo").val(),
        fk_setor: $("#setor").val(),
        obs: $("#obs").val()
   };

   // Array para armazenar os objetos de promessa retornados por cada requisição Ajax
    var promises = [];
    var jsonEnvio = {
        hardwares: array_hardwares,
        softwares: array_softwares,
        infos: array_infos

    };


    // Função para criar uma promessa para uma requisição Ajax
    function sendAjaxRequest(data, type) {
        return $.ajax({
            type: 'POST',
            url: 'assets/enviarDados.php',
            dataType: 'json',
            data: JSON.stringify(data),
            headers: {
                'X-Type-Data': type
            }
        });
    }

    // Adiciona as promessas ao array
    //promises.push(sendAjaxRequest(jsonEnvio, 'Geral'));
    //promises.push(sendAjaxRequest(array_softwares, 'Software'));
    //promises.push(sendAjaxRequest(array_infos, 'Infos'));
    
    // Usa $.when para coordenar as chamadas assíncronas
    $.when.apply($, promises).then(

        // Sucesso
        function(responseInfos, responseHardware, responseSoftware) {
            console.log('Requisições concluídas com sucesso:', responseInfos, responseHardware, responseSoftware);
            

            Swal.fire({
                title: 'Os dados foram enviados!',
                text: 'Fique atento ao seu email. Em casos de dúvidas em relação aos dados, entraremos em contato!',
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            });
        },
        // Erro
        function(errorHardware, errorSoftware, errorInfos) {
            // Os argumentos aqui são os erros de cada requisição
            console.error('Erro em uma ou mais requisições:', errorInfos, errorHardware, errorSoftware);
            //Coloco num array para facilitar a manipulação
            const errorResponse = [errorHardware, errorSoftware, errorInfos]

            //Filtro o array para pegar apenas as mensagens de erro sem ser undefined
            /* ---------------------------- Explicação - ESTUDO --------------------------------------
            Uso o metodo map que percorre cada elemento do array e realiza uma função nele
            error => error?.responseText. Função de seta, recebe um parametro error e retorna o responseText dele. o '?' é para acessaar a propriedade mas se for undefined não da erro
            filter(Boolean). Filtra o array para pegar apenas os elementos que não são undefined
            join(''). Junta todos os elementos do array em uma string
            ------------------------------------------------------------------------------------------ */
            
            const msg_error = errorResponse.map(error => error?.responseText).filter(Boolean).join('');
            console.log("Mensagens de erro: " + msg_error);

            //Substituir por uma pagina de erro
            toastr.clear();
            setTimeout(function() {
                toastr.error(msg_error, 'Falha no envio ao servidor!', {
                    positionClass: "toast-bottom-full-width",
                    preventDuplicates: true,
                    timeOut: 5000,
                    tapToDismiss: true
                        
                });
            }, time_noticacao);

            Swal.fire({
                title: 'Falha no envio dos dados!',
                text: 'Atualize a página e repita o processo! Se mesmo assim não funcionar, entre em contato com o suporte',
                icon: 'error',
                confirmButtonText: 'Tentar Novamente',
                
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    );

    // Faz a requisição AJAX
    $.ajax({
        type: 'POST',
        url: 'assets/enviarDados.php',
        dataType: 'json',
        data: JSON.stringify(jsonEnvio),
        success: function(response) {
            console.log("Requisição bem-sucedida:", response);
            
            Swal.fire({
                title: 'Os dados foram enviados!',
                text: 'Fique atento ao seu email. Em casos de dúvidas em relação aos dados, entraremos em contato!',
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            });
        },
        error: function(error) {
            console.error("Erro na requisição:", error);

            //Substituir por uma pagina de erro
            toastr.clear();
            setTimeout(function() {
                toastr.error(error, 'Falha no envio ao servidor!', {
                    positionClass: "toast-bottom-full-width",
                    preventDuplicates: true,
                    timeOut: 5000,
                    tapToDismiss: true
                        
                });
            }, time_noticacao);

            Swal.fire({
                title: 'Falha no envio dos dados!',
                text: 'Atualize a página e repita o processo! Se mesmo assim não funcionar, entre em contato com o suporte',
                icon: 'error',
                confirmButtonText: 'Tentar Novamente',
                
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    });
    

    console.log("Acabei!");
    event.preventDefault();
});


//document.getElementById('btn_form_envio').addEventListener('click', function() {});
