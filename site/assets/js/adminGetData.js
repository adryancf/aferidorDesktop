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
function enviar_dados()
{
  
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
          url: "assets/php/searchFuncionario.php",
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
        url: "assets/php/searchFuncionario.php",
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

function compararDados(id, dado, dado_bd) {
    $(id).removeClass("is-valid is-invalid");
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
    
  atualizaDados();
  InicializarFeatures();

  let notificacao = false;

  //--------------------- EVENTOS ---------------------

  $(document).on('click', '.table tbody tr', function() {
      // Atualizar o modal
      let index = $(this).data('href');
      let registro = registros[index];
      let lista_softwares = registro.softwares.split(", ");

      $("#btnComparar").data("href", index);

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
          $("#new_usuario").attr("name", "nome_funcionario").val(dados.nome_funcionario).addClass(compararDados("#new_usuario", dados.fk_funcionario, dados_bd.fk_funcionario));
          $("#new_fk_funcionario").attr("name", "fk_funcionario").val(dados.fk_funcionario).addClass(compararDados("#new_fk_funcionario", dados.fk_funcionario, dados_bd.fk_funcionario));
          $("#new_tipo").attr("name", "tipo").val(dados.tipo).addClass(compararDados("#new_tipo", dados.tipo, dados_bd.tipo));
          $("#new_nome").attr("name", "nome_maquina").val(dados.nome_maquina);
          $("#new_numero").attr("name", "numero").val(dados.numero).addClass(compararDados("#new_numero", dados.numero, dados_bd.numero));
          $("#new_setor").val(dados.fk_setor).addClass(compararDados("#new_setor", dados.fk_setor, dados_bd.fk_setor));
          $("#new_setor_funcionario").attr("name", "fk_setor_funcionario").val(setores[dados.fk_setor_funcionario]);
          $("#new_cpu").attr("name", "processador").val(dados.processador).addClass(compararDados("#new_cpu", dados.processador, dados_bd.processador));
          $("#new_ram").attr("name", "memoria_ram").val(dados.memoria_ram).addClass(compararDados("#new_ram", dados.memoria_ram, dados_bd.memoria_ram));
          $("#new_placaMae").attr("name", "motherboard").val(dados.motherboard).addClass(compararDados("#new_placaMae", dados.motherboard, dados_bd.motherboard));
          $("#new_gpu").attr("name", "placa_video").val(dados.placa_video).addClass(compararDados("#new_gpu", dados.placa_video, dados_bd.placa_video));
          $("#new_hds").attr("name", "hd").val(dados.hd).addClass(compararDados("#new_hds", dados.hd, dados_bd.hd));
          $("#new_drivers").attr("name", "drivers").val(dados.drivers).addClass(compararDados("#new_drivers", dados.drivers, dados_bd.drivers));
          
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
            }
            else{
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

          //Adciona os softwares no card (Programas instalados na Aferidor)
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
    return $("#modalCadastro").hasClass("show");
  }

  //Editar dados do hardware - COMPARAÇÃO
  $(document).on('click', '#btnEditarDados', function() {
      
      //tira o disabled dos campos
      $("#card_hw_new input, #card_hw_new select").not("#card_hw_new #new_setor_funcionario, #card_hw_new #new_nome").prop("disabled", false);
 
      //Alterar o botao editar para um botão de salvar
      
      $("#compare_btnCancelarMudancas").show();
      $(this).removeClass("btn-primary").addClass("btn-success").attr("id", "btnSalvarDados");
      $(this).find("i").toggleClass("bi-pencil-square bi-floppy2");
  });

  //Editar dados do hardware - CADASTRO
  $(document).on('click', '#modalAdd_btnEditar', function() {
      
    //tira o disabled dos campos
    $("#card_hw_add input, #card_hw_add select").not("#card_hw_add #add_setor_funcionario, #card_hw_add #add_nome").prop("disabled", false);

    $("#add_btnCancelarMudancas").show();
    $(this).removeClass("btn-primary").addClass("btn-success").attr("id", "btnSalvarDadosAdd");
    $(this).find("i").toggleClass("bi-pencil-square bi-floppy2");
  });

  //Fecha o botão de salvar
  function hiddenSalvar(cadastro)
  {
    alteracoes = {};

    if(!cadastro){
      $("#card_hw_new input, #card_hw_new select").prop("disabled", true);
      $("#compare_btnCancelarMudancas").hide();

      $("#btnSalvarDados i").toggleClass("bi-pencil-square bi-floppy2");
      $("#btnSalvarDados").removeClass("btn-success").addClass("btn-primary").attr("id", "btnEditarDados");
    }
    else{
      $("#card_hw_add input, #card_hw_add select").prop("disabled", true);
      $("#add_btnCancelarMudancas").hide();

      //$("#btnSalvarDados").html("Editar");
      $("#btnSalvarDadosAdd i").toggleClass("bi-pencil-square bi-floppy2");
      $("#btnSalvarDadosAdd").removeClass("btn-success").addClass("btn-primary").attr("id", "modalAdd_btnEditar");
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

  $(document).on('click', '#btnSalvarDados, #btnSalvarDadosAdd', function() {
    
    var index = $("#btnComparar").data("href")
    var registro = registros[index];
    var id_btn = $(this).attr('id'); 
    var cadastro;

    if (id_btn === '#btnSalvarDados') {
      cadastro = false;
    } 
    else if (id_btn === 'btnSalvarDadosAdd') {
      cadastro = true;
    }
    

    //Verifica quais campos forem alterados
    if(Object.keys(alteracoes).length){

      Swal.fire({
        title: 'Deseja registrar as alterações?',
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
          console.log(alteracoes);

          //Envia os dados para o banco de dados
            $.ajax({
              url: "assets/php/admin/atualizarDados.php",
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

          hiddenSalvar(cadastro);
        }
        else{
          console.log("Nenhuma alteração foi feita");
          calcelarMudancas(cadastro);                  
        }
      })   
    }
    else{
      console.log("Nenhuma alteração foi feita");
      hiddenSalvar(cadastro);
    }

    //PRECISA TER DOIS hiddenSalvar por causa que o Swal.fire utiliza um evento assincrono
    //Se colocar o hiddenSalvar no final da função, ele executa antes do Swal.fire
      
      
  });
  
  //Mudando o valor de um campo do formulário de comparação
  $("#card_hw_new input, #card_hw_new select").change(function() {
      
    //VERIFICAR QUANDO MUDA O CAMPO DE NOME, POIS NESTE CASO, TEM QUE ALTERAR O SETOR DO FUNCIONARIO
    let nome = $(this).attr("name");

    //Registra a alteração (NOME DO CAMPO -> NOVO VALOR)
    alteracoes[nome] = $(this).val();

    //Obter o o fk_funcionario do registro
    if(nome == "nome_funcionario"){
      alteracoes["fk_funcionario"] = $("#card_hw_new #new_fk_funcionario").val();
      //Fazer a comparaçao com o valor antigo
      $("#new_fk_funcionario").addClass(compararDados("#new_fk_funcionario", $("#new_fk_funcionario").val(), $("#old_fk_funcionario").val()));

      //alterar setor do funcionario
    }
    
    //console.log(alteracoes);
  
    var id = $(this).attr("id");
    dado_antigo = "#old" + id.replace("new", ""); 

    //Faz a comparação com o elemento antigo
    $(this).addClass(compararDados("#"+id, $(this).val(), $(dado_antigo).val()));   

    //Atualiza a quantidade de erros
    quantificaErros();     

  });

  //Mudando o valor de um campo do formulário de cadastramento
  $("#card_hw_add input, #card_hw_add select").change(function() {
      
    //VERIFICAR QUANDO MUDA O CAMPO DE NOME, POIS NESTE CASO, TEM QUE ALTERAR O SETOR DO FUNCIONARIO
    let nome = $(this).attr("name");
    alteracoes[nome] = $(this).val();
    //Obter o o fk_funcionario do registro
    if(nome == "nome_funcionario"){
      alteracoes["fk_funcionario"] = $("#card_hw_add #add_fk_funcionario").val();
      //alterar setor do funcionario
    }
    //console.log(alteracoes);

  });

  function calcelarMudancas(cadastro)
  {
    //Reverte as alterações
    var registro = registros[$("#btnComparar").data("href")];
    
    var id_card;
    cadastro ? id_card = "#card_hw_add" : id_card = "#card_hw_new";

    if(Object.keys(alteracoes).length){
      for(var campo in alteracoes) {
        var elemento = $(id_card).find('input[name="'+ campo +'"], select[name="'+ campo +'"]');
        console.log(elemento);
        elemento.val(registro[campo]);

        //Comparação
        if(!cadastro){
          var id = elemento.attr("id");
          var dadosAntigos = $("#old" + id.replace("new", "")).val();
          elemento.addClass(compararDados("#" + id, elemento.val(), dadosAntigos));
          quantificaErros();
        }

      }
      console.log("Foram alterados os seguintes registros = ", alteracoes);
    }
    else
      console.log("Nenhuma alteração foi feita");

    hiddenSalvar(cadastro);
  }

  $(document).on('click', '#compare_btnCancelarMudancas, #add_btnCancelarMudancas', function() {
    var id = $(this).attr('id'); 
    id == 'compare_btnCancelarMudancas' ? cadastro = false : cadastro = true;
    calcelarMudancas(cadastro);

  });

  $('#modalComparacao').on('hide.bs.modal', function () {
    //Quando o modal é fechado, com o botao de salvar ativo, temos que fechar o botao e limpar as alterações
    //Localizar se existe um id btnSalvarDados
    if($("#btnSalvarDados").length){
      //Cancela todas as mudanças
      calcelarMudancas(false);

      //Volta o botao de editar
      hiddenSalvar(false);
    }

  });

  $('#modalCadastro').on('hide.bs.modal', function () {
    //Quando o modal é fechado, com o botao de salvar ativo, temos que fechar o botao e limpar as alterações
    //Localizar se existe um id btnSalvarDados
    if($("#btnSalvarDadosAdd").length){
      //Cancela todas as mudanças
      calcelarMudancas(true);

      //Volta o botao de editar
      hiddenSalvar(true);
    }

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
    nome_software = $("#searchSoftware").val();
    id_software = $("#id_software").val();

    //Adcionar no array de registros
    registros[$("#btnComparar").data('href')].softwaresResumido.push({id:id_software, nome:nome_software});

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
      
      dados_hw['data_atualizacao'] = data;
      dados_hw['numero'] = item_registro.numero;

      if(item_registro.dadosMaquinaAferidor.length){
        dados_hw['id_hardware'] = item_registro.dadosMaquinaAferidor[0].id_hardware;
      }
      else
      {
        dados_hw['fk_empresa'] = 1;
        dados_hw['data_cadastro'] = data;
      }
    
      return ajaxPost('../includes/hardwares/cadastrar_aferidorDesktop.php', dados_hw);
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
    
      return ajaxPost('../includes/softwaresfunc/cadastrar_aferidorDesktop.php', dados_sw);
    }
   
    hardwareInstalarAtualizar(registro)
      .then(function(id) {
        console.log(id);
        return instalarSoftwares(registro, id);
      })
      .then(function() {
        console.log("Todas as operações foram concluídas com sucesso.");

        //Alterar no banco de dados o atributo "enviado" para 1
        ajaxPost('assets/php/admin/alterarEnviado.php', registro.id);

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
      })
      .catch(function(error) {
        console.error("Ocorreu um erro durante o processamento:", error);
        Swal.fire({
            icon: 'error',
            title: 'Erro no envio',
            text: error
        });           
      });
  });
});

function dadosResumido(valor, index) {
    return (`<tr data-href="${index}">
        <td id="nome_funcionario"> ${valor.nome_funcionario} </td>
        <td id="email"> ${valor.email} </td>
        <td id="numero"> ${valor.numero} </td>
        <td id="data"> ${valor.data_hora_cadastro} </td>
        <td id="info"></td>
        </tr>`);

}


function atualizaDados() {

    //Obter setores
    $.ajax({
        type: "GET",
        url: "assets/php/searchSetor.php",
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
        url: 'assets/php/admin/adminGetData.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            registros = data;
            console.log(registros);

            //Separar por setores
            registros.forEach(function(valor, index) {
                
                //Verificar se o setor já existe no accordion
                id_setor = valor.fk_setor;

                accordion_setor = $("#collapse" + id_setor);
                if(accordion_setor.length > 0) {
                    
                  $("#tbody" + id_setor).append(dadosResumido(valor, index));
                  var atualizarMaquinasAferidas = "#card" + id_setor + " #maquinasAferidas";
                  var numeroMaquinas = $("#tbody" + id_setor + " tr").length;
                  $(atualizarMaquinasAferidas).html(numeroMaquinas);
                  
                  var badgeAtualizar = $("#badgeAtualizar" + id_setor);
                  var badgeCadastrar = $("#badgeCadastrar" + id_setor);

                  if(valor.dadosMaquinaAferidor.length >= 1)
                      badgeAtualizar.html(parseInt(badgeAtualizar.html()) + 1);
                  else
                      badgeCadastrar.html(parseInt(badgeCadastrar.html()) + 1);               
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
                                        <button class="w-25 btn btn-outline-info fw-bold shadow-sm">
                                          Atualizar Máquina
                                          <span class="badge text-bg-dark fw-bold" id="badgeAtualizar${id_setor}">0</span>
                                        </button>
                                      </div>
                                    </div>

                                    <div class="row text-center my-2">
                                      <div class="col">
                                        <button class="w-25 btn btn-outline-success fw-bold shadow-sm">
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
                                <th scope="col">Número da Máquina</th>
                                <th scope="col">Data da aferição</th>
                                <th scope="col">Infos</th>
                              </tr>
                            </thead>
                            <tbody id="tbody${id_setor}">
                              ${dadosResumido(valor, index)}
                            </tbody>
                          </table>                                 
                        </div>
                      </div>
                    </div>`
                  );

                  valor.dadosMaquinaAferidor.length >= 1 ? $("#badgeAtualizar" + id_setor).html(1) : $("#badgeCadastrar" + id_setor).html(1);
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
        url: "assets/php/admin/searchSoftwares.php",
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
