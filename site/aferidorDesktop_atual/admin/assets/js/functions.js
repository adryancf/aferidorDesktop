// function formatarData(data, icone_data = null, icone_hora = null) {
//   let data_teste = new Date(data);
//   const dia = String(data_teste.getDate()).padStart(2, '0');
//   const mes = String(data_teste.getMonth() +  1).padStart(2, '0'); // Os meses em JavaScript começam em  0
//   const ano = data_teste.getFullYear();
//   const horas = String(data_teste.getHours()).padStart(2, '0');
//   const minutos = String(data_teste.getMinutes()).padStart(2, '0');
//   const segundos = String(data_teste.getSeconds()).padStart(2, '0');
//   if(icone_data && icone_hora)
//     return `<div class="d-flex justify-content-center">
//       <span class="me-3">${icone_data}${dia}/${mes}/${ano}</span>
//       <span>${icone_hora}${horas}:${minutos}</span>
//     </div>`;
//   else
//     return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
// }

//Retorna um indicativo de acordo com o tipo de envio
function tipoEnvio(envio) {
  if(envio == "update")
  {
    return ('<i class="bi bi-arrow-repeat fs-6 me-1" style="color:#4c89cf;"></i> Atualização');
  }
  else if(envio == "register")
  {
    return ('<i class="bi bi-database-add fs-6 me-1" style="color:#12b034;"></i> Cadastro');
  }
  else{
    return ('<i class="bi bi-slash-square fs-6 me-1" style="color:#ff0000;"></i>');
  }
}