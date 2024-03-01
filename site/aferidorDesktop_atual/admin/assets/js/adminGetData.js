
//FAZER UMA REQUISIÇÃO GET NO BANCO DE DADOS PARA OBTER TODOS OS DADOS
let registros;
let setores = [];
let softwaresCadastrados;

alteracoes = {};

const intervalo_polling = 5000;


tipo={
    d:"Desktop",
    n:"Notebook"
}

function inserirNomeUsuarioNav()
{
  var nome = obterNomeUsuario();
  $("#nomeUsuarioNav").text(nome);

  var login = obterLogin();
  $("#idUsuarioNav").text("Login: " + login);

}

function inicializarAutocompleteSoftware()
{
  

  // $("#searchSoftware").autocomplete({
  //   appendTo: "#modalSearchSoftwares",
  //   source: arrayCompativel,
  //   minLength: 0,
  //   select: function (event, ui) {
  //     // Set selection
  //     $('#searchSoftware').val(ui.item.label); // display the selected text
  //     $('#fk_software').val(ui.item.value); // save selected id to input
  //     return false;
  //   },
  //   focus: function(event, ui){
  //       return false;
  //   },
  // });

  //Inicializar AutoComplete e Select
  var arrayCompativel = softwaresCadastrados.map(function(item) {
    return {label:item.nome, value:item.id_software};
  });

  const autoCompleteJS = new autoComplete({ 
    selector: "#searchSoftware",
    wrapper: true,
    placeHolder: "Insira o software aqui...",
    data: {
        src: arrayCompativel,
        keys: ["label"]
        //cache: true,
    },
    
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                // Create "No Results" message element
                const message = document.createElement("div");
                // Add class to the created element
                message.setAttribute("class", "no_result");
                // Add message text content
                message.innerHTML = `<span>Não foi encontrado nenhum resultado para: "${data.query}"</span>`;
                // Append message element to the results list
                list.prepend(message);
            }
        },
        noResults: true,
        maxResults: 10,
    },
    resultItem: {
        highlight: true,
    },
    events: {
      input: {
          selection: (event) => {
              //console.log(event);
              const selection = event.detail.selection.value;
              autoCompleteJS.input.value = selection.label;
              $('#id_software').val(selection.value);
          }
      }
    }
  });
}

//Inicia autocomplete (nome_funcionario), select (setor), toast
function InicializarFeatures()
{

  //Inicializar AutoComplete e Select
  $("#new_usuario").autocomplete({
      appendTo: "#modalBodyComparacao",
      source: function(request, response) {
        $.ajax({
          url: "../common_assets/php/searchFuncionario.php",
          dataType: "json",
          data: {
            q: request.term
          },
          success: function(data) {
            //console.log(data);
            response(data);
          }
        });
      },
      minLength: 0,
      select: function (event, ui) {
        // Set selection
        $('#new_usuario').val(ui.item.label); // display the selected text
        $('#new_fk_funcionario').val(ui.item.value); // save selected id to input
        return false;
    },
    focus: function(event, ui){
        return false;
    },
  });

  //Inicializar AutoComplete e Select
  $("#card_hw_add [name='nome_funcionario']").autocomplete({
    appendTo: "#card_hw_add",
    source: function(request, response) {
      $.ajax({
        url: "../common_assets/php/searchFuncionario.php",
        dataType: "json",
        data: {
          q: request.term
        },
        success: function(data) {
          //console.log(data);
          response(data);
        }
      });
    },
    minLength: 0,
    select: function (event, ui) {
      // Set selection
      $('#card_hw_add').find('[name="nome_funcionario"]').val(ui.item.label); // display the selected text
      $('#card_hw_add').find('[name="fk_funcionario"]').val(ui.item.value); // save selected id to input
      return false;
    },
    focus: function(event, ui){
        return false;
    },
  });

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-full-width",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "2000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
}


//Adiciona uma classe de validação ou invalidação no campo do formulário de comparação
function compararCamposModalComparacao(id, dado, dado_bd) {
  $(id).removeClass("is-valid is-invalid");

  // Se os dados recebidos forem uma string, remove os espaços em branco
  if (typeof dado === "string") {
    dado = dado.trim();
  }
  if (typeof dado_bd === "string") {
    dado_bd = dado_bd.trim();
  }

  //console.log("dados:", dado, dado_bd, "id = ", id);
  return (dado == dado_bd) ? "is-valid" : "is-invalid";
}

function quantificaErros() {
    //Quantos elementos estão diferentes
    var registro_diferente = $("#card_hw_new .is-invalid").not("#card_hw_new #new_fk_funcionario").length;
    var texto = "";

    if(registro_diferente == 0) {
        $("#badgeDiferente").removeClass("text-bg-danger").addClass("text-bg-success");
        texto = "Tudo certo!";
    }else{
        $("#badgeDiferente").removeClass("text-bg-success").addClass("text-bg-danger");
        texto = registro_diferente + " diferenças";
    }

    $("#badgeDiferente").html(texto);
    $("#badgeDiferente").data("diferencas", registro_diferente);
}

function verificarSetores(setorfuncionario, setorAferido)
{
  if(setorfuncionario != setorAferido){
    $("#avisos_hw").show();
    $("#avisos_hw span").html("O setor do <strong>funcionário</strong> e o setor em que foi <strong>feito a aferição</strong> são diferentes, por favor verificar se o funcionário está em outro setor ou escolheu errado!");
  }
  else
  {
    //console.log("Setores iguais");
    $("#avisos_hw").hide();
    $("#avisos_hw span").html("");
  }
}

function filtrarSoftwares(softwareObtido, softwareAferidor) {
  /* ------------------- Explicação ------------------- 
    É CRIADO UM NOVO ARRAY COM OS SOFTWARES QUE TEM SIMALIRADE COM OS SOFTWARES AFERIDOS.
    A função filter itera sobre o array softwareObtido, e para cada software é aplicado uma função de callback (A some). Se essa função retorna true, o software é mantido no array, no caso de false, o software é removido.
    A função some itera sobre o array softwareAferidor, e retorna true se pelo menos um elemento do array satisfaz a condição. Isso é positivo porque ele não precisa verificar todos os elementos do array, ele para no primeiro que satisfaz a condição.
    Condição do SOME = A função chamada divide o primeiro parâmetro em palavras e verifica se pelo menos duas palavras estão contidas no segundo parâmetro.
  */
    console.log("Filtrando...");
    return softwareObtido.filter(software => {
    return softwareAferidor.some(aferidor => compararStrings(software, aferidor));
  });

}

//DIvidir software1 em palavras e verificar se pelo menos duas palavras estão contidas em software2
function compararStrings(software1, software2) {
  const stopWordsSoftware = [
    "para", "com", "de", "e", "o", "os", "a", "as", "um", "uns", "uma", "umas",
    "do", "da", "dos", "das", "em", "no", "na", "nos", "nas", "por", "é", "por", "sobre", "sob","-"
  ];

  const palavras = software1.trim().split(/\s+/).filter(palavra => !stopWordsSoftware.includes(palavra));
  let cont = 0;
  palavras.forEach(palavra => {
    if(software2.toLowerCase().includes(palavra.toLowerCase())){
      //console.log(software1 + "   [" + palavra + "]   " + " está contida em " + software2);
      cont++;
    }
  });

  return (cont >= 2)
  
}

$(document).ready(function () {

  inserirNomeUsuarioNav();

  $("#registrosEnviadosNav").removeClass("active")
  $("#novosRegistrosNav").addClass("active");
  $("#novosRegistrosNav").find("a").attr("aria-current", "page");

  atualizaDados();
  InicializarFeatures();

  let notificacao = false;

  function inserirDadosBtnComparar(index, type){

    $("#btnComparar").data("href", index);
    $("#btnComparar").data("type", type);
  }

  

  //--------------------- EVENTOS ---------------------

  //Evento para deixar o login no sessionStorage e assim exibir na pagina de redefinição de senha
  $("#trocarSenhaUsuario").on("click", function() {
    console.log("Clicou");
    sessionStorage.setItem("usuario", obterLogin());
  });

  $(document).on('click', '#btnAcao', function() {
    let index = $(this).closest("tr").data('href');
    let type = $(this).closest("tr").data('type');

    inserirDadosBtnComparar(index, type);

    //Clicar em comparar 
    if (type == "update"){
      $("#btnComparar").trigger("click");
    }else if(type == "register"){
      $("#btnModalCadastro").trigger("click");
    }

  });

  $(document).on('click', '.table tbody td.abrirModalDetalhes', function(event) {

      // Atualizar o modal
      //pegar o index no tr
      let index = $(this).closest("tr").data('href');
      let type = $(this).closest("tr").data('type');
      //let index = $(this).data('href');

      inserirDadosBtnComparar(index, type);

      let registro = registros[index];
      let lista_softwares = registro.softwares.split(", ");

      

      //EXIBE DINAMICAMENTE OS DADOS DA AFERIÇÃO

      $("#modalSoftwares .modal-body").empty();
      $("#modalSoftwares .modal-body").append(
          `
          <ul class="list-group">
              ${lista_softwares.map(software => `<li class="list-group-item">${software}</li>`).join('')}
          </ul>`
      );


      $("#modalRegistro input, select, textarea").val('');
      var elemento = $("#modalRegistro");

      elemento.find('[name="nome_funcionario"]').val(registro.nome_funcionario);
      elemento.find('[name="email"]').val(registro.email);
      elemento.find('[name="obs"]').val(registro.obs);
      elemento.find('[name="numero"]').val(registro.numero);
      elemento.find('[name="nome_maquina"]').val(registro.nome_maquina);
      elemento.find('[name="tipo_aferidor"]').val(tipo[registro.tipo_aferidor]);
      elemento.find('[name="tipo_formulario"]').val(tipo[registro.tipo]);
      elemento.find('[name="processador"]').val(registro.processador);
      elemento.find('[name="motherboard"]').val(registro.motherboard);
      elemento.find('[name="memoria_ram"]').val(registro.memoria_ram);
      elemento.find('[name="placa_video"]').val(registro.placa_video);
      elemento.find('[name="hd"]').val(registro.hd);
      elemento.find('[name="drivers"]').val(registro.drivers);


      // Adiciona o espaçamento
      $("#modalRegistro label").addClass("mb-2");
      
      //Mostra o botao de adcionar
      if(registro.dadosMaquinaAferidor.length > 0)
      {
        $("#btnComparar").show();
        $("#btnModalCadastro").hide();
      }
      else{
        $("#btnComparar").hide();
        $("#btnModalCadastro").show();

        toastr.warning(" ", "Maquina não cadastrada", {
          "positionClass": "toast-top-center",
          "timeOut": "7000",
          "tapToDismiss": true
        });
      }

      //Abre o modal
      $("#modalRegistro").modal('show');
  });

  function inserirDadosHWModal(local){
    var dados = registros[$("#btnComparar").data("href")];
    local.find('[name="nome_funcionario"]').val(dados.nome_funcionario);
    local.find('[name="fk_funcionario"]').val(dados.fk_funcionario);
    local.find('[name="tipo"]').val(dados.tipo);
    local.find('[name="nome_maquina"]').val(dados.nome_maquina);
    local.find('[name="numero"]').val(dados.numero);
    local.find('[name="fk_setor"]').val(dados.fk_setor);
    local.find('[name="fk_setor_funcionario"]').val(setores[dados.fk_setor_funcionario]);
    local.find('[name="processador"]').val(dados.processador);
    local.find('[name="memoria_ram"]').val(dados.memoria_ram);
    local.find('[name="motherboard"]').val(dados.motherboard);
    local.find('[name="placa_video"]').val(dados.placa_video);
    local.find('[name="hd"]').val(dados.hd);
    local.find('[name="drivers"]').val(dados.drivers);

  }  

  $('#btnModalCadastro').on('click', function() {
    var dados = registros[$("#btnComparar").data("href")];
          
    // Limpa os dados antigos
    $("#modalCadastro input, select").val('');

    inserirDadosHWModal($("#card_hw_add"));

    $("#card_hw_add label").addClass("mb-2");
 

    // --------------------------------- SOFTWARES --------------------------------- 

    //Zerar as listas
    $("#card_sfw_add #listaSoftware").empty();
    $("#card_sfw_add .card-body").empty();


    if(dados.softwares != null){
      dados.sistema_operacional ? $("#card_sfw_add #so_add").val(dados.sistema_operacional) : $("#card_sfw_add #so_add").val("Não informado");

      var lista_softwares_filtrados;
      var lista_softwares = dados.softwares.split(", ");

      //Esta condicional evita que a lista de softwares seja filtrada toda vez que o modal for aberto
      if(dados.softwaresResumido == null){
        var nomeSoftwaresCadastrados = softwaresCadastrados.map(software => software.nome);
        lista_softwares_filtrados = filtrarSoftwares(lista_softwares, nomeSoftwaresCadastrados).map(software => ({ id: null, nome: software.trim() }));
        dados.softwaresResumido = lista_softwares_filtrados;
      }
      else{
        lista_softwares_filtrados = dados.softwaresResumido;
      }

      //Adciona os softwares no card (Programas instalados na Máquina)
      var icone;
      $("#card_sfw_add #listaSoftware").append(`
          ${lista_softwares_filtrados.map(function(software) { 
              icone = software.id == null ? '<span class="badge text-bg-warning rounded-pill">&#33;</span>' : '<span class="badge text-bg-success rounded-pill">&#10003;</span>';
              
              return (`<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center lh-lg">
                  <span>
                    ${icone} 
                    <span id="nome"> ${software.nome}</span>                        
                  </span>
                  <div class="btn-group" id="btnSoftware" style="display: none;">
                    <button type="button" id="btnSoftwareSearch" class="btn btn-outline-secondary btn-sm">
                      <i class="bi bi-file-earmark-plus-fill"></i>
                    </button> 

                    <button type="button" id="btnSofwareRemove" class="btn btn-outline-secondary btn-sm">
                      <i class="bi bi-trash-fill"></i>
                    </button>    
                  </div>                         
                </li>`)
          }).join('')}
      `);
      
      //Adciona o collapse com todos os softwares
      $("#collapseSoftwaresAdd .card-body").append(
        `
        <ul class="list-group">
            ${lista_softwares.map(software => `<li class="list-group-item">${software}</li>`).join('')}
        </ul>`
      );

    }          
  });

  $('#btnComparar').on('click', function() {
      
      $("#containerComparacaoSW").hide();
      $("#containerComparacaoHW").show();

      //Alterar Botao
      $("#alternarHW").html("Ir para Software");
      $("#alternarHW").attr("id", "alternarSW");

      // Inserir dinacamente os dados do registro e do banco de dados
      var dados = registros[$("#btnComparar").data('href')];

      //Se tiver uma maquina no aferidor ele exibe os dados
      if(dados.dadosMaquinaAferidor.length > 0) {
          var dados_bd = dados.dadosMaquinaAferidor[0];
          
          // Limpa os dados antigos
          $("#modalComparacao input, select").val('').removeClass("is-valid is-invalid");
          
          $("#modalRegistro").modal('hide');
          $("#modalComparacao").modal('show');

          // Dados Novos
          $("#new_usuario").attr("name", "nome_funcionario").val(dados.nome_funcionario).addClass(compararCamposModalComparacao("#new_usuario", dados.fk_funcionario, dados_bd.fk_funcionario));
          $("#new_fk_funcionario").attr("name", "fk_funcionario").val(dados.fk_funcionario).addClass(compararCamposModalComparacao("#new_fk_funcionario", dados.fk_funcionario, dados_bd.fk_funcionario));
          $("#new_tipo").attr("name", "tipo").val(dados.tipo).addClass(compararCamposModalComparacao("#new_tipo", dados.tipo, dados_bd.tipo));
          $("#new_nome").attr("name", "nome_maquina").val(dados.nome_maquina);
          $("#new_numero").attr("name", "numero").val(dados.numero).addClass(compararCamposModalComparacao("#new_numero", dados.numero, dados_bd.numero));
          $("#new_setor").val(dados.fk_setor).addClass(compararCamposModalComparacao("#new_setor", dados.fk_setor, dados_bd.fk_setor));
          $("#new_setor_funcionario").attr("name", "fk_setor_funcionario").val(setores[dados.fk_setor_funcionario]);
          $("#new_cpu").attr("name", "processador").val(dados.processador).addClass(compararCamposModalComparacao("#new_cpu", dados.processador, dados_bd.processador));
          $("#new_ram").attr("name", "memoria_ram").val(dados.memoria_ram).addClass(compararCamposModalComparacao("#new_ram", dados.memoria_ram, dados_bd.memoria_ram));
          $("#new_placaMae").attr("name", "motherboard").val(dados.motherboard).addClass(compararCamposModalComparacao("#new_placaMae", dados.motherboard, dados_bd.motherboard));
          $("#new_gpu").attr("name", "placa_video").val(dados.placa_video).addClass(compararCamposModalComparacao("#new_gpu", dados.placa_video, dados_bd.placa_video));
          $("#new_hds").attr("name", "hd").val(dados.hd).addClass(compararCamposModalComparacao("#new_hds", dados.hd, dados_bd.hd));
          $("#new_drivers").attr("name", "drivers").val(dados.drivers).addClass(compararCamposModalComparacao("#new_drivers", dados.drivers, dados_bd.drivers));

          verificarSetores(dados.fk_setor_funcionario, dados.fk_setor);

          // Dados BD
          $("#old_usuario").val(dados_bd.nome_funcionario);
          $("#old_fk_funcionario").val(dados_bd.fk_funcionario);
          $("#old_tipo").append(`<option selected value="${dados_bd.tipo}">${tipo[dados_bd.tipo]}</option>`);
          $("#old_numero").val(dados_bd.numero);
          $("#old_setor_name").val(setores[dados_bd.fk_setor]);
          $("#old_setor").val(dados_bd.fk_setor);
          $("#old_cpu").val(dados_bd.processador);
          $("#old_ram").val(dados_bd.memoria_ram);
          $("#old_placaMae").val(dados_bd.motherboard);
          $("#old_gpu").val(dados_bd.placa_video);
          $("#old_hds").val(dados_bd.hd);
          $("#old_drivers").val(dados_bd.drivers);

          $("#containerComparacaoHW label").addClass("mb-2");
          $("#containerComparacaoHW .row").not("#containerComparacaoHW .nao_add").addClass("my-3");

          quantificaErros();

          // --------------------------------- SOFTWARES --------------------------------- 

          //Zerar as listas
          $("#card_sfw_maquina #listaSoftware").empty();
          $("#card_sfw_aferidor #listaSoftware").empty();
          $("#collapseSoftwares .card-body").empty();


          if(dados.softwares != null){
            dados.sistema_operacional ? $("#card_sfw_maquina #so_new").val(dados.sistema_operacional) : $("#card_sfw_maquina #so_new").val("Não informado");

            var lista_softwares_filtrados;
            var lista_softwares = dados.softwares.split(", ");

            //Esta condicional evita que a lista de softwares seja filtrada toda vez que o modal for aberto
            if(dados.softwaresResumido == null){
              var nomeSoftwaresCadastrados = softwaresCadastrados.map(software => software.nome);
              lista_softwares_filtrados = filtrarSoftwares(lista_softwares, nomeSoftwaresCadastrados).map(software => ({ id: null, nome: software.trim() }));
              dados.softwaresResumido = lista_softwares_filtrados;

              //Enviar a lista de softwares para o BD
              $.ajax({
                url: "assets/php/atualizarDados.php",
                type: "POST",
                data: {softwares: JSON.stringify(lista_softwares_filtrados),
                      id: dados.id},              
                success: function(response) {
                  console.log("atualizarDados.php | Requisição bem-sucedida:", response);
                },
                error: function(error) {
                  console.error("atualizarDados.php | Erro na requisição:", error);
                },
              });
              

            }
            else{
              console.log("Softwares já salvos...");
              lista_softwares_filtrados = dados.softwaresResumido;
            }
            
            //Adciona os softwares no card (Programas instalados na Máquina)
            $("#card_sfw_maquina #listaSoftware").append(`
              ${lista_softwares_filtrados.map(function(software) { 
                  icone = software.id == null ? '<span class="badge text-bg-warning rounded-pill">&#33;</span>' : '<span class="badge text-bg-success rounded-pill">&#10003;</span>';
                  
                  return (`<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center lh-lg">
                    <span>
                      ${icone} 
                      <span id="nome"> ${software.nome}</span>                        
                    </span>
                    <div class="btn-group" id="btnSoftware" style="display: none;">
                      <button type="button" id="btnSoftwareSearch" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-file-earmark-plus-fill"></i>
                      </button> 

                      <button type="button" id="btnSofwareRemove" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-trash-fill"></i>
                      </button>    
                    </div>                         
                  </li>`)
              }).join('')}
            `);
            
            //Adciona o collapse com todos os softwares
            $("#collapseSoftwares .card-body").append(
              `
              <ul class="list-group">
                  ${lista_softwares.map(software => `<li class="list-group-item">${software}</li>`).join('')}
              </ul>`
            );

          }

          //Adciona os softwares no card (Programas instalados no Aferidor)
          if(dados_bd.softwares != null){
            var lista_softwares_aferidor = dados_bd.softwares.map(software => software.nome_software);
            $("#card_sfw_aferidor #so_new").val(lista_softwares_aferidor.find(sfw => sfw.includes("Windows")));
            $("#card_sfw_aferidor #listaSoftware").append(`
                ${lista_softwares_aferidor.map(software =>
                    `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${software}</li>`
                ).join('')}
            `);
          }           
      }
      else
      {
          $("#modalComparacao").modal('hide');
          console.log("Não cadastrado");
      }

      //Controle de exibição da notificação dos softwares (Exibe apenas uma vez em cada execução)
      notificacao = true;

  });

  $(document).on('click', '#alternarSW', function() {
    console.log("CLICANDO NO BOTAO ALTERNAR SW")
    $("#containerComparacaoHW").hide();
    $("#containerComparacaoSW").show();

    //Alterar Botao
    $("#alternarSW span").html("Ir para Hardware");
    $("#alternarSW i").toggleClass("bi-microsoft bi-gpu-card");
    $("#alternarSW").attr("id", "alternarHW");

    $("#tituloModalComparacao").html("Comparação - Softwares");

    if(notificacao){
      toastr.warning('Para que os softwares sejam registrados na máquina, é importante que os adcione clicando no botão', 'Atenção!', {
        positionClass: "toast-top-right",
        tapToDismiss: true,
        "hideDuration": "7000"

      });

      notificacao = false;
    }

  });

  $(document).on('click', '#alternarHW', function() {
      console.log("CLICANDO NO BOTAO ALTERNAR HW")

      $("#containerComparacaoHW").show();
      $("#containerComparacaoSW").hide();
      

      //Alterar Botao
      $("#alternarHW span").html("Ir para Software");
      $("#alternarHW i").toggleClass("bi-microsoft bi-gpu-card");

      $("#alternarHW").attr("id", "alternarSW");

      $("#tituloModalComparacao").html("Comparação - Hardware");

  });

  /* --------------------------------- EDITAR DADOS HARDWARE--------------------------------- */

  //VERIFICA SE O MODAL DE COMPARACAO ESTÁ ABERTO
  function verificarModalCadastroAberto(){
    //return $("#modalCadastro").hasClass("show");
    console.log($("#btnComparar").data('type') == 'register');
    return ($("#btnComparar").data('type') == 'register');
  }

  //Editar dados do hardware - COMPARAÇÃO
  $(document).on('click', '#btnEditarDados', function() {
      
      //tira o disabled dos campos
      $("#card_hw_new input, #card_hw_new select").not("#card_hw_new #new_setor_funcionario, #card_hw_new #new_nome").prop("disabled", false);
 
      //Alterar o botao editar para um botão de salvar
      $("#compare_btnCancelarMudancas").show();
      $(this).removeClass("btn-primary").addClass("btn-success").attr("id", "btnSalvarDados");
      $(this).find("i").toggleClass("bi-pencil-square bi-floppy2");

      //Desabilita o botão de enviar
      $("#btnEnviarModal").prop("disabled", true);
      
  });

  //Editar dados do hardware - CADASTRO
  $(document).on('click', '#add_btnEditarDados', function() {
      
    //tira o disabled dos campos
    $("#card_hw_add input, #card_hw_add select").not("#card_hw_add #add_setor_funcionario, #card_hw_add #add_nome").prop("disabled", false);

    $("#add_btnCancelarMudancas").show();
    $(this).removeClass("btn-primary").addClass("btn-success").attr("id", "btnSalvarDadosAdd");
    $(this).find("i").toggleClass("bi-pencil-square bi-floppy2");

    //Desabilita o botão de enviar
    $("#btnCadastrar").prop("disabled", true);

  });

  //Sai do modo de edição
  function closeEditMode(cadastro)
  {
    alteracoes = {};

    if(!cadastro){
      $("#card_hw_new input, #card_hw_new select").prop("disabled", true);
      $("#compare_btnCancelarMudancas").hide();

      $("#btnSalvarDados i").toggleClass("bi-pencil-square bi-floppy2");
      $("#btnSalvarDados").removeClass("btn-success").addClass("btn-primary").attr("id", "btnEditarDados");
      $("#btnEnviarModal").prop("disabled", false);
      
    }
    else{
      $("#card_hw_add input, #card_hw_add select").prop("disabled", true);
      $("#add_btnCancelarMudancas").hide();

      //$("#btnSalvarDados").html("Editar");
      $("#btnSalvarDadosAdd i").toggleClass("bi-pencil-square bi-floppy2");
      $("#btnSalvarDadosAdd").removeClass("btn-success").addClass("btn-primary").attr("id", "add_btnEditarDados");
      $("#btnCadastrar").prop("disabled", false);

    }
  }

  //Retorna uma lista html atraves de um objeto (key: value)
  function listar(obj) {
    let listHtml = '<ul class="my-3 list-group fw-normal w-100">';
    for (const [key, value] of Object.entries(obj)) {
      listHtml += `
        <li class="list-group-item">
          <span class="fw-bold">${key}:</span> ${value}
        </li>`;
    }
    listHtml += '</ul>';
    return listHtml;
  }

  function desejaSalvarAlteracoes(cadastro)
  {
    var index = $("#btnComparar").data("href")
    var registro = registros[index];

    //Verifica quais campos forem alterados
    if(Object.keys(alteracoes).length){

      Swal.fire({
        title: 'Deseja salvar as alterações?',
        icon: 'warning',
        html: listar(alteracoes),
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          for(var campo in alteracoes) {
            //Altera o registro 
            //Para acessar propriedades dinamicamente, é necessário usar colchetes
            if(registro.hasOwnProperty(campo)){
              registro[campo] = alteracoes[campo];
            }
            else{ 
              console.log("Campo não encontrado = ", campo);
            }
            //Altera a tabela de exibição resumida (Nome ou numero da maquina)
            $("tbody tr[data-href='"+ index + "'] td#"+ campo).html(alteracoes[campo]);   
          }

          //alteracoes.index = index;
          //console.log(alteracoes);

          //Envia os dados para o banco de dados
          $.ajax({
            url: "assets/php/atualizarDados.php",
            type: "POST",
            data: {dados: JSON.stringify(alteracoes),
                  id: registro.id},              
            success: function(response) {
              console.log("atualizarDados.php | Requisição bem-sucedida:", response);
            },
            error: function(error) {
              console.error("atualizarDados.php | Erro na requisição:", error);
            },
          });

          console.log("Foram alterados os seguintes registros = ", alteracoes);

          closeEditMode(cadastro);
        }
        else{
          console.log("Nenhuma alteração foi feita");
          calcelarMudancas(cadastro);                  
        }
      })   
    }
    else{
      console.log("Nenhuma alteração foi feita");
      closeEditMode(cadastro);
    }

    //PRECISA TER DOIS closeEditMode por causa que o Swal.fire utiliza um evento assincrono
    //Se colocar o closeEditMode no final da função, ele executa antes do Swal.fire
  }

  //Faz a comparação dos campos alterados com os registros do aferidor, mantendo a interface iterativa com as alterações
  function compararCamposAposAlteracao(elementoAlterado){
    var id = elementoAlterado.attr("id");
    var elementoComparado = $("#old" + id.replace("new", ""));

    elementoAlterado.addClass(compararCamposModalComparacao("#" + id, elementoAlterado.val(), elementoComparado.val()));
    quantificaErros();
  }

  function calcelarMudancas(cadastro)
  {
    //Reverte as alterações
    var registro = registros[$("#btnComparar").data("href")];
    var id_card = cadastro ? "#card_hw_add" : "#card_hw_new";

    //Desfaz as alterações
    if(Object.keys(alteracoes).length){
      for(var campo in alteracoes) {
        var elemento = $(id_card).find('input[name="'+ campo +'"], select[name="'+ campo +'"]');
        elemento.val(registro[campo]);

        //Se for o setor, exibir ou ocultar o aviso
        if(campo == "fk_setor"){
          verificarSetores(registro.fk_setor_funcionario, registro.fk_setor);
        }

        //Comparação
        if(!cadastro){
          compararCamposAposAlteracao(elemento);
        }

      }
      console.log("Foram alterados os seguintes registros = ", alteracoes);
    }
    else{
      console.log("Nenhuma alteração foi feita");
    }

    closeEditMode(cadastro);
  }

  $(document).on('click', '#btnSalvarDados, #btnSalvarDadosAdd', function() {
    
    var id_btn = $(this).attr('id'); 
    var cadastro;

    if (id_btn === '#btnSalvarDados') {
      cadastro = false;
    } 
    else if (id_btn === 'btnSalvarDadosAdd') {
      cadastro = true;
    }
    
    desejaSalvarAlteracoes(cadastro);  
      
  });
  
  //Mudando o valor de um campo do formulário de comparação
  $("#card_hw_new input, #card_hw_new select").change(function() {
      
    var nome = $(this).attr("name");
    var novo_valor = $(this).val();

    var isNomeFuncionario = (nome == "nome_funcionario");

    //Nao deixa o campo "nome_funcionario" vazio
    if(isNomeFuncionario && novo_valor === "") {
      
      Swal.fire( "Atenção!", "A máquina precisa ter um usuário!", "warning");
      $(this).val(registros[$("#btnComparar").data("href")].nome_funcionario); //Reverte a alteração
      return;
    }

    if(isNomeFuncionario){
      alteracoes["fk_funcionario"] = $("#new_fk_funcionario").val();
      $("#new_fk_funcionario").addClass(compararCamposModalComparacao("#new_fk_funcionario", $("#new_fk_funcionario").val(), $("#old_fk_funcionario").val()));

      //alterar setor do funcionario

    }else if(nome == "fk_setor"){
      verificarSetores(registros[$("#btnComparar").data("href")].fk_setor_funcionario, novo_valor);
    }

    //Registra a alteração (NOME DO CAMPO -> NOVO VALOR)
    alteracoes[nome] = novo_valor;
    compararCamposAposAlteracao($(this));

    //console.log(alteracoes);
  });

  //Mudando o valor de um campo do formulário de cadastramento
  $("#card_hw_add input, #card_hw_add select").change(function() {
      
    //VERIFICAR QUANDO MUDA O CAMPO DE NOME, POIS NESTE CASO, TEM QUE ALTERAR O SETOR DO FUNCIONARIO
    let nome = $(this).attr("name");
    alteracoes[nome] = $(this).val();

    //Obter o o fk_funcionario do registro
    if(nome == "nome_funcionario"){
      alteracoes["fk_funcionario"] = $("#card_hw_add [name='fk_funcionario']").val();
      //alterar setor do funcionario
    }

  });

  $(document).on('click', '#compare_btnCancelarMudancas, #add_btnCancelarMudancas', function() {
    var id = $(this).attr('id'); 
    var cadastro = id == 'compare_btnCancelarMudancas' ? false : true;
    calcelarMudancas(cadastro);

  });

  $('#modalComparacao').on('hide.bs.modal', function () {
    console.log("fechando comparacao...");
    desejaSalvarAlteracoes(false);

  });

  $('#modalCadastro').on('hide.bs.modal', function () {
    console.log("fechando cadastro...");
    desejaSalvarAlteracoes(true);
    
  });

  /* --------------------------------- EDITAR SOFTWARES --------------------------------- */

  //EFEITO PARA MOSTRAR OS BOTÕES QUANDO SE PASSA O MOUSE | Localização = Dentro de cada elemento da lista de softwares
  $(document).on('mouseenter mouseleave', '#card_sfw_maquina #listaSoftware li, #card_sfw_add #listaSoftware li', function() {
    
    elemento = verificarModalCadastroAberto() ? "#card_sfw_add" : "#card_sfw_maquina";
    
    // Garante que nenhum outro botão esteja visível antes de começar a animação
    $(elemento).find('#listaSoftware li #btnSoftware').not($(this).find("#btnSoftware")).hide();

    //O toggle altera o estado do elemento (Se estiver visivel ele esconde, se estiver escondido ele mostra)  
    $(this).find("#btnSoftware").stop().animate({
      width:'toggle'
    }, 500);

  });

  //ABRE O MODAL PARA PESQUISA DE SOFTARE | Localização = Dentro de cada elemento da lista de softwares e no canto superior direito do card
  $(document).on('click', '#btnSoftwareSearch, #card_btnAdd', function() {

    //fAZ COM QUE O MODAL DE PESQUISA FIQUE EM EVIDENCIA
    if(verificarModalCadastroAberto()){
      $("#modalCadastro").addClass("modalSearch");
    }else{
      $("#modalComparacao").addClass("modalSearch");
    }
    
    $("#modalSearchSoftwares").modal('show');      
  });

  //REMOVE A CLASSE QUE FAZ COM QUE O MODAL DE PESQUISE FIQUE EM EVIDENCIA | Evento de quando o modal de pesquisa de softwares for fechado
  $('#modalSearchSoftwares').on('hide.bs.modal', function (e) {
    $("#modalCadastro").removeClass("modalSearch");
    $("#modalComparacao").removeClass("modalSearch");
  });

  /* *---- ADICIONAR/REMOVER SOFTWARES ----* */

  //Botão de adicionar software (dentro do modal de pesquisa)
  $(document).on('click', '#modalSearchSoftwares .modal-body button', function() {
    var nome_software = $("#searchSoftware").val();
    var id_software = $("#id_software").val();
    var registro = registros[$("#btnComparar").data('href')];

    //Adcionar no array de registros

    registro.softwaresResumido.push({id:id_software, nome:nome_software});
    var lista_softwares_filtrados = registro.softwaresResumido;

    //Adcionar no BD
    $.ajax({
      url: "assets/php/atualizarDados.php",
      type: "POST",
      data: {softwares: JSON.stringify(lista_softwares_filtrados),
            id: registro.id},              
      success: function(response) {
        console.log("atualizarDados.php | Requisição bem-sucedida:", response);
      },
      error: function(error) {
        console.error("atualizarDados.php | Erro na requisição:", error);
      },
    });


    //Verifica se é a tela de cadastro ou a tela de comparação
    var lista_sfw = verificarModalCadastroAberto() ? "#card_sfw_add #listaSoftware" : "#card_sfw_maquina #listaSoftware";
    
    //Adiciona o software na lista
    $(lista_sfw).append(`
      <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center lh-lg">
        <span>
          <span class="badge text-bg-success rounded-pill">&#10003;</span> 
          <span id="nome">${nome_software}</span>                          
        </span>
        <div class="btn-group" id="btnSoftware" style="display: none;">
          <button type="button" id="btnSoftwareSearch" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-file-earmark-plus-fill"></i>
          </button> 

          <button type="button" id="btnSofwareRemove" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-trash-fill"></i>
          </button>    
        </div>                         
      </li>`

    );

    //console.log("Adicionando software: ", nome_software, " com id: ", id_software);

    $("#modalSearchSoftwares").modal('hide');
  });

  //Botão de remover software (Segundo botão do grupo de botões dentro de cada elemento da lista de softwares)
  $(document).on('click', '#btnSofwareRemove', function() {

    //Remove do array de registros
    let registro = registros[$("#btnComparar").data('href')];
    
    let nome = $(this).closest('li').find('span#nome')[0].innerText;
    let index_software = registro.softwaresResumido.findIndex(sfw => (sfw.nome == nome));
    
    //console.log("Removendo: ", nome, " com index: ", index_software, " do array de softwares.")

    registro.softwaresResumido.splice(index_software, 1);

    //Remove do BD

    //Adcionar no BD
    $.ajax({
      url: "assets/php/atualizarDados.php",
      type: "POST",
      data: {softwares: JSON.stringify(registro.softwaresResumido),
            id: registro.id},              
      success: function(response) {
        console.log("atualizarDados.php | Requisição bem-sucedida:", response);
      },
      error: function(error) {
        console.error("atualizarDados.php | Erro na requisição:", error);
      },
    });

    //Remover o elemento da lista
    $(this).closest('li').remove();      

    //console.log("Resultado = ", registro.softwaresResumido);

  });

  /* --------------------------------- ENVIO --------------------------------- */

  //ABRE O MODAL DE ENVIO | Localização = Canto inferior direito do card de comparação
  $(document).on('click', '#btnEnviarModal, #btnCadastrar', function() {

    //Zerar a lista
    $("#modalEnvio #listaHW").empty();
    $("#modalEnvio #listaSW").empty();

    /* ----------------------------- HARDWARES ----------------------------- */

    //Declarando como um objeto para o envio como json
    let dados_hw = {};

    //ESSA VERIFICAÇÃO NAO FUNCIONA PQ QUANDO ABRE O MODAL DE ENVIO E ADD FECHA  
    var localDadosEnviados;
    var id_btn = $(this).attr('id');

    if(id_btn == "btnCadastrar"){
      localDadosEnviados = $("#card_hw_add input, #card_hw_add select").not("[name='fk_setor'], [name='fk_setor_funcionario'], [name='nome_funcionario'], [name='nome_maquina']");
      $("#btnCancelarEnvio").attr("data-bs-target", "#modalCadastro");
      $("#modalEnvio .btn-close").attr("data-bs-target", "#modalCadastro");
    }else
    {
      localDadosEnviados = $("#card_hw_new .is-invalid").not("#new_setor, #new_usuario, #new_setor_funcionario");
      $("#btnCancelarEnvio").attr("data-bs-target", "#modalComparacao");
      $("#modalEnvio .btn-close").attr("data-bs-target", "#modalComparacao");
    } 
    
    //Enviar so os dados que estao diferentes
    localDadosEnviados.each(function() {
      dados_hw[$(this).attr("name")] = $(this).val();
    });

    console.log(localDadosEnviados);

    // Armazenando os dados no botão
    $("#btnEnviarModal").data('dadosHWTemporario', dados_hw);

    //Adicionando os dados no modal
    let hw = Object.entries(dados_hw).map(([index, item]) => 
      `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">[${index}] - ${item}</li>`).join('');

    $("#modalEnvio #listaHW").append(`${hw}`);

    /* ----------------------------- SOFTWARES ----------------------------- */

    let sw_array = registros[$("#btnComparar").data('href')].softwaresResumido;
    let sw = sw_array.map(function (item) {
        if(item.id != null){
          return `
            <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                ${item.nome}
            </li>`;
        }
        
    }).join('');
    
    if(sw == ""){
      sw = `
      <div class="row justify-content-center">
        <div class="alert alert-danger text-center w-auto" role="alert">
          Nenhum software foi <strong>adcionando</strong>.
        </div>
      </div>`
    }

    $("#modalEnvio #listaSW").append(`${sw}`);
  });

  $(document).on('click', '#btnEnviarAlteracoes', function() {
    var data = new Date().toLocaleDateString();
    var registro = registros[$("#btnComparar").data('href')];
    var tipoEnvio;

    function ajaxPost(url, data) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: 'POST',
          url: url,
          contentType: 'json',
          data: JSON.stringify(data),
          success: function(response){
            resolve(response);
          },
          error: function(xhr, status, error) {
            reject(xhr.responseText); // Rejeita com a resposta do servidor
          }
        });
      });
    }
    
    //Atualiza ou Cadastra hardware
    function hardwareInstalarAtualizar(item_registro) {
      var dados_hw = $("#btnEnviarModal").data('dadosHWTemporario');
      
      //Se fir edição
      if(item_registro.dadosMaquinaAferidor.length){
        tipoEnvio = "update";
        dados_hw['id_hardware'] = item_registro.dadosMaquinaAferidor[0].id_hardware;
      }
      else
      {
        tipoEnvio = "register";
        dados_hw['fk_empresa'] = 1;
        dados_hw['data_cadastro'] = data;
      }

      dados_hw['data_atualizacao'] = data;
      dados_hw['numero'] = item_registro.numero;
    
      return ajaxPost('../../includes/hardwares/cadastrar_aferidorDesktop.php', dados_hw);
    }
    
    function instalarSoftwares(item_registro, id_hardware) {
      var dados_sw = item_registro.softwaresResumido.map(function (item) {
        if (item.id != null) {
          return {
            fk_hardware: id_hardware,
            fk_software: item.id,
            data_instalacao: data
          };
        }
      }).filter(Boolean);
    
      return ajaxPost('../../includes/softwaresfunc/cadastrar_aferidorDesktop.php', dados_sw);
    }
   
    hardwareInstalarAtualizar(registro)
      .then(function(id) {
        console.log(id);
        return instalarSoftwares(registro, id);
      })
      .then(function() {
        //Alterar no banco de dados o atributo "enviado" para 1
        envio = {
          id: registro.id,
          fk_usuario: obterIdUsuario(),
          tipoEnvio: tipoEnvio
        }
        return ajaxPost('assets/php/alterarEnviado.php', envio);
      })
      .then(function() {
        console.log("Todas as operações foram concluídas com sucesso.");

        Swal.fire({
          icon: 'success',
          title: 'Envio concluído',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Fechar'
        }).then(function() {
          //reload na pagaina
          location.reload();
          // $('#modalEnvio').modal('hide');
          // $('#modalComparar').modal('hide');
        });

      }).catch(function(error) {
        console.error("Ocorreu um erro durante o processamento:", error);
        Swal.fire({
            icon: 'error',
            title: 'Erro no envio',
            text: error
        });           
      });
  });
  
  
});

function dadosResumido(valor, index, atualizarMaquina) {

  // const icon_data = '<i class="bi bi-calendar me-2"></i>';
  // const icon_hora = '<i class="bi bi-clock me-1"></i>';
  //console.log(index + "=" + atualizarMaquina)

  const strTipoEnvio = atualizarMaquina ? "update" : "register";
  const classAdd = 'class="abrirModalDetalhes"'
  var iconBtnAcao = atualizarMaquina ? "bi-arrow-repeat" : "bi-database-add";

  return (`<tr data-href="${index}" data-type="${strTipoEnvio}" style="line-height: 2;">
    <td name="nome_funcionario" ${classAdd}> ${valor.nome_funcionario} </td>
    <td name="email" ${classAdd}> ${valor.email} </td>
    <td name="numero" ${classAdd}> ${valor.numero} </td>
    <td name="data" ${classAdd}> ${formatarData(valor.data_hora_cadastro)} </td>
    <td name="tipo" ${classAdd}><span class="badge text-bg-light">${tipoEnvio(strTipoEnvio)}</span></td>

    <td name="opcoes">
      <div class="btn-group" role="group" aria-label="groupBtnRegister">

        <button type="button" class="btn btn-sm btn-outline-secondary" id="btnAcao">
          <i class="bi ${iconBtnAcao}"></i>
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary" id="deletarRegistro">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    </td>

    </tr>`);

}

function atualizaDados() {

    //Obter setores
    $.ajax({
        type: "GET",
        url: "../common_assets/php/searchSetor.php",
        dataType: "json",
        success: function(response) {
            //setores = response;

            var selectComparacao = $("#new_setor");
            var selectAdd = $("#card_hw_add").find('[name="fk_setor"]');

            response.forEach(function(setor) {
                setores[setor.value] = setor.label;
                selectComparacao.append($("<option>").attr("value", setor.value).text(setor.label));
                selectAdd.append($("<option>").attr("value", setor.value).text(setor.label));
            });
        },
        error: function(error) {
            console.error("Erro no carregamento dos setores:", error);
        }
    });

    //Obter registros
    $.ajax({
        url: 'assets/php/adminGetData.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            registros = data;
            //console.log(registros);

            //Separar por setores
            registros.forEach(function(valor, index) {
                
                //Verificar se o setor já existe no accordion
                id_setor = valor.fk_setor;

                accordion_setor = $("#collapse" + id_setor);

                var atualizarMaquina = valor.dadosMaquinaAferidor.length >= 1 ? true : false;

                if(accordion_setor.length > 0) {
                    
                  $("#tbody" + id_setor).append(dadosResumido(valor, index, atualizarMaquina));

                  var cardQuantidadeRegistros = "#card" + id_setor + " #maquinasAferidas";
                  var numeroMaquinas = $("#tbody" + id_setor + " tr").length;

                  $(cardQuantidadeRegistros).html(numeroMaquinas);

                  if(atualizarMaquina)
                    $("#badgeAtualizar" + id_setor).html(parseInt(badgeAtualizar.html()) + 1);
                  else
                    $("#badgeCadastrar" + id_setor).html(parseInt(badgeCadastrar.html()) + 1);               
                }
                else{                                   
                  //Criar um item no accordion
                  $("#setoresAccordion").append(
                    `<div class="accordion-item">                      
                      <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id_setor}" aria-expanded="true" aria-controls="collapse${id_setor}">
                          ${setores[id_setor]}
                        </button>
                      </h2>
                      
                      <div id="collapse${id_setor}" class="accordion-collapse collapse" data-bs-parent="#setoresAccordion">
                        <div class="accordion-body">

                          <!-- Criar um dashboard resumindo algumas informações -->
                          <div class="card mb-3">
                            <div class="card-body" id="card${id_setor}">
                              <div class="container text-center">

                                <div class="row align-items-center">
                                  <div class="col-3">
                                    <h4>Máquinas Aferidas</h4>
                                    <p id="maquinasAferidas" class="display-1">1</p>
                                  </div>
          
                                  <div class="col">

                                    <div class="row text-center my-2">
                                      <div class="col">
                                        <button class="w-50 btn btn-outline-info fw-bold shadow-sm">
                                          Atualizar Máquina
                                          <span class="badge text-bg-dark fw-bold" id="badgeAtualizar${id_setor}">0</span>
                                        </button>
                                      </div>
                                    </div>

                                    <div class="row text-center my-2">
                                      <div class="col">
                                        <button class="w-50 btn btn-outline-success fw-bold shadow-sm">
                                          Cadastrar Máquina
                                          <span class="badge text-bg-dark fw-bold" id="badgeCadastrar${id_setor}">0</span>
                                        </button>
                                      </div>
                                    </div>

                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>

                          <table id="${index}" class ="table table-bordered table-hover text-center">
                            <thead>
                              <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Email</th>
                                <th scope="col">Máquina</th>
                                <th scope="col">Data da aferição</th>
                                <th scope="col">Tipo</th>
                                <th id="btn" scope="col">Opções</th>
                              </tr>
                            </thead>
                            <tbody id="tbody${id_setor}">
                              ${dadosResumido(valor, index, atualizarMaquina)}
                            </tbody>
                          </table>                                 
                        </div>
                      </div>
                    </div>`
                  );

                  atualizarMaquina ? $("#badgeAtualizar" + id_setor).html(1) : $("#badgeCadastrar" + id_setor).html(1);
                }   
                
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro na atualização dos dados:', status, error);
        }
    });

    //Obter softwares cadastrados
    $.ajax({
        type: "GET",
        url: "assets/php/searchSoftwares.php",
        dataType: "json",
        success: function(response) {
            //console.log(response);
            softwaresCadastrados = response;
            inicializarAutocompleteSoftware();

        },
        error: function(error) {
            console.error("Erro no carregamento dos softwares:", error);
        }
    });
}
