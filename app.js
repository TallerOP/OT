
const BASE_URL = "https://script.google.com/macros/s/AKfycbwVnmPK99KthEa9TzkK3p-IfTTUBmdDGeTYzC7w_zW6GqnqcuXzEmaAMWQ7nGEV2xtz/exec";

let EMISOR = "";

// =========================
// TOAST
// =========================
function toast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";

  setTimeout(() => t.style.display = "none", 2000);
}

// =========================
// LOGIN (POST REAL)
// =========================
function login() {

  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "login",
      user: user.value,
      pass: pass.value
    })
  })
  .then(r => r.json())
  .then(res => {

    if (!res.ok) {
      alert("Login incorrecto");
      return;
    }

    EMISOR = res.emisor;

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    loadLists();
    loadAvisos();

  })
  .catch(err => {
    console.error(err);
    alert("Error de conexión");
  });
}

// =========================
// LISTAS (MAQUINA / PROY / TIPO / HORA)
// =========================
function loadLists() {

  fetch(BASE_URL + "?action=listas")
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

  fetch(BASE_URL, {
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
  .then(r => r.json())
  .then(res => {

    if (!res.ok) {
      alert("Error creando aviso");
      return;
    }

    toast("Aviso creado correctamente");

    desc.value = "";

    loadAvisos();

  })
  .catch(err => {
    console.error(err);
    alert("Error de red");
  });

}

// =========================
// LISTAR AVISOS
// =========================
function loadAvisos() {

  fetch(BASE_URL + "?action=avisos")
    .then(r => r.json())
    .then(data => {

      const div = document.getElementById("avisos");
      div.innerHTML = "";

      data.forEach(a => {

        div.innerHTML += `
          <div class="card">
            <b>${a.maquina}</b><br>
            ${a.descripcion}<br>

            <button onclick="crearOT(${a.row})">
              Generar OT
            </button>
          </div>
        `;

      });

    });

}

// =========================
// CONVERTIR OT
// =========================
function crearOT(row) {

  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "ot",
      row: row,
      emisor: EMISOR
    })
  })
  .then(r => r.json())
  .then(res => {

    if (!res.ok) {
      alert("Error creando OT");
      return;
    }

    toast("OT creada: " + res.ot);

    loadAvisos();

  });

}