let setores_enviados = [];

//FAZER UMA REQUISIÇÃO GET NO BANCO DE DADOS PARA OBTER TODOS OS DADOS
let registros_enviados;

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


$(document).ready(function () {

  //Mudar a navbar de acordo com o usuário
  inserirNomeUsuarioNav();

  $("#novosRegistrosNav").removeClass("active")
  $("#registrosEnviadosNav").addClass("active");
  $("#registrosEnviadosNav").find("a").attr("aria-current", "page");

  atualizaDados();

  //--------------------- EVENTOS ---------------------

  //Evento para deixar o login no sessionStorage e assim exibir na pagina de redefinição de senha
  $("#trocarSenhaUsuario").on("click", function() {
    console.log("Clicou");
    sessionStorage.setItem("usuario", obterLogin());
  });

  $(document).on('click', '.table tbody tr', function() {
      // Atualizar o modal
      let index = $(this).data('href');
      let registro = registros_enviados[index];
      let lista_softwares = registro.softwaresResumido;

      $("#btnComparar").data("href", index);

      //EXIBE DINAMICAMENTE OS DADOS DA AFERIÇÃO

      $("#cardSFW .card-body").empty();

      if(lista_softwares != null){
        $("#cardSFW .card-body").append(`
          <ul class="list-group">
              ${lista_softwares
                .filter(software => software.id != null)
                .map(software => `<li class="list-group-item">${software.nome}</li>`)
                .join('')}
          </ul>
        `);
      }
      else
      {
        //exibe mensagem de que não há softwares
        $("#cardSFW .card-body").append(`
          <p>Nenhum software instalado</p>
        `);
      }


      $("#modalRegistro input, select, textarea").val('');
      var elemento = $("#modalRegistro");

      elemento.find('[name="nome_funcionario"]').val(registro.nome_funcionario);
      elemento.find('[name="email"]').val(registro.email);
      elemento.find('[name="obs"]').val(registro.obs);
      elemento.find('[name="numero"]').val(registro.numero);
      elemento.find('[name="nome_maquina"]').val(registro.nome_maquina);
      elemento.find('[name="tipo"]').val(tipo[registro.tipo]);
      elemento.find('[name="processador"]').val(registro.processador);
      elemento.find('[name="motherboard"]').val(registro.motherboard);
      elemento.find('[name="memoria_ram"]').val(registro.memoria_ram);
      elemento.find('[name="placa_video"]').val(registro.placa_video);
      elemento.find('[name="hd"]').val(registro.hd);
      elemento.find('[name="drivers"]').val(registro.drivers);

      //Abre o modal
      $("#modalRegistro").modal('show');
  }); 

});

function dadosResumido(registro, index) {
  // const icon_data = '<i class="bi bi-calendar me-2"></i>';
  // const icon_hora = '<i class="bi bi-clock me-1"></i>';

  return (`<tr data-href="${index}">
    <td> ${registro.id} </td>
    <td> ${registro.nome_funcionario} </td>
    <td> ${registro.numero} </td>
    <td> ${formatarData(registro.data_hora_cadastro)} </td>
    <td> ${formatarData(registro.data_hora_modificacao)} </td>
    <td> ${registro.nome_usuario} </td>
    <td> <span class="badge text-bg-light">${tipoEnvio(registro.tipoEnvio)}</span></td>
    </tr>`);

}

function atualizaDados() {

    //Obter setores_enviados
    $.ajax({
      type: "GET",
      url: "../common_assets/php/searchSetor.php",
      dataType: "json",
      success: function(response) {
          //setores_enviados = response;

          var selectComparacao = $("#new_setor");
          var selectAdd = $("#card_hw_add").find('[name="fk_setor"]');

          response.forEach(function(setor) {
              setores_enviados[setor.value] = setor.label;
              selectComparacao.append($("<option>").attr("value", setor.value).text(setor.label));
              selectAdd.append($("<option>").attr("value", setor.value).text(setor.label));
          });
      },
      error: function(error) {
          console.error("Erro no carregamento dos setores_enviados:", error);
      }
    });

    //Obter registros
    $.ajax({
        url: 'assets/php/getEnviados.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            registros_enviados = data;
            console.log(registros_enviados);

            //Separar por setores_enviados
            registros_enviados.forEach(function(valor, index) {
                
                //Verificar se o setor já existe no accordion
                id_setor = valor.fk_setor;

                accordion_setor = $("#collapse" + id_setor);
                if(accordion_setor.length > 0) {
                  $("#tbody" + id_setor).append(dadosResumido(valor, index));             
                }
                else{                                   
                  //Criar um item no accordion
                  $("#setoresAccordion").append(
                    `<div class="accordion-item">                      
                      <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id_setor}" aria-expanded="true" aria-controls="collapse${id_setor}">
                          ${setores_enviados[id_setor]}
                        </button>
                      </h2>
                      
                      <div id="collapse${id_setor}" class="accordion-collapse collapse" data-bs-parent="#setoresAccordion">
                        <div class="accordion-body">                 
                          <table id="${index}" class ="table table-bordered table-hover text-center">
                            <thead>
                              <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Funcionário</th>
                                <th scope="col">Máquina</th>
                                <th scope="col">Data de Aferição</th>
                                <th scope="col">Data de Envio</th>
                                <th scope="col">Usuário</th>
                                <th scope="col">Tipo</th>
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
                }   
                
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro na atualização dos dados:', status, error);
        }
    });
}

