
const BASE = "https://script.google.com/macros/s/AKfycbw2AjlWM_8Os3lE2UJnt31NuR4gh5HOEEqeU-hUNeFLDrc2NXUQ7KfB-7g4EiWp07o2/exec";

let EMISOR = "";

// =========================
// LOGIN
// =========================
function login() {

  fetch(`${BASE}?action=login&user=${user.value}&pass=${pass.value}`)
    .then(r => r.json())
    .then(res => {

      if (!res.ok) {
        alert("Login incorrecto");
        return;
      }

      EMISOR = res.emisor;

      login.style.display = "none";
      app.style.display = "block";

      loadLists();
      loadAvisos();

    });

}

// =========================
// LISTAS (CORRECTO)
— =========================
function loadLists() {

  fetch(`${BASE}?action=listas`)
    .then(r => r.json())
    .then(data => {

      fill("maq", data.MAQUINA);
      fill("proy", data.PROYECTO);
      fill("tipo", data.AVERIA);
      fill("hora", data.HORA);

    });

}

function fill(id, arr) {

  const sel = document.getElementById(id);
  sel.innerHTML = "";

  arr.forEach(v => {
    let o = document.createElement("option");
    o.value = v;
    o.text = v;
    sel.add(o);
  });

}

// =========================
// CREAR AVISO
// =========================
function crearAviso() {

  fetch(BASE, {
    method: "POST",
    body: JSON.stringify({
      type: "aviso",
      id: "AV-" + Date.now(),
      usuario: EMISOR,
      maquina: maq.value,
      proyecto: proy.value,
      tipo: tipo.value,
      descripcion: desc.value
    })
  })
  .then(() => {
    alert("Aviso creado");
    loadAvisos();
  });

}

// =========================
// LISTAR
// =========================
function loadAvisos() {

  fetch(`${BASE}?action=avisos`)
    .then(r => r.json())
    .then(data => {

      avisos.innerHTML = "";

      data.forEach(a => {

        avisos.innerHTML += `
          <div>
            ${a.maquina} - ${a.descripcion}
            <button onclick="crearOT(${a.row})">
              Generar OT
            </button>
          </div>
        `;

      });

    });

}

// =========================
// OT (SIN OT_ID + HORA CORRECTA)
// =========================
function crearOT(row) {

  fetch(BASE, {
    method: "POST",
    body: JSON.stringify({
      type: "ot",
      row: row,
      emisor: EMISOR,
      hora: hora.value,
      maquina: maq.value,
      proyecto: proy.value,
      tipo: tipo.value
    })
  })
  .then(() => {
    alert("OT creada");
    loadAvisos();
  });

}