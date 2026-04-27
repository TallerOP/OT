
const API_URL = "https://script.google.com/macros/s/AKfycbwIbAGbyCjymW4VZ1uzZV7nrkaKw8-OpU8NX98fMA2a5Kzl7Q3VF613dri1L41mGcHy/exec";

async function crearOT(data) {

  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "OT",
      id_web: crypto.randomUUID(),
      hora: data.hora,
      data: data.fecha,
      emisor: data.emisor,
      maquina: data.maquina,
      proyecto: data.proyecto,
      codigoAveria: data.codigoAveria,
      descripcion: data.descripcion
    })
  });
}

async function crearAviso(data) {

  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "AVISO",
      id: crypto.randomUUID(),
      fecha: data.fecha,
      usuario: data.usuario,
      maquina: data.maquina,
      proyecto: data.proyecto,
      tipoAveria: data.tipoAveria,
      hora: data.hora,
      descripcion: data.descripcion
    })
  });
}

async function getOTs() {

  const res = await fetch(API_URL + "?tipo=nuevasOTs");
  const text = await res.text();

  return text.split("\n").map(line => {
    const f = line.split("|");
    return {
      ot: f[0],
      hora: f[1],
      fecha: f[2],
      estado: f[3],
      emisor: f[4],
      maquina: f[5],
      proyecto: f[6],
      averia: f[7],
      descripcion: f[8]
    };
  });
}