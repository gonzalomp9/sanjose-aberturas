/* ====================================================================
   CASA SAN JOSÉ ABERTURAS — panel de administración
   ====================================================================

   Este archivo maneja:
     - el login de admin (usuario sjaberturas)
     - la conexión con Supabase (para que los cambios se vean en todos lados)
     - la carga y guardado del contenido editable:
         · datos de contacto (dirección, teléfono, whatsapp, mail, horario)
         · productos del catálogo (con fotos)
         · fotos de la galería

   CÓMO CONFIGURARLO: ver el archivo INSTRUCTIVO-ADMIN.md
   ==================================================================== */

/* ---------- 1) CONFIGURACIÓN DE SUPABASE ----------
   Pegá acá los datos de tu proyecto de Supabase.
   Mientras diga "PEGAR_", la página funciona en modo local
   (los cambios se guardan solo en tu navegador). */
const SUPABASE_URL = "https://urxobudrlvzpqswxysry.supabase.co";       // ej: https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyeG9idWRybHZ6cHFzd3h5c3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzY0NzksImV4cCI6MjEwMTE1MjQ3OX0.S-rowt9XhyMTy6LuQnmvNePfcy6Nvh2Q2feujeUaIG4";         // la "anon public" key
const ADMIN_EMAIL = "admin@casasanjose.com";            // ej: admin@sanjose.com

/* ---------- 2) LOGIN LOCAL (fallback si no usás Supabase) ----------
   Usuario: sjaberturas
   El hash corresponde a la contraseña: oli2026
   Para cambiar la contraseña ver el instructivo. */
const ADMIN_USER = "sjaberturas";
const ADMIN_PASS_HASH = "2820656e5e17b659513a10c0eb248f746a2b1f1d4064cb73ecbe35fa355dd3b9";

const USA_SUPABASE = ![SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL]
  .some(v => v.indexOf("PEGAR_") === 0);

/* ==================================================================== */

// Valores por defecto (los que ya tiene el sitio hoy).
const CONTACTO_DEFAULT = {
  direccion: "Av. Juan B. Alberdi 3101, CABA",
  mapaQuery: "Av. Juan B. Alberdi 3101, CABA",
  telefono: "011 4637-0990",
  telefonoLink: "+541146370990",
  whatsapp: "+54 9 11 3380-5140",
  whatsappNum: "5491133805140",
  mail: "sanjoseaberturas@hotmail.com",
  horario: "Lunes a viernes de 9:00 a 17:00 hs",
};

const PRODUCTOS_DEFAULT = [
  { id: "pd1", grupo: "puertas", nombre: "Puertas de interior", desc: "MDF enchapado en cedro o pino, lisas o molduradas, con buño y foliadas.", img: "assets/imgs/catalogo/puerta-interior.svg" },
  { id: "pd2", grupo: "puertas", nombre: "Puertas de exterior", desc: "Chapa inyectada en líneas simples o de seguridad, con pintura final o foliadas símil madera.", img: "assets/imgs/catalogo/puerta-exterior.svg" },
  { id: "pd3", grupo: "puertas", nombre: "Puertas de madera maciza", desc: "Cedro macizo, de abrir o pivotantes, para entradas de mayor jerarquía.", img: "assets/imgs/catalogo/puerta-madera.svg" },
  { id: "vn1", grupo: "ventanas", nombre: "Aluminio: Herrero, Módena y A30", desc: "Sistemas corredizos, de abrir, paño fijo, proyectantes y banderolas, en varios colores.", img: "assets/imgs/catalogo/ventana-corrediza.svg" },
  { id: "vn2", grupo: "ventanas", nombre: "Las mejores líneas de PVC", desc: "Nacionales e importadas. El PVC no se oxida ni condensa, aísla del frío, el calor y el ruido, y baja el consumo de calefacción y aire.", img: "assets/imgs/catalogo/ventana-oscilo.svg" },
  { id: "vn3", grupo: "ventanas", nombre: "Vidrios a elección", desc: "Vidrio simple, laminado de seguridad, DVH (doble vidrio hermético) y vidrios fantasía.", img: "assets/imgs/catalogo/ventana-dvh.svg" },
  { id: "pt1", grupo: "portones", nombre: "Levadizos motorizados", desc: "Con motorización, control remoto y freno de seguridad ante corte de luz.", img: "assets/imgs/catalogo/porton-levadizo.svg" },
  { id: "pt2", grupo: "portones", nombre: "Corredizos de chapa", desc: "Chapa inyectada en líneas simples o de seguridad, con pintura final o foliadas símil madera.", img: "assets/imgs/catalogo/porton-corredizo.svg" },
  { id: "pt3", grupo: "portones", nombre: "De abrir en madera", desc: "Madera maciza de cedro, de abrir o pivotantes, para cocheras y accesos.", img: "assets/imgs/catalogo/porton-madera.svg" },
  { id: "vr1", grupo: "varios", nombre: "Claraboyas de acrílico", desc: "Para dar luz natural a ambientes internos, baños y pasillos.", img: "assets/imgs/catalogo/varios-claraboya.svg" },
  { id: "vr2", grupo: "varios", nombre: "Cortinas de PVC y aluminio", desc: "Cortinas de enrollar en PVC o aluminio, en colores interior y exterior.", img: "assets/imgs/catalogo/varios-cortina.svg" },
  { id: "vr3", grupo: "varios", nombre: "Ladrillos de vidrio", desc: "Simples o con diseño, para paredes y tabiques que dejan pasar la luz.", img: "assets/imgs/catalogo/varios-ladrillos.svg" },
  { id: "vr4", grupo: "varios", nombre: "Frentes de placard integrales", desc: "Frentes a medida con hojas corredizas para vestidores y dormitorios.", img: "assets/imgs/catalogo/varios-placard.svg" },
  { id: "vr5", grupo: "varios", nombre: "Revestimiento y cieloraso en PVC", desc: "Revestimientos de pared y cielorrasos de PVC, prácticos y fáciles de mantener.", img: "assets/imgs/catalogo/varios-revestimiento.svg" },
];

const GRUPOS_INFO = {
  puertas: { num: "01", titulo: "Puertas", subtitulo: "Interior y exterior, en varios materiales" },
  ventanas: { num: "02", titulo: "Ventanas", subtitulo: "Aluminio, PVC y madera, con distintos vidrios" },
  portones: { num: "03", titulo: "Portones", subtitulo: "De abrir, corredizos o levadizos" },
  varios: { num: "04", titulo: "Varios", subtitulo: "Complementos y terminaciones" },
};

const GALERIA_DEFAULT = [
  { id: "gl1", grande: true, img: "trabajo-1.svg", titulo: "Ventanal corredizo de tres hojas", detalle: "Línea Módena en blanco · con DVH" },
  { id: "gl2", img: "trabajo-2.svg", titulo: "Puerta de entrada inyectada", detalle: "Chapa 18 con cerradura multipunto" },
  { id: "gl3", img: "trabajo-3.svg", titulo: "Cerramiento de balcón en Blindex", detalle: "Vidrio templado sin marcos a la vista" },
  { id: "gl4", img: "trabajo-4.svg", titulo: "Portón levadizo de paneles", detalle: "Con motorización y control remoto" },
  { id: "gl5", img: "trabajo-5.svg", titulo: "Ventanal de gran luz para galería", detalle: "Línea A30 New en color negro" },
  { id: "gl6", img: "trabajo-6.svg", titulo: "Ventana oscilobatiente en PVC", detalle: "Doble vidrio hermético, alta aislación" },
];

// Prefijo para las rutas de imágenes según si estamos en la raíz o en /pages
const BASE = location.pathname.includes("/pages/") ? ".." : ".";

/* ==================== estado ==================== */
const admin = {
  contacto: { ...CONTACTO_DEFAULT },
  productos: JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)),
  galeria: JSON.parse(JSON.stringify(GALERIA_DEFAULT)),
  isAdmin: false,
};
let sb = null, modoRemoto = false;

/* ==================== Supabase ==================== */
async function initSupabase() {
  const m = await import("https://esm.sh/@supabase/supabase-js@2");
  sb = m.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
async function cargarRemoto() {
  const { data, error } = await sb.from("contenido").select("data").eq("id", 1).maybeSingle();
  if (error) { console.warn("Supabase:", error.message); return false; }
  if (data && data.data) aplicar(data.data);
  return true;
}
async function guardarRemoto() {
  const { error } = await sb.from("contenido").upsert({ id: 1, data: recolectar() });
  if (error) { adminToast("Error al guardar: " + error.message, "err"); return false; }
  return true;
}

function recolectar() {
  return { contacto: admin.contacto, productos: admin.productos, galeria: admin.galeria };
}
function aplicar(d) {
  if (!d) return;
  if (d.contacto) admin.contacto = Object.assign({ ...CONTACTO_DEFAULT }, d.contacto);
  if (Array.isArray(d.productos)) admin.productos = d.productos;
  if (Array.isArray(d.galeria)) admin.galeria = d.galeria;
}

/* ==================== guardado local (fallback) ==================== */
const LS_KEY = "sanjose_admin_v1";
function guardarLocal() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(recolectar())); return true; }
  catch (e) { return false; }
}
function cargarLocal() {
  try { const r = localStorage.getItem(LS_KEY); if (r) aplicar(JSON.parse(r)); } catch (e) {}
}
async function guardarTodo() {
  if (modoRemoto) return guardarRemoto();
  return guardarLocal();
}

/* ==================== SHA-256 ==================== */
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ==================== toast ==================== */
let adminToastTimer;
function adminToast(msg, tipo) {
  let t = document.getElementById("adminToast");
  if (!t) {
    t = document.createElement("div");
    t.id = "adminToast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = "show " + (tipo || "");
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => { t.className = ""; }, 3000);
}

/* ==================== render de contacto ==================== */
// Actualiza todos los datos de contacto que aparecen en la página actual.
function renderContacto() {
  const c = admin.contacto;
  document.querySelectorAll("[data-ct='direccion']").forEach(el => {
    el.textContent = c.direccion;
    if (el.tagName === "A") el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(c.mapaQuery);
  });
  document.querySelectorAll("[data-ct='direccion-link']").forEach(el =>
    el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(c.mapaQuery));
  document.querySelectorAll("[data-ct='telefono']").forEach(el => {
    el.textContent = c.telefono;
    if (el.tagName === "A") el.href = "tel:" + c.telefonoLink;
  });
  document.querySelectorAll("[data-ct='telefono-link']").forEach(el => el.href = "tel:" + c.telefonoLink);
  document.querySelectorAll("[data-ct='whatsapp']").forEach(el => {
    el.textContent = c.whatsapp;
    if (el.tagName === "A") el.href = "https://wa.me/" + c.whatsappNum;
  });
  document.querySelectorAll("[data-ct='whatsapp-link']").forEach(el => el.href = "https://wa.me/" + c.whatsappNum);
  document.querySelectorAll("[data-ct='mail']").forEach(el => { el.textContent = c.mail; el.href = "mailto:" + c.mail; });
  document.querySelectorAll("[data-ct='horario']").forEach(el => el.innerHTML = c.horario);
  // mapa embebido de contacto
  const mapa = document.getElementById("mapaContacto");
  if (mapa) mapa.src = "https://www.google.com/maps?q=" + encodeURIComponent(c.mapaQuery) + "&output=embed";
}

/* ==================== render del catálogo ==================== */
function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function escA(s) { return (s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }
function rutaImg(src) {
  if (/^https?:/.test(src)) return src;      // URL externa
  return BASE + "/" + src.replace(/^\.?\//, "");
}
// Para la galería: si es un link externo lo deja tal cual;
// si es un archivo local (ej "trabajo-1.svg") le pone la carpeta.
function rutaGaleria(src) {
  if (/^https?:/.test(src)) return src;
  return rutaImg("assets/imgs/" + src);
}

function renderCatalogo() {
  const cont = document.getElementById("listaGrupos");
  if (!cont) return;
  cont.innerHTML = "";
  Object.keys(GRUPOS_INFO).forEach((gid, idx) => {
    const info = GRUPOS_INFO[gid];
    const items = admin.productos.filter(p => p.grupo === gid);
    const det = document.createElement("details");
    det.className = "grupo";
    det.id = gid;
    if (idx === 0) det.open = true;

    let itemsHtml = items.map(p => `
      <article class="item" data-id="${p.id}">
        <figure class="item-foto">
          <img src="${escA(rutaImg(p.img))}" alt="Ilustración de ${escA(p.nombre.toLowerCase())}" loading="lazy" onerror="this.style.opacity=.3">
        </figure>
        <div class="item-texto">
          <h3>${esc(p.nombre)}</h3>
          <p>${esc(p.desc)}</p>
          ${admin.isAdmin ? `<div class="item-admin">
            <button class="mini-admin editar" data-edit="${p.id}">✎ Editar</button>
            <button class="mini-admin borrar" data-del="${p.id}">✕ Borrar</button>
          </div>` : ""}
        </div>
      </article>`).join("");

    if (admin.isAdmin) {
      itemsHtml += `<button class="item item-agregar" data-add="${gid}">＋ Agregar a ${esc(info.titulo)}</button>`;
    }

    det.innerHTML = `
      <summary class="grupo-cabecera">
        <div class="grupo-titulo">
          <span class="grupo-num">${info.num}</span>
          <span><h2>${esc(info.titulo)}</h2><span>${esc(info.subtitulo)}</span></span>
        </div>
        <span class="chevron" aria-hidden="true"></span>
      </summary>
      <div class="grupo-cuerpo"><div class="items">${itemsHtml}</div></div>`;
    cont.appendChild(det);
  });

  if (admin.isAdmin) {
    cont.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); abrirProducto(b.dataset.edit); }));
    cont.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async e => {
      e.preventDefault();
      if (!confirm("¿Borrar este producto?")) return;
      admin.productos = admin.productos.filter(p => p.id !== b.dataset.del);
      renderCatalogo(); await guardarTodo(); adminToast("Producto borrado", "ok");
    }));
    cont.querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); abrirProducto("", b.dataset.add); }));
  }
}

/* ==================== render de la galería ==================== */
function renderGaleria() {
  const cont = document.getElementById("grillaGaleria");
  if (!cont) return;
  cont.innerHTML = "";
  admin.galeria.forEach(g => {
    const fig = document.createElement("figure");
    fig.className = "obra";
    fig.innerHTML = `
      <img src="${escA(rutaGaleria(g.img))}" alt="${escA(g.titulo)}" loading="lazy" onerror="this.style.opacity=.3">
      <figcaption><strong>${esc(g.titulo)}</strong><span>${esc(g.detalle)}</span></figcaption>
      ${admin.isAdmin ? `<div class="obra-admin">
        <button class="mini-admin editar" data-gedit="${g.id}">✎</button>
        <button class="mini-admin borrar" data-gdel="${g.id}">✕</button>
      </div>` : ""}`;
    cont.appendChild(fig);
  });
  if (admin.isAdmin) {
    const add = document.createElement("button");
    add.className = "obra obra-agregar";
    add.textContent = "＋ Agregar foto";
    add.addEventListener("click", () => abrirFoto(""));
    cont.appendChild(add);

    cont.querySelectorAll("[data-gedit]").forEach(b => b.addEventListener("click", () => abrirFoto(b.dataset.gedit)));
    cont.querySelectorAll("[data-gdel]").forEach(b => b.addEventListener("click", async () => {
      if (!confirm("¿Borrar esta foto?")) return;
      admin.galeria = admin.galeria.filter(g => g.id !== b.dataset.gdel);
      renderGaleria(); await guardarTodo(); adminToast("Foto borrada", "ok");
    }));
  }
}

/* ==================== modales de edición ==================== */
function modalHTML() {
  if (document.getElementById("adminModales")) return;
  const div = document.createElement("div");
  div.id = "adminModales";
  div.innerHTML = `
    <!-- login -->
    <div class="adm-overlay" id="admLogin">
      <div class="adm-box">
        <h3>Acceso administrador</h3>
        <label>Usuario</label>
        <input type="text" id="admUser" autocomplete="off" placeholder="usuario">
        <label>Contraseña</label>
        <input type="password" id="admPass" autocomplete="off" placeholder="contraseña">
        <p class="adm-error" id="admError"></p>
        <div class="adm-acciones">
          <button class="boton" id="admDoLogin">Entrar</button>
          <button class="boton--linea" id="admCancelLogin">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- producto -->
    <div class="adm-overlay" id="admProd">
      <div class="adm-box">
        <h3 id="admProdTitle">Nuevo producto</h3>
        <input type="hidden" id="admProdId"><input type="hidden" id="admProdGrupo">
        <label>Nombre</label>
        <input type="text" id="admProdNombre" placeholder="Puerta de interior">
        <label>Descripción</label>
        <textarea id="admProdDesc" rows="3" placeholder="Material, terminaciones..."></textarea>
        <label>Foto (URL de la imagen)</label>
        <input type="url" id="admProdImg" placeholder="https://i.ibb.co/....jpg">
        <p class="adm-nota">Pegá el enlace de una imagen (ibb.co, Discord, etc.). Ver el instructivo para saber cómo subir fotos.</p>
        <div class="adm-acciones">
          <button class="boton" id="admGuardarProd">Guardar</button>
          <button class="boton--linea" id="admCancelProd">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- foto galería -->
    <div class="adm-overlay" id="admFoto">
      <div class="adm-box">
        <h3 id="admFotoTitle">Nueva foto</h3>
        <input type="hidden" id="admFotoId">
        <label>Foto (URL de la imagen)</label>
        <input type="url" id="admFotoImg" placeholder="https://i.ibb.co/....jpg">
        <label>Título</label>
        <input type="text" id="admFotoTitulo" placeholder="Ventanal corredizo">
        <label>Detalle</label>
        <input type="text" id="admFotoDetalle" placeholder="Línea Módena en blanco">
        <div class="adm-acciones">
          <button class="boton" id="admGuardarFoto">Guardar</button>
          <button class="boton--linea" id="admCancelFoto">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- contacto -->
    <div class="adm-overlay" id="admContacto">
      <div class="adm-box ancho">
        <h3>Datos de contacto</h3>
        <label>Dirección (texto que se muestra)</label>
        <input type="text" id="admDir" placeholder="Av. Juan B. Alberdi 3101, CABA">
        <label>Dirección para el mapa (dónde marca la ubicación)</label>
        <input type="text" id="admMapa" placeholder="Av. Juan B. Alberdi 3101, CABA">
        <label>Teléfono de línea (texto)</label>
        <input type="text" id="admTel" placeholder="011 4637-0990">
        <label>Teléfono de línea (para el botón de llamar, sin espacios)</label>
        <input type="text" id="admTelLink" placeholder="+541146370990">
        <label>WhatsApp (texto)</label>
        <input type="text" id="admWa" placeholder="+54 9 11 3380-5140">
        <label>WhatsApp (número que abre el chat: código país + número, sin + ni espacios)</label>
        <input type="text" id="admWaNum" placeholder="5491133805140">
        <label>Email</label>
        <input type="text" id="admMail" placeholder="sanjoseaberturas@hotmail.com">
        <label>Horario</label>
        <input type="text" id="admHorario" placeholder="Lunes a viernes de 9:00 a 17:00 hs">
        <div class="adm-acciones">
          <button class="boton" id="admGuardarContacto">Guardar</button>
          <button class="boton--linea" id="admCancelContacto">Cancelar</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);

  // cerrar al tocar afuera
  div.querySelectorAll(".adm-overlay").forEach(o =>
    o.addEventListener("click", e => { if (e.target === o) o.classList.remove("visible"); }));

  // login
  document.getElementById("admDoLogin").addEventListener("click", doLogin);
  document.getElementById("admPass").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
  document.getElementById("admCancelLogin").addEventListener("click", () => cerrar("admLogin"));

  // producto
  document.getElementById("admCancelProd").addEventListener("click", () => cerrar("admProd"));
  document.getElementById("admGuardarProd").addEventListener("click", guardarProducto);

  // foto
  document.getElementById("admCancelFoto").addEventListener("click", () => cerrar("admFoto"));
  document.getElementById("admGuardarFoto").addEventListener("click", guardarFoto);

  // contacto
  document.getElementById("admCancelContacto").addEventListener("click", () => cerrar("admContacto"));
  document.getElementById("admGuardarContacto").addEventListener("click", guardarContacto);
}
function abrir(id) { document.getElementById(id).classList.add("visible"); }
function cerrar(id) { document.getElementById(id).classList.remove("visible"); }

/* ---------- login ---------- */
function abrirLogin() {
  if (admin.isAdmin) { logout(); return; }
  abrir("admLogin");
  document.getElementById("admUser").focus();
}
async function doLogin() {
  const u = document.getElementById("admUser").value.trim();
  const p = document.getElementById("admPass").value;
  const err = document.getElementById("admError");
  if (modoRemoto && sb) {
    err.textContent = "Verificando...";
    const { error } = await sb.auth.signInWithPassword({ email: ADMIN_EMAIL, password: p });
    if (error) { err.textContent = "Contraseña incorrecta."; return; }
    admin.isAdmin = true; cerrar("admLogin"); limpiarLogin(); aplicarModo(true);
    await cargarRemoto(); renderTodo(); adminToast("Modo administrador activado", "ok");
    return;
  }
  const h = await sha256(p);
  if (u === ADMIN_USER && h === ADMIN_PASS_HASH) {
    admin.isAdmin = true;
    try { sessionStorage.setItem("sj_admin", "1"); } catch (e) {}
    cerrar("admLogin"); limpiarLogin(); aplicarModo(true);
    adminToast("Modo administrador activado", "ok");
  } else {
    err.textContent = "Usuario o contraseña incorrectos.";
  }
}
function limpiarLogin() {
  document.getElementById("admUser").value = "";
  document.getElementById("admPass").value = "";
  document.getElementById("admError").textContent = "";
}
async function logout() {
  if (modoRemoto && sb) { try { await sb.auth.signOut(); } catch (e) {} }
  admin.isAdmin = false;
  try { sessionStorage.removeItem("sj_admin"); } catch (e) {}
  aplicarModo(false);
  adminToast("Sesión cerrada");
}
function aplicarModo(activo) {
  document.body.classList.toggle("admin-on", activo);
  const btn = document.getElementById("btnAdmin");
  if (btn) {
    btn.textContent = activo ? "🔓" : "🔑";
    btn.title = activo ? "Cerrar sesión" : "Acceso administrador";
  }
  // botón editar contacto (aparece en el footer y en contacto)
  document.querySelectorAll(".btn-editar-contacto").forEach(b => b.style.display = activo ? "inline-flex" : "none");
  renderTodo();
}

/* ---------- producto ---------- */
function abrirProducto(id, grupo) {
  const p = admin.productos.find(x => x.id === id) || { id: "", grupo: grupo || "puertas", nombre: "", desc: "", img: "" };
  document.getElementById("admProdTitle").textContent = id ? "Editar producto" : "Nuevo producto";
  document.getElementById("admProdId").value = p.id;
  document.getElementById("admProdGrupo").value = p.grupo;
  document.getElementById("admProdNombre").value = p.nombre;
  document.getElementById("admProdDesc").value = p.desc;
  document.getElementById("admProdImg").value = /^https?:/.test(p.img) ? p.img : "";
  abrir("admProd");
}
async function guardarProducto() {
  const id = document.getElementById("admProdId").value;
  const obj = {
    id: id || ("p" + Date.now()),
    grupo: document.getElementById("admProdGrupo").value,
    nombre: document.getElementById("admProdNombre").value.trim() || "Producto",
    desc: document.getElementById("admProdDesc").value.trim(),
    img: document.getElementById("admProdImg").value.trim() || "assets/imgs/varios.svg",
  };
  const i = admin.productos.findIndex(x => x.id === obj.id);
  if (i >= 0) admin.productos[i] = obj; else admin.productos.push(obj);
  cerrar("admProd"); renderCatalogo(); await guardarTodo(); adminToast("Producto guardado", "ok");
}

/* ---------- foto galería ---------- */
function abrirFoto(id) {
  const g = admin.galeria.find(x => x.id === id) || { id: "", img: "", titulo: "", detalle: "" };
  document.getElementById("admFotoTitle").textContent = id ? "Editar foto" : "Nueva foto";
  document.getElementById("admFotoId").value = g.id;
  document.getElementById("admFotoImg").value = /^https?:/.test(g.img) ? g.img : "";
  document.getElementById("admFotoTitulo").value = g.titulo;
  document.getElementById("admFotoDetalle").value = g.detalle;
  abrir("admFoto");
}
async function guardarFoto() {
  const id = document.getElementById("admFotoId").value;
  const img = document.getElementById("admFotoImg").value.trim();
  if (!img && !id) { adminToast("Pegá la URL de la foto", "err"); return; }
  const g = admin.galeria.find(x => x.id === id) || { id: "g" + Date.now() };
  g.img = img || g.img;
  g.titulo = document.getElementById("admFotoTitulo").value.trim() || "Sin título";
  g.detalle = document.getElementById("admFotoDetalle").value.trim();
  if (!admin.galeria.includes(g)) admin.galeria.push(g);
  cerrar("admFoto"); renderGaleria(); await guardarTodo(); adminToast("Foto guardada", "ok");
}

/* ---------- contacto ---------- */
function abrirContacto() {
  const c = admin.contacto;
  document.getElementById("admDir").value = c.direccion;
  document.getElementById("admMapa").value = c.mapaQuery;
  document.getElementById("admTel").value = c.telefono;
  document.getElementById("admTelLink").value = c.telefonoLink;
  document.getElementById("admWa").value = c.whatsapp;
  document.getElementById("admWaNum").value = c.whatsappNum;
  document.getElementById("admMail").value = c.mail;
  document.getElementById("admHorario").value = c.horario;
  abrir("admContacto");
}
async function guardarContacto() {
  const c = admin.contacto;
  c.direccion = document.getElementById("admDir").value.trim();
  c.mapaQuery = document.getElementById("admMapa").value.trim();
  c.telefono = document.getElementById("admTel").value.trim();
  c.telefonoLink = document.getElementById("admTelLink").value.trim();
  c.whatsapp = document.getElementById("admWa").value.trim();
  c.whatsappNum = document.getElementById("admWaNum").value.trim();
  c.mail = document.getElementById("admMail").value.trim();
  c.horario = document.getElementById("admHorario").value.trim();
  cerrar("admContacto"); renderContacto(); await guardarTodo(); adminToast("Datos de contacto guardados", "ok");
}

/* ==================== render general ==================== */
function renderTodo() {
  renderContacto();
  renderCatalogo();
  renderGaleria();
}

/* ==================== init ==================== */
(async function initAdmin() {
  modalHTML();

  // botón de la llave (si la página lo tiene)
  const btn = document.getElementById("btnAdmin");
  if (btn) btn.addEventListener("click", abrirLogin);
  document.querySelectorAll(".btn-editar-contacto").forEach(b => b.addEventListener("click", abrirContacto));

  // conexión
  if (USA_SUPABASE) {
    try { await initSupabase(); modoRemoto = await cargarRemoto(); }
    catch (e) { console.warn("Sin Supabase, uso modo local:", e); modoRemoto = false; }
  }
  if (!modoRemoto) cargarLocal();

  renderTodo();

  // restaurar sesión
  if (modoRemoto && sb) {
    try { const { data } = await sb.auth.getSession(); if (data && data.session) { admin.isAdmin = true; aplicarModo(true); } } catch (e) {}
  } else {
    try { if (sessionStorage.getItem("sj_admin") === "1") { admin.isAdmin = true; aplicarModo(true); } } catch (e) {}
  }
})();
