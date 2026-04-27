
const API_URL = "https://script.google.com/macros/s/AKfycbyYV-BHDGbBc5SowKb1j0t3ObDHp6NkVBv3Q26muCkjZ2JOu-Y8Zlw8-NdM9HNkL974/exec";

// ==========================
// DESPLEGABLES
// ==========================
async function cargarDropdowns() {

  const res = await fetch(API_URL + "?tipo=dropdowns");
  const data = await res.json();

  fill("maquina", data.maquinas);
  fill("proyecto", data.proyectos);
  fill("averia", data.averias);
}

function fill(id, arr) {

  const sel = document.getElementById(id);
  sel.innerHTML = "";

  arr.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

// ==========================
// CREAR OT
// ==========================
async function crearOT(form) {

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "OT",
      id: crypto.randomUUID(),
      hora: form.hora,
      fecha: form.fecha,
      emisor: form.emisor,
      maquina: form.maquina,
      proyecto: form.proyecto,
      codigoAveria: form.codigoAveria,
      descripcion: form.descripcion
    })
  });
}

// ==========================
// CREAR AVISO
// ==========================
async function crearAviso(form) {

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "AVISO",
      id: crypto.randomUUID(),
      fecha: form.fecha,
      hora: form.hora,
      usuario: form.usuario,
      maquina: form.maquina,
      proyecto: form.proyecto,
      tipoAveria: form.tipoAveria,
      descripcion: form.descripcion
    })
  });
}

// ==========================
// EXPORT OTS
// ==========================
async function getOTs() {

  const res = await fetch(API_URL + "?tipo=ots_export");
  const text = await res.text();

  return text.split("\n").map(l => {
    const f = l.split("|");
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