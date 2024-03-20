var erro_email, erro_nome, erro_numero = false;

//CONFIGURAÇÃO DOS INPUTS DINAMICOS DO FORMULARIO
$(document).ready(function(){

    
  //INICIALIZA O TOOLTIP
  $('[data-bs-toggle="tooltip"]').tooltip();
  $(".invalid-feedback").show();

  //INICIALIZA O AUTOCOMPLETE DO NOME DO FUNCIONARIO
  $.ajax({
    type: "GET",
    url: "../common_assets/php/getFuncionarios.php",
    dataType: "json",
    success: function(response) {
      // Obtem o nome dos funcionarios
      var array = response.map(function(item) {
        return {label:item.nome_funcionario, value:item.id_funcionario};
      });

      //INICIALIZA O AUTOCOMPLETE DO NOME DO FUNCIONARIO
      const autoCompleteJS = new autoComplete({ 
        selector: "#fk_funcionario_name",
        wrapper: true,
        placeHolder: "Insira o seu nome aqui...",
        data: {
          src: array,
          keys: ["label"]
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
          maxResults: 15,
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
              $("#fk_funcionario_name_control").val(selection.label);
              $('#fk_funcionario').val(selection.value);
            }
          }
        }
      });
    },
    error: function(error) {
      console.error("Erro no carregamento dos funcionários:", error);
    }
  });

  //CARREGA OS SETORES NO SELECT
  $.ajax({
    type: "GET",
    url: "../common_assets/php/getSetores.php",
    dataType: "json",
    success: function(response) {

      // Ordena o array de objetos por ordem alfabética
      response.sort(function(a, b) {
        var labelA = (a.label.toUpperCase());
        var labelB = (b.label.toUpperCase());
        
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      });

      var select = $("#setor");

      // Preenche o select com as opções
      $.each(response, function(index, option) {
        //ORdena por ordem alfabética
        
        select.append($("<option>")
        .attr("value", option.value)
        .text(option.label));
      });
    },
    error: function(error) {
      console.error("Erro no carregamento dos setores:", error);
    }
  });

  /* ----------- REGRAS DE VALIDAÇÃO PARA OS INPUTS ----------- */

  //Não permite com que o usuário envie o formulário sem seleciona-lo corretamente
  $("#fk_funcionario_name").on('blur', function() {

    let nome_funcionario = $(this).val();

    //console.log(nome_funcionario.trim() == "", $('#fk_funcionario').val() == "", $('#fk_funcionario_name_control').val() != nome_funcionario);

    if(nome_funcionario.trim() == "" || $('#fk_funcionario').val() == "" || $('#fk_funcionario_name_control').val() != nome_funcionario){
      $('#fk_funcionario').val("");
      $(this).addClass("is-invalid");
      $(this).closest('.col-md-6').find('.invalid-feedback').text('Precisa clicar em algum nome da lista!');
      erro_nome = true;
    }
    else{
      $(this).removeClass("is-invalid");
      $(this).closest('.col-md-6').find('.invalid-feedback').text('');
      erro_nome = false;
    }
  });

  //Não permite com que o usuário envie um email fora dos padrões (algum texto + @ + algum texto + . + algum texto)
  $("#email").on('input', function() {

    var re = /\S+@\S+\.\S+/;
    console.log(re.test($(this).val()));
    if(!re.test($(this).val())){
      $(this).addClass("is-invalid");
      $(this).next('.invalid-feedback').text('Insira um email válido!');
      erro_email = true;
    }
    else{
      $(this).removeClass("is-invalid");
      $(this).next('.invalid-feedback').text('');
      erro_email = false;
    }
  });

  //Tira o zero a esquerda do número da máquina
  $("#numero").on('input', function() {
    //So é permitido numeros 
    //Abordagem com expressão regular -> if (!(/^\d+$/.test($(this).val()))) { (\d+ -> Corresponde a um ou mais dígitos (0-9))
    if(isNaN($(this).val())){
      $(this).addClass("is-invalid");
      $(this).next('.invalid-feedback').text('Insira apenas números!');
      erro_numero = true;
    }
    else{
      $(this).removeClass("is-invalid");
      $(this).next('.invalid-feedback').text('');
    }

  });

  $("#numero").on('blur', function() {
    //Tirar o zero a esquerda
    $(this).val($(this).val().replace(/^0+/, ''));
  });

});

//ENVIA OS DADOS PARA O PHP, QUE IRÁ ENVIAR PARA A DATABASE
$("#formularioEnvio").submit(function(event) {

  if(!erro_nome && !erro_email && !erro_numero){ 
    //Fecha o formulario de envio
    $('.modal').modal('hide');

    // Cria um objeto JSON com os valores
    var array_infos = {
      nome_funcionario: $("#fk_funcionario_name").val(),
      fk_funcionario: $("#fk_funcionario").val(),
      email: $("#email").val(),
      numero: $("#numero").val(),
      tipo: $("#tipo").val(),
      fk_setor: $("#setor").val(),
      obs: $("#obs").val()
    };

    var jsonEnvio = {
      hardwares: array_hardwares,
      softwares: array_softwares,
      infos: array_infos

    };

    // Faz a requisição AJAX
    $.ajax({
      type: 'POST',
      url: 'assets/php/enviarDados.php',
      dataType: 'json',
      data: JSON.stringify(jsonEnvio),
      success: function(response) {
        console.log("Requisição bem-sucedida:", response);
        
        Swal.fire({
          icon: 'success',
          title: 'Muito obrigado pela sua colaboração!',
          html: `<p>Para melhorar o aferidor e todo o processo , pedimos que avalie a <b>sua experiência!</b></p> 
          <p class="mb-0">E para isso, <b>você será redirecionado</b> para um formulário de avaliação.</p>`,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Não quero avaliar!',
          cancelButtonColor: "#d33",
          timer: 8000,
          timerProgressBar: true,
          width: 'auto'
        }).then((result)=>{
          if(result.dismiss === Swal.DismissReason.cancel){
            Swal.fire({
              icon: 'success',
              title: 'Perfeito!',
              html: `<p>Esperamos que tenha tido uma ótima experiência com o nosso serviço!<p>
              <h6 class="fw-bold">O departamento de TI agradece a sua colaboração!</h6>`,
              showConfirmButton: false,
              timer: 6000,
              timerProgressBar: true,
              footer: 'A página será atualizada em 6 segundos!'
            }).then((result)=>{
              recarregarPagina();
            });

          }else{
            window.location.href = "https://forms.gle/WBv5YuokVoCiceKL6";
          }    
        });
      },
      error: function(error) {
        console.error("Erro no envio:", error);

        //Substituir por uma pagina de erro
        toastr.clear();
        setTimeout(function() {
          toastr.error(error, 'Falha no envio dos dados ao servidor!', {
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
          confirmButtonText: 'Atualizar e tentar Novamente',
          footer:'Se mesmo assim não funcionar, entre em contato com o T.I!'
            
        }).then((result) => {
          if (result.isConfirmed) {
            //location.reload();
            recarregarPagina();
          }
        });
      }
    });
    
  }

  event.preventDefault();

});
