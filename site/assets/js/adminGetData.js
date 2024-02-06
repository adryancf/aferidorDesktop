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
        keys: ["label"],
        cache: true,
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
            console.log(data);
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


  $.ajax({
      type: "GET",
      url: "assets/php/searchSetor.php",
      dataType: "json",
      success: function(response) {
        var select = $("#new_setor");

        // Preenche o select com as opções
        $.each(response, function(index, option) {
          select.append($("<option>")
          .attr("value", option.value)
          .text(option.label));
        });
      },
      error: function(error) {
        console.error("Erro no carregamento dos setores:", error);
      }
      
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

      $("#nomeFormRegistro").val(registro.nome_funcionario);
      $("#emailFormRegistro").val(registro.email);
      $("#obsFormRegistro").val(registro.obs);
      $("#numeroFormRegistro").val(registro.numero);
      $("#nome_maquinaFormRegistro").val(registro.nome_maquina);
      $("#tipoAferidorFormRegistro").val(tipo[registro.tipo_aferidor]);
      $("#tipoFormularioFormRegistro").val(tipo[registro.tipo]);
      $("#cpuFormRegistro").val(registro.processador);
      $("#placaMaeFormRegistro").val(registro.motherboard);
      $("#ramFormRegistro").val(registro.memoria_ram);
      $("#gpuFormRegistro").val(registro.placa_video);
      $("#hdFormRegistro").val(registro.hd);
      $("#driversFormRegistro").val(registro.drivers);

      // Adiciona o espaçamento
      $("#modalRegistro label").addClass("mb-2");

      //Abre o modal
      $("#modalRegistro").modal('show');
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
          // $("#new_tipo").attr("name", "tipo").val(tipo[dados.tipo_formulario]).addClass(compararDados("#new_tipo", dados.tipo_formulario, dados_bd.tipo));
          
          let tipo_contrario = dados.tipo == "d" ? "n" : "d";
          $("#new_tipo").attr("name", "tipo").append(
            `<option selected value="${dados.tipo}">${tipo[dados.tipo]}</option>
             <option value="${tipo_contrario}">${tipo[tipo_contrario]}</option> 
            `
          ).addClass(compararDados("#new_tipo", dados.tipo, dados_bd.tipo));
          
          $("#new_nome").attr("name", "nome_maquina").val(dados.nome_maquina);
          $("#new_numero").attr("name", "numero").val(dados.numero).addClass(compararDados("#new_numero", dados.numero, dados_bd.numero));
          
          $("#new_setor").append(
              `<option selected value="${dados.fk_setor}">${setores[dados.fk_setor]}</option>`
          ).addClass(compararDados("#new_setor", dados.fk_setor, dados_bd.fk_setor));
          
          $("#new_setor_funcionario").attr("name", "fk_setor_funcionario").val(setores[dados.fk_setor_funcionario]);

          $("#new_cpu").attr("name", "processador").val(dados.processador).addClass(compararDados("#new_cpu", dados.processador, dados_bd.processador));
          $("#new_ram").attr("name", "memoria_ram").val(dados.memoria_ram).addClass(compararDados("#new_ram", dados.memoria_ram, dados_bd.memoria_ram));
          $("#new_placaMae").attr("name", "motherboard").val(dados.motherboard).addClass(compararDados("#new_placaMae", dados.motherboard, dados_bd.motherboard));
          $("#new_gpu").attr("name", "placa_video").val(dados.placa_video).addClass(compararDados("#new_gpu", dados.placa_video, dados_bd.placa_video));
          $("#new_hds").attr("name", "hd").val(dados.hd).addClass(compararDados("#new_hds", dados.hd, dados_bd.hd));
          $("#new_drivers").attr("name", "drivers").val(dados.drivers).addClass(compararDados("#new_drivers", dados.drivers, dados_bd.drivers));
          
          // Dados BD
          $("#old_usuario").val(dados_bd.nome_funcionario);
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
          $("#containerComparacaoHW .row").not("#containerComparacaoHW .nao_add").addClass("my-2");

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
                ${lista_softwares_filtrados.map((software) => 
                    `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center lh-lg">
                        <span>
                          <span class="badge text-bg-warning rounded-pill">&#33</span> 
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
                      </li>`
                ).join('')}
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
          toastr["warning"](" ", "Maquina não cadastrada");
      }

      //Controle de exibição da notificação dos softwares (Exibe apenas uma vez em cada execução)
      notificacao = true;

  });

  $(document).on('click', '#alternarSW', function() {
    console.log("CLICANDO NO BOTAO ALTERNAR SW")
    $("#containerComparacaoHW").hide();
    $("#containerComparacaoSW").show();

    //Alterar Botao
    $("#alternarSW").html("Ir para Hardware");
    $("#alternarSW").attr("id", "alternarHW");

    $("#tituloModalComparacao").html("Comparação - Softwares");

    if(notificacao){
      toastr.warning('Para que os softwares sejam registrados na máquina, é importante que os adcione clicando no botão', 'Atenção!', {
        positionClass: "toast-top-right",
        tapToDismiss: false,
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
      $("#alternarHW").html("Ir para Software");
      $("#alternarHW").attr("id", "alternarSW");

      $("#tituloModalComparacao").html("Comparação - Hardware");

  });

  /* --------------------------------- EDITAR DADOS HARDWARE --------------------------------- */

  $(document).on('click', '#btnEditarDados', function() {
      
      //tira o disabled dos campos
      $("#card_hw_new input, #card_hw_new select").not("#card_hw_new #new_setor_funcionario, #card_hw_new #new_nome").prop("disabled", false);
      $("#containerComparacaoHW .row").not("#containerComparacaoHW .nao_add").addClass("my-2");

      //Alterar o botao editar para um botão de salvar
      $(this).html("Salvar");
      $("#btnCancelarMudancas").show();
      $(this).removeClass("btn-outline-info").addClass("btn-outline-success").attr("id", "btnSalvarDados");
  });

  function hiddenSalvar()
  {
    $("#card_hw_new input, #card_hw_new select").prop("disabled", true);
    $("#btnCancelarMudancas").hide();
    alteracoes = {};

    $("#btnSalvarDados").html("Editar");
    $("#btnSalvarDados").removeClass("btn-outline-success").addClass("btn-outline-info").attr("id", "btnEditarDados");
  }

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

  $(document).on('click', '#btnSalvarDados', function() {
    var index = $("#btnComparar").data("href")
    var registro = registros[index];
    

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
        }
        else{
          console.log("Nenhuma alteração foi feita");
          $('#btnCancelarMudancas').trigger('click');


        }

        hiddenSalvar();
      })   
    }
    else{
      console.log("Nenhuma alteração foi feita");
      hiddenSalvar();
    }

    //PRECISA TER DOIS hiddenSalvar por causa que o Swal.fire utiliza um evento assincrono
    //Se colocar o hiddenSalvar no final da função, ele executa antes do Swal.fire
      
      
  });
  
  //Mudando o valor de um campo do formulário de comparação
  $("#card_hw_new input, #card_hw_new select").change(function() {
      
    //VERIFICAR QUANDO MUDA O CAMPO DE NOME, POIS NESTE CASO, TEM QUE ALTERAR O SETOR DO FUNCIONARIO


    //Registra a alteração (NOME DO CAMPO -> NOVO VALOR)
    alteracoes[$(this).attr("name")] = $(this).val();
    //console.log(alteracoes);
    
    var id = $(this).attr("id");
    dado_antigo = "#old" + id.replace("new", ""); 

    //Faz a comparação com o elemento antigo
    $(this).addClass(compararDados("#"+id, $(this).val(), $(dado_antigo).val()));   

    //Atualiza a quantidade de erros
    quantificaErros();     

  });

  $(document).on('click', '#btnCancelarMudancas', function() {
    
    //Reverte as alterações
    var registro = registros[$("#btnComparar").data("href")];

    if(Object.keys(alteracoes).length){
      for(var campo in alteracoes) {
        var elemento = $('input[name="'+ campo +'"], select[name="'+ campo +'"]');
        elemento.val(registro[campo]);

        //Comparação
        var id = elemento.attr("id");
        var dadosAntigos = $("#old" + id.replace("new", "")).val();
        elemento.addClass(compararDados("#" + id, elemento.val(), dadosAntigos));
        quantificaErros();

      }
      console.log("Foram alterados os seguintes registros = ", alteracoes);
    }
    else
        console.log("Nenhuma alteração foi feita");

    hiddenSalvar();

  });

  /* --------------------------------- EDITAR SOFTWARES --------------------------------- */

  //EFEITO PARA MOSTRAR OS BOTÕES QUANDO SE PASSA O MOUSE | Localização = Dentro de cada elemento da lista de softwares
  $(document).on('mouseenter mouseleave', '#card_sfw_maquina #listaSoftware li', function() {
    
    // Garante que nenhum outro botão esteja visível antes de começar a animação
    $('#card_sfw_maquina #listaSoftware li #btnSoftware').not($(this).find("#btnSoftware")).hide();

    //O toggle altera o estado do elemento (Se estiver visivel ele esconde, se estiver escondido ele mostra)  
    $(this).find("#btnSoftware").stop().animate({
      width:'toggle'
    }, 500);

  });

  //ABRE O MODAL PARA PESQUISA DE SOFTARE | Localização = Dentro de cada elemento da lista de softwares e no canto superior direito do card
  $(document).on('click', '#btnSoftwareSearch, #Card_btnAdd', function() {
    
    //fAZ COM QUE O MODAL DE PESQUISA FIQUE EM EVIDENCIA
    $("#modalComparacao").addClass("modalSearch");
    $("#modalSearchSoftwares").modal('show');      
  });

  //REMOVE A CLASSE QUE FAZ COM QUE O MODAL DE PESQUISE FIQUE EM EVIDENCIA | Evento de quando o modal de pesquisa de softwares for fechado
  $('#modalSearchSoftwares').on('hide.bs.modal', function (e) {
    // Seu código aqui
    //console.log("Fechando");
    $("#modalComparacao").removeClass("modalSearch");
  });

  /* *---- ADICIONAR/REMOVER SOFTWARES ----* */

  //Botão de adicionar software (dentro do modal de pesquisa)
  $(document).on('click', '#modalSearchSoftwares .modal-body button', function() {
    nome_software = $("#searchSoftware").val();
    id_software = $("#id_software").val();

    //Adcionar no array de registros
    registros[$("#btnComparar").data('href')].softwaresResumido.push({id:id_software, nome:nome_software});

    //Adiciona o software na lista
    $("#card_sfw_maquina #listaSoftware").append(`
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
  $(document).on('click', '#btnEnviarModal', function() {

    //Zerar a lista
    $("#modalEnvio #listaHW").empty();
    $("#modalEnvio #listaSW").empty();

    /* ----------------------------- HARDWARES ----------------------------- */

    //Declarando como um objeto para o envio como json
    let dados_hw = {};

    //Enviar so os dados que estao diferentes
    $("#card_hw_new .is-invalid").not("#card_hw_new #new_setor,#card_hw_new #new_usuario").each(function() {
      let nome = $(this).attr("name");
      let valor = $(this).val();
      nome == "tipo" ? valor = tipo[valor] : valor = valor;
      dados_hw[$(this).attr("name")] = $(this).val();
    });

    // Armazenando os dados no próprio botão que disparou o evento
    $(this).data('dadosHWTemporario', dados_hw);

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

  //ENVIA OS DADOS PARA O BANCO DE DADOS EM DEFINITIVO | Botão "confirmar envio" dentro do modal de envio
  $(document).on('click', '#btnEnviarAlteracoes', function() {
    
    data = new Date().toLocaleDateString();

    //Atualização do hardware
    let dados_hw = $("#btnEnviarModal").data('dadosHWTemporario');

    dados_hw['data_atualizacao'] = data;
    dados_hw['id_hardware'] = registros[$("#btnComparar").data('href')].dadosMaquinaAferidor[0].id_hardware;
    dados_hw['numero'] = registros[$("#btnComparar").data('href')].numero;
    
    //Colocando os dados em formato de url para o servidor php de cadastro interprete corretamente
    //let dadosFormatados = $.param(dados_hw);

    //console.log(dadosFormatados);

    $.ajax({
      type: 'POST',
      url: '../includes/hardwares/cadastrar_aferidorDesktop.php',
      contentType: 'json',
      data: JSON.stringify(dados_hw),
      success: function(response) {
        console.log("Requisição bem-sucedida:", response);
      },
      error: function(error) {
        console.error("Erro na requisição:", error);
      },
    });

    

    //Instalação de softwares
    //Array ( [id_softwarefunc] => [fk_hardware] => 268 [fk_software] => 75 [data_instalacao] => 01/02/2024 )
    let dados_sw = registros[$("#btnComparar").data('href')].softwaresResumido.map(function (item) {
      if(item.id != null){
        return {
          fk_hardware: registros[$("#btnComparar").data('href')].dadosMaquinaAferidor[0].id_hardware,
          fk_software: item.id,
          data_instalacao: data
        };
      }
    }).filter(Boolean); //Boolean(null) é false, então filter(Boolean) efetivamente remove todos os elementos que são avaliados como false
    


    console.log("Dados de Hardware = ", dados_hw);
    console.log("Dados de Software = ", dados_sw);

    //Apos enviar mostrar um swal de sucesso e fechar o modal e dar um jeito de atualizar os dados na tela

    
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
            response.forEach(function(setor) {
                setores[setor.value] = setor.label;
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
