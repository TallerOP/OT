const API_URL = "https://script.google.com/macros/s/AKfycbwAANMCtjKb0_9urod6SbMjXi6jIGm1jVJWo17_4NRMLIeqiNhlfy4cEj6EqwbpoaU8/exec";

// ================= PROTECCIÓN =================
const user = localStorage.getItem("user");

if (!user) {
  window.location.href = "index.html";
}

// ================= INIT =================
window.onload = function () {

  document.getElementById("welcome").innerText =
    "Usuario: " + user;

  controlarPermisos();
  cargarListas();
};

// ================= PERMISOS =================
function controlarPermisos() {

  if (user.toLowerCase() === "produccion") {
    document.getElementById("btnOT").style.display = "none";
  }
}

// ================= CARGAR LISTAS =================
async function cargarListas() {

  try {

    const res = await fetch(API_URL + "?tipo=listas");
    const data = await res.json();

    llenar("maquina", data.MAQUINA);
    llenar("proyecto", data.PROYECTO);
    llenar("tipo", data.AVERIA);
    llenar("hora", data.HORA);

  } catch (err) {
    console.error("Error cargando listas", err);
  }
}

function llenar(id, valores) {

  const select = document.getElementById(id);

  select.innerHTML = "<option value=''>Seleccionar</option>";

  valores.forEach(v => {
    let opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

// ================= AVISO =================
async function crearAviso() {

  const data = {
    tipo: "AVISO",
    id: Date.now(),
    fecha: new Date().toISOString(),
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    tipoAveria: document.getElementById("tipo").value,
    hora: document.getElementById("hora").value,
    descripcion: document.getElementById("desc").value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("Aviso creado");
}

// ================= OT =================
async function crearOT() {

  if (user.toLowerCase() === "produccion") {
    alert("No tienes permisos");
    return;
  }

  const data = {
    tipo: "OT",
    fecha: new Date().toISOString(),
    hora: document.getElementById("hora").value,
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    tipoAveria: document.getElementById("tipo").value,
    descripcion: document.getElementById("desc").value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("OT creada");
}