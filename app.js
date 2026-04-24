
const API_URL = "https://script.google.com/macros/s/AKfycbxuOo-0sQN06sM5CAtjvnx8zjLyeuC2bMfvZXN3oSGfpnYK6Cg1c1hL-d_gQ31_jo0l/exec";

const USERS_SHEET = "URL_JSON_USUARIOS"; // lo conectaremos después si quieres
const AVISOS_SHEET = "URL_JSON_AVISOS";

let userActivo = localStorage.getItem("user");

// ================= LOGIN =================
async function login() {

  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

  let res = await fetch(USERS_SHEET);
  let data = await res.json();

  let users = data.values;

  let ok = false;
  let activo = false;

  for (let i = 1; i < users.length; i++) {

    if (users[i][0] == user && users[i][1] == pass) {
      ok = true;

      if (users[i][2] == "SI") {
        activo = true;
      }
    }
  }

  if (ok && activo) {

    localStorage.setItem("user", user);
    window.location.href = "app.html";

  } else if (ok && !activo) {
    document.getElementById("msg").innerText = "Usuario desactivado";
  } else {
    document.getElementById("msg").innerText = "Login incorrecto";
  }
}

// ================= INICIAL =================
window.onload = function () {

  if (window.location.pathname.includes("app.html")) {
    initApp();
  }
};

function initApp() {

  let user = localStorage.getItem("user");

  if (!user) return;

  document.getElementById("welcome").innerText =
    "Usuario: " + user;

  controlarUI(user);
  cargarAvisos();
}

// ================= CONTROL UI =================
function controlarUI(user) {

  document.getElementById("btnAviso").style.display = "inline";

  // PRODUCCIÓN NO PUEDE GENERAR OT
  if (user === "produccion") {
    document.getElementById("btnOT").style.display = "none";
  }
}

// ================= CREAR AVISO =================
async function crearAviso() {

  let user = localStorage.getItem("user");

  let data = {
    tipo: "AVISO",
    id: Date.now(),
    fecha: new Date().toISOString(),
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    descripcion: document.getElementById("desc").value
  };

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    alert("Aviso guardado correctamente");

  } catch (err) {
    console.error(err);
    alert("Error al guardar aviso");
  }
}

// ================= CREAR OT =================
async function crearOT() {

  let user = localStorage.getItem("user");

  if (user === "produccion") {
    alert("No tienes permisos para generar OT");
    return;
  }

  let data = {
    tipo: "OT",
    fecha: new Date().toISOString(),
    hora: new Date().toLocaleTimeString(),
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    descripcion: document.getElementById("desc").value,
    tipoAveria: document.getElementById("tipo").value
  };

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    alert("OT creada correctamente");

  } catch (err) {
    console.error(err);
    alert("Error al crear OT");
  }
}

// ================= CARGAR AVISOS =================
async function cargarAvisos() {

  try {

    let res = await fetch(AVISOS_SHEET);
    let data = await res.json();

    let html = "";

    for (let i = 1; i < data.values.length; i++) {

      html += `
        <div>
          <b>${data.values[i][3]}</b> - ${data.values[i][6]}
        </div>
        <hr>
      `;
    }

    document.getElementById("lista").innerHTML = html;

  } catch (err) {
    console.log("Avisos no cargados aún");
  }
}