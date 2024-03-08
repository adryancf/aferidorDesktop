function formatarData(data, icone_data = '<i class="bi bi-calendar me-2"></i>', icone_hora = '<i class="bi bi-clock me-1"></i>') {
  let data_teste = new Date(data);
  const dia = String(data_teste.getDate()).padStart(2, '0');
  const mes = String(data_teste.getMonth() +  1).padStart(2, '0'); // Os meses em JavaScript começam em  0
  const ano = data_teste.getFullYear();
  const horas = String(data_teste.getHours()).padStart(2, '0');
  const minutos = String(data_teste.getMinutes()).padStart(2, '0');
  const segundos = String(data_teste.getSeconds()).padStart(2, '0');
  if(icone_data && icone_hora){
    return `<div class="d-flex justify-content-center">
      <span class="me-3">${icone_data}${dia}/${mes}/${ano}</span>
      <span>${icone_hora}${horas}:${minutos}</span>
    </div>`;
  }
  else{
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  }
}
