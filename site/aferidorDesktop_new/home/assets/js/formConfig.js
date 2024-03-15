
//CONFIGURAÇÃO DOS INPUTS DINAMICOS DO FORMULARIO
$(document).ready(function(){

    
  //INICIALIZA O TOOLTIP
  $('[data-bs-toggle="tooltip"]').tooltip();

  var array;

  $.ajax({
    type: "GET",
    url: "../common_assets/php/getFuncionarios.php",
    dataType: "json",
    success: function(response) {
      //console.log(response);
      var array = response.map(function(item) {
        return {label:item.nome_funcionario, value:item.id_funcionario};
      });
      console.log(array);
    },
    error: function(error) {
      console.error("Erro no carregamento dos funcionários:", error);
    }
  });

  //Inicializar AutoComplete e Select
  // var array = arrayFuncionarios.map(function(item) {
  //   return {label:item.nome_funcionario, value:item.id_funcionario};
  // });
  // console.log(array);

  const autoCompleteJS = new autoComplete({ 
    selector: "#fk_funcionario_text",
    wrapper: true,
    placeHolder: "Insira o seu nome aqui...",
    data: {
      src: array,
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
          $('#fk_funcionario').val(selection.value);
        }
      }
    }
  });

  // //INICIALIZA O AUTOCOMPLETE DO NOME DO FUNCIONARIO
  // $("#fk_funcionario_text").autocomplete({
  //   appendTo: "#bodyFormularioEnvio",
  //   source: function(request, response) {
  //     $.ajax({
  //       url: "../common_assets/php/searchFuncionario.php",
  //       dataType: "json",
  //       data: {
  //         q: request.term
  //       },
  //       success: function(data) {
  //         response(data);
  //       }
  //     });
  //   },
  //   minLength: 0,
  //   select: function (event, ui) {
  //     // Set selection
  //     $('#fk_funcionario_text').val(ui.item.label); // display the selected text
  //     $('#fk_funcionario').val(ui.item.value); // save selected id to input
  //     return false;
  //   },
  //   focus: function(event, ui){
  //     return false;
  //   },

  // });

  //INICIALIZA O SELECT DOS SETORES
  $.ajax({
      type: "GET",
      url: "../common_assets/php/searchSetor.php",
      dataType: "json",
      success: function(response) {
          var select = $("#setor");
  
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

});

function validarEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

//ENVIA OS DADOS PARA O PHP, QUE IRÁ ENVIAR PARA A DATABASE
$("#formularioEnvio").submit(function(event) {

    //Fecha o formulario de envio
    $('.modal').modal('hide');

    // Cria um objeto JSON com os valores
    var array_infos = {
        nome_funcionario: $("#fk_funcionario_text").val(),
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
            title: 'Obrigado pela sua colaboração!',
            text: 'Para melhorar o nosso sistema, pedimos que avalie a sua experiência!',
            confirmButtonText: 'Avaliar',
            footer: 'Se o botão não funcionar, clique <a href="https://forms.gle/WBv5YuokVoCiceKL6" target="_blank">aqui</a>'
          }).then((result)=>{
            if(result.isConfirmed){
              window.open('https://forms.gle/WBv5YuokVoCiceKL6', '_blank');
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
    
    event.preventDefault();
});
