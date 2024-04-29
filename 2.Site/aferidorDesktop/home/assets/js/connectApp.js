var socket;
var temporizador = 0;
var intervalId;

var loading = false;
var cliqueInicio = true;
var fecharApp = true;

const intervalo_conexao = 2000;

const time_noticacao = 500;


function showConnected() {
  $('.connected').show();
  $('.connecting').hide();
  $('.offline').hide();

  loading = false;

  //Card de ações do usuário
  $("#abrirApp").hide();
  $("#continuarModalAbertura").attr("disabled", false);
  $("#scanApp").show();

  //Configuração do modal de inicio
  $("#aviso_conexao").hide();
  $("#sucesso_conexao").show();
  $("#btnDonwload").hide();
  $("#btnConectarModal").hide();

  //Fechar todos os modais do SweetAlert abertos
  while(Swal.isVisible()){
    Swal.close();
  }


}

function showConnecting() {
  $('.connected').hide();
  $('.connecting').show();
  $('.offline').hide();

  //Começa o loading e desativa o botao de abrir, pois o usuario ja clicou
  loading = true;
  $("#continuarModalAbertura").attr("disabled", true);
  $("#abrirApp").text("Abrindo o aplicativo...");
  $("#abrirApp").attr("disabled", true);
}

function showOffline() {
  $('.connected').hide();
  $('.connecting').hide();
  $('.offline').show();

  loading = false;
  
  //Quando essa função for chamada após o primeiro clique, o card volta ao estado inicial, porem, com o texto do botão alterado
  if(!cliqueInicio){
    $("#scanApp").hide();

    //Btn para abrir o aplicativo
    $("#abrirApp").text("Abrir aplicativo");
    $("#abrirApp").attr("disabled", false);
    $("#abrirApp").show();
  }
  else{
    $("#abrirApp").text("Comece já!");
  }

  //Configuração modal Inicio (padrão)
  $("#continuarModalAbertura").attr("disabled", false);
  $("#aviso_conexao").show();
  $("#sucesso_conexao").hide();
  $("#btnDonwload").show();
}

//So executo essa função quando quero recarregar a pagina com o app aberto
function recarregarPagina(){
  fecharApp = true;
  location.reload();
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
  
  //Exibir a mensagem de boas vindas
  if(!Cookies.get('naoMostrarMsgBoasVindas')){
    $("#modalBoasVindas").modal('show');
    //$("#toast-BoasVindas").toast('show');
  }


  showOffline();
  $("#btnConectarModal").hide();

  //Quando a página é recarregada ou fechada o app é fechado. 
  $(window).on('beforeunload', function() {
    //window.location.href chama o beforeunload também, por isso a variável fecharApp, para garatir que so vai ser fechado quando a pagina for realmente recarregada ou fechada
    if(fecharApp){
      console.log("Fechando o app");
      enviarMensagem("close_app");
    }
  });

});

//Aparencia do modal de inicio no modo em que o sistema abre o aplicativo automaticamente (modo padrão)
function modalInicio_modoAberturaAutomatica(){
  $("#aviso_conexao").show();
  $("#aviso_download").hide();

  $("#instrucaoModalInicio").text('Clique em "Abrir" e aguarde enquanto o programa inicia e estabelecemos a conexão com ele.').removeClass("conexaoManual");
  $(".status-container").removeClass("conexaoManualStatus")
  $("#tituloModalInicio").text("Abrindo o programa no seu computador...");
  $("#btnDonwload").show();
  $("#continuarModalAbertura").text("Continuar");
}

//Aparencia do modal de inicio no modo em que o usuario escohe abrir o aplicativo
function modalInicio_modoAberturaManual(){
  $("#instrucaoModalInicio").text("Você escolheu o modo manual, então, abra o programa e aguarde enquanto estabelecemos a conexão com ele...").addClass("conexaoManual");
  $(".status-container").addClass("conexaoManualStatus");
  $("#tituloModalInicio").text("Abra o programa no seu computador");
  $("#aviso_conexao").hide();
  $("#btnDonwload").hide();
  $("#continuarModalAbertura").text("Continuar");
}

//Aparencia do modal de inicio quando o usuario sai/fecha o poup-up de falha na conexao 
function modalInicio_modoSemConexao(){
  $("#instrucaoModalInicio").text("Não foi selecionada nenhuma tentativa de reconexão. Por favor, feche esta tela ou recarregue a página e tente novamente").addClass("conexaoManual");
  $(".status-container").addClass("conexaoManualStatus");
  $("#tituloModalInicio").text("Não conseguimos nos conectar ao programa...");
  $("#aviso_conexao").hide();
  $("#aviso_download").show();
  $("#btnDonwload").show();
  $("#continuarModalAbertura").text("Continuar");

}

//Aparencia do modal de inicio quando o usuario perde a conexao com o aplicativo e o modal de inicio esta aberto
//Caso: A pessoa fez o processo de abertura, conectou-se ao app, mas ai fechou o app sem clicar em continuar e sair do modal de inicio
function modalInicio_modoPerdaConexao(){
  $("#tituloModalInicio").text("Perdemos a conexão com o programa...");
  $("#instrucaoModalInicio").html("Parece que você perdeu a conexão com o programa. Por favor, feche esta tela e clique em <b>Abrir aplicativo</b> para iniciar o processo novamente").addClass("conexaoManual");
  $(".status-container").addClass("conexaoManualStatus");
  $("#aviso_conexao").hide();
  $("#aviso_download").hide();
  $("#btnDonwload").hide();
  $("#continuarModalAbertura").text("Fechar");
}

function finalizarTentivasConexao(){
  clearInterval(intervalId);
  temporizador = 0;
}

function tentandoConectarAppPorTempoDeterminado(tempo_max_conexao){
  showConnecting();

  // O site tenta se conectar com o aplicativo por 30s
  intervalId = setInterval(function() {
      
      //Altero o timeout da notificação para nao ficar exibindo em loop
      if (temporizador >= tempo_max_conexao) {
        console.log("Limite de tempo atingido. Não foi possível conectar.");
        
        // Atualiza o estado de carregamento e limpa o intervalo
        finalizarTentivasConexao();

        // Exibe uma mensagem de erro ao usuário
        Swal.fire({
          title: 'Poxa... Não conseguimos conectar!',
          text: 'Verifique se o aplicativo foi aberto automaticamente e se você autorizou a abertura pelo navegador.',
          icon: 'error',
          confirmButtonText: 'Tentar abrir novamente',
          showDenyButton: true,
          denyButtonText: 'Tentar conectar manualmente',
          denyButtonColor: "gray",
          footer: 'Se preferir, você também pode abrir o programa manualmente e tentar conectar.',
          customClass: {
            confirmButton: 'btn btn-primary',
            denyButton: 'btn btn-outline-secondary',
            popup: 'width-auto'
          }

        }).then((result) => {
            if (result.isConfirmed) {
              $("#abrirApp").click();
              return;
            }else if(result.isDenied){
              tentandoConectarAppPorTempoDeterminado(10000);

              if(!$("#modalInicio").hasClass("show")){
                $("#modalInicio").modal("show");
              }

              modalInicio_modoAberturaManual();
              return;
            }
            else{
              showOffline();
              if(!$("#modalInicio").hasClass("show")){
                $("#modalInicio").modal("show");
              }
              modalInicio_modoSemConexao();
              //Adcionar o botao para conectar
              //$("#btnConectarModal").show();
            }

        });
      } else {
          // Inicia a conexão WebSocket e atualiza o temporizador
          conexaoWebSocket();
          temporizador += intervalo_conexao;
          console.log(temporizador, " segundos");
      }
  }, intervalo_conexao);

}

//ABERTURA DO MODULO NO COMPUTADOR DO CLIETNE
$("#abrirApp").click(function() {
  
  //EFEITO PARA DAR A ENTENDER QUE ESTA SE INICIANDO OUTRO PROCESSO (SE TIVER ABERTO, ELE FECHA E ABRE NOVAMENTE)
  // if ($("#modalInicio").hasClass('show')) {
  //   // Quando o modal for completamente fechado, abra-o novamente
  //   $("#modalInicio").on('hidden.bs.modal', function (e) {
  //     $("#modalInicio").off('hidden.bs.modal'); // Remove o manipulador para evitar chamadas duplicadas
  //     $("#modalInicio").modal("show");
  //   });

  //   // Fecha o modal
  //   $("#modalInicio").modal("hide");
  // } else {
  //   // Se o modal não estiver visível, abra-o
  //   $("#modalInicio").modal("show");
  // }

  modalInicio_modoAberturaAutomatica();
  $("#modalInicio").modal("show");

  fecharApp = false;
  window.location.href = 'aferidordesktop://open';
  tentandoConectarAppPorTempoDeterminado(20000);

  if(cliqueInicio){
    cliqueInicio = false;
  }

});

$("#btnDownloadIconeAjuda").click(function(){
  Swal.fire({
    title: "Qual arquivo você deseja baixar?",
    confirmButtonText: "Instalador",
    showDenyButton: true,
    denyButtonText: "Executável (portátil)",
    footer: "O executável portátil não requer instalação e pode ser executado diretamente.",
    customClass: {
      confirmButton: 'btn btn-primary',
      denyButton: 'btn btn-outline-secondary',
      popup: 'width-auto'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      $("#btnDonwload").click();
    } else if (result.isDenied) {
      // Executar o download
      var url = "../download/executavel_AferidorDesktop.exe";
      var link = $("<a>").attr('href', url).appendTo('body');
      link[0].click();
      link.remove();
      
      Swal.fire({
        title: "O aferidorDesktop já está sendo baixado!.",
        text: "Para usar essa versão, basta executar o arquivo baixado, recarregar o site e clicar em 'Comece já'.",
        icon: "success",
        confirmButtonText: "Entendi! Recarregar página"
      }).then((result) => {
        if (result.isConfirmed) {
          //$("#modalInicio").modal("show");
          location.reload();
        }
      });

    }

  })
});

$("#btnDonwload").click(function() {

  //Para as tentativas de conexão
  finalizarTentivasConexao();

  //Colocar um delay para deixar offline
  setTimeout(function(){
    showOffline();
  }, 500);


  $("#modalInicio").modal("hide");

  // Executar o download
  var url = "../download/instalador_AferidorDesktop.exe";
  var link = $("<a>").attr('href', url).appendTo('body');
  link[0].click();

  link.remove();

  Swal.fire({
    title: "Seu aplicativo já está sendo baixado! Leia atentamente as instruções abaixo.",
    html: `
    <div class="mx-4">
      
      <div class="justify-content-center d-flex my-4 gap-2 fs-6">
        <div class="alert alert-warning shadow d-flex align-items-center col-6">
          <span class="">Se um aviso informando que a <b>transferência é insegura</b> ou algo semelhante aparecer, clique em <b>"Manter"</b> para concluir o download.</span>
        </div>

        <div class="alert alert-warning shadow d-flex align-items-center col-6">
          <span class="">Durante a instalação, se você ver uma mensagem dizendo <b>"O Windows protegeu o computador"</b>, clique em <b>"Mais informações"</b>. Em seguida, clique em <b>"Executar mesmo assim"</b> para continuar.</span>
        </div>
      </div>

      <h5 class="mt-3">Após concluir o download, abra o instalador e prossiga com a instalação. Ao finalizar, <b>atualize o site e inicie novamente</b>.</h5>

      <span class="fw-bold mb-0 mt-5">Em caso de dúvidas, clique no Saiba Mais para ter acesso a um passo a passo completo.</span>
    </div>`,
    showDenyButton: true,
    confirmButtonText: "Saiba mais",
    denyButtonText: `<i class="bi bi-arrow-clockwise"></i>`,
    denyButtonColor: "gray",
    confirmButtonColor: "navy",
    icon: "success",
    footer: 'Caso o donwload não inicie, <a href="../download/downloadBckp/instalador_AferidorDesktop">Clique aqui</a>',
    width: "80%"
  }).then((result)=> {
    if(result.isDenied){
      recarregarPagina();
    }
    else{
      $("#modalAjuda").modal("show");
    }
  });
});

$("#scanApp").click(function() {
  $(this).html(`<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Analisando...`);
  
  $(this).attr("disabled", true);
  enviarMensagem("scan_system");
});

$("#btnInicioTuor, #refazerTuorInicio").click(function(){
  console.log("Iniciar");
  $("#modalBoasVindas").modal("hide");

  //Recolher o modal/toast
  $("#toast-BoasVindas").toast('hide');

  //TOUR
  introJs().setOptions({
    nextLabel: 'Próximo',
    prevLabel: 'Anterior',
    doneLabel: 'Finalizar tour',
    overlayOpacity: 0.3,
    // dontShowAgain: true,
    // dontShowAgainLabel: 'Não mostrar novamente',
    steps: [{
      title: 'Bem-vindo!',
      intro: '<p>Olá! Seja bem-vindo ao <b>Aferidor Desktop</b>.<p> <span>Vamos fazer um tour para que você conheça as funcionalidades do sistema.</span>'
    },
    {
      title: 'Botão de Inicio',
      element: $("#abrirApp")[0],
      intro: '<p>Ao clicar neste botão, você <b>começará</b> o processo de aferição.</p><span>Este botão <b>abre</b> o aplicativo necessário para iniciar o processo.</span>'
    },
    {
      title: 'Status de Conexão',
      element: $(".status-container")[0],
      intro: '<p>Neste local, você poderá acompanhar o status da conexão com o aplicativo.</p><span>O processo só funcionará quando indicar <b>"Conectado"</b>.</span>'
    },
    {
      title: 'Ajuda',
      element: $(".floating-help-button")[0],
      intro: '<p>Este botão oferece acesso a recursos úteis para você!</p> Aqui, você encontrará um <b>guia de uso completo</b>, o link direto para <b>baixar nosso programa</b>, um link para nossa <b>pesquisa de satisfação</b> e a possibilidade de refazer este tuor.</p>'
    },
    {
      title: 'Obrigado!',
      intro: '<p>Esperamos que você tenha uma ótima experiência com o <b>Aferidor Desktop</b>.</p> <span>Se precisar de ajuda com o processo, <b>acesse o guia</b> através do botão de ajuda.</span>'
    }
  ]
  }).start();


});

$("#naoMostrarMsgBoasVindas").click(function(){
  
  //Adcionar um cookie para não mostrar mais
  Cookies.set('naoMostrarMsgBoasVindas', 'true', { expires: 365 });
  $("#modalBoasVindas").modal("hide");
});
  
//Gerencia a conexao com o WebSocket
function conexaoWebSocket() {

    console.log("Iniciando conexão WebSocket...");

    const servidorWebSocketURL = 'ws://localhost:8181';
    socket = new WebSocket(servidorWebSocketURL);

    //Posso fazer uma pilha para gerenciar as tentativas de conexão
    //Enquanto tiver um item na pilha, não deixar conectar

    socket.onopen = function(event) {
      console.log('Conexão WebSocket aberta:', event);
      socket.send("Cliente conectado!");
      fecharApp = true;

      //Criar um sessioStorage para a hora da conexão
      var data = new Date();
      sessionStorage.setItem("conectado", data.getTime());

      showConnected();

      toastr.clear();
      setTimeout(function() {

        // Exiba o pop-up personalizado
        toastr.success('Clique no botão Scan e inicie o processo!', 'Você está conectado!', {
          positionClass: "toast-top-right",
          tapToDismiss: true,
          "preventDuplicates": true

        });

      }, time_noticacao);

      //Para as tentativas de conexão
      finalizarTentivasConexao();
    };

    socket.onmessage = function(event) {

      //Interpretar a mensagem recebida
      try{
        var json_recebido = JSON.parse(event.data);
        //console.log('Json Recebido = ', json_recebido);
        //console.log(qtde_tabela);

        criarTabela(json_recebido);
      }
      catch{
        if((event.data).includes("ERRO"))
        {
          Swal.fire({
            title: "Erro na análise do aferidorDesktop!",
            html: `<p class="mb-0">Por favor, tente realizar o procedimento <b>novamente</b> ou entre em contato com o departamento de T.I.</p>`,
            icon: "error",
            confirmButtonText: "Tente Novamente",
            confirmButtonColor: "navy",
            footer: 'O log do erro foi salvo na pasta documentos do seu computador.',
            width:  '50%'
          }).then((result)=> {
            if(result.isConfirmed){
              //Recarregar a página
              recarregarPagina();
            }
          });
        }

        //Gerenciar barra de progresso
        if(event.data == "FIM"){
          $("#scanApp").html("Escanear novamente");
          $("#scanApp").attr("disabled", false);
        }

        //console.log('Mensagem Recebida = ', event.data);
      }
        
    };

    socket.onclose = function(event) {
      if (!loading){

        // Atualiza o estado de carregamento e limpa o intervalo
        finalizarTentivasConexao();
        showOffline();

        //Isso indica que a pessoa perdeu a conexão com o aplicativo ja tendo feito a conexão antes
        if(sessionStorage.getItem("conectado") != null){
          console.log("Conexão perdida com o aplicativo!");
          sessionStorage.removeItem("conectado");

          if($("#modalInicio").hasClass("show")){
            //Se o modal estiver aberto, entao precisa mostrar a mensagem no modal
            modalInicio_modoPerdaConexao();
          }
        }    

        toastr.clear();
        setTimeout(function() {
          toastr.error('Verifique se o aplicativo está aberto. Caso não, clique em "Abrir aplicativo" na página inicial!', 'Falha na conexão com o aplicativo!', {
            positionClass: "toast-bottom-full-width",
            preventDuplicates: true,
            timeOut: 10000,
            tapToDismiss: true
                  
          });
        }, time_noticacao);
      }
      else{
        console.log("Tentativa de conexão falhou. Tentando novamente em " + (intervalo_conexao/1000) + " segundos...");
      }
        
    };

    socket.onerror = function(error) {
      //console.error('Erro na conexão WebSocket:', error);

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
