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
  { id: "gl1", tam: "grande", img: "trabajo-1.svg", titulo: "Ventanal corredizo de tres hojas", detalle: "Línea Módena en blanco · con DVH" },
  { id: "gl2", tam: "chica", img: "trabajo-2.svg", titulo: "Puerta de entrada inyectada", detalle: "Chapa 18 con cerradura multipunto" },
  { id: "gl3", tam: "chica", img: "trabajo-3.svg", titulo: "Cerramiento de balcón en Blindex", detalle: "Vidrio templado sin marcos a la vista" },
  { id: "gl4", tam: "chica", img: "trabajo-4.svg", titulo: "Portón levadizo de paneles", detalle: "Con motorización y control remoto" },
  { id: "gl5", tam: "mediana", img: "trabajo-5.svg", titulo: "Ventanal de gran luz para galería", detalle: "Línea A30 New en color negro" },
  { id: "gl6", tam: "chica", img: "trabajo-6.svg", titulo: "Ventana oscilobatiente en PVC", detalle: "Doble vidrio hermético, alta aislación" },
];

// Glosario: cada término tiene un tema, un nombre y su explicación.
const GLOSARIO_TEMAS = {
  vidrios: "Vidrios",
  materiales: "Materiales",
  sistemas: "Sistemas de apertura",
  seguridad: "Seguridad y herrajes",
};
const GLOSARIO_DEFAULT = [
  { id: "g_dvh", tema: "vidrios", termino: "DVH (doble vidrio hermético)", def: "Son dos vidrios separados por una cámara de aire sellada. Aísla mucho mejor del frío, el calor y el ruido que un vidrio simple. Ideal para dormitorios y frentes ruidosos." },
  { id: "g_simple", tema: "vidrios", termino: "Vidrio simple", def: "Un solo vidrio, de 3 a 6 mm. Es la opción más económica. Aísla menos que el DVH, pero cumple bien en interiores o donde el clima no es un problema." },
  { id: "g_laminado", tema: "vidrios", termino: "Vidrio laminado (de seguridad)", def: "Dos vidrios pegados con una lámina en el medio. Si se rompe, los pedazos quedan pegados a la lámina y no caen. Da seguridad y corta rayos UV." },
  { id: "g_templado", tema: "vidrios", termino: "Vidrio templado (Blindex)", def: "Vidrio tratado con calor para que sea mucho más resistente. Si se rompe, se hace pedacitos chicos sin filo. Se usa en mamparas, barandas y cerramientos sin marco." },
  { id: "g_fantasia", tema: "vidrios", termino: "Vidrio fantasía", def: "Vidrio con textura o dibujo que deja pasar la luz pero no deja ver con claridad. Ideal para baños y puertas donde querés luz pero también privacidad." },
  { id: "g_chapa18", tema: "materiales", termino: "Chapa 18", def: "Se refiere al espesor de la chapa: cuanto más chico el número, más gruesa y resistente. La chapa 18 es gruesa, se usa en puertas de entrada y de seguridad." },
  { id: "g_chapa22", tema: "materiales", termino: "Chapa 22", def: "Chapa más fina que la 18 (más número = más fina). Se usa en puertas de interior o placares, donde no hace falta tanta resistencia y conviene que sea liviana." },
  { id: "g_inyectada", tema: "materiales", termino: "Puerta inyectada", def: "Puerta de chapa rellena por dentro con espuma de poliuretano. Esa espuma la hace más rígida y la aísla del frío y del ruido. Típica en puertas de entrada." },
  { id: "g_foliada", tema: "materiales", termino: "Foliada / símil madera", def: "Es un acabado: se le pega una lámina (folio) que imita la veta de la madera. Queda con aspecto de madera pero con la resistencia del aluminio o la chapa, sin mantenimiento." },
  { id: "g_mdf", tema: "materiales", termino: "MDF", def: "Un tablero de fibras de madera prensadas. Es parejo, sin nudos, y se pinta o enchapa muy bien. Se usa mucho en puertas de interior y placares." },
  { id: "g_pvc", tema: "materiales", termino: "PVC", def: "Un material plástico rígido muy usado en aberturas. No se oxida, no se pudre, no condensa y aísla muy bien. No necesita pintura ni mantenimiento." },
  { id: "g_cedro", tema: "materiales", termino: "Cedro macizo", def: "Madera noble, estable y de buena veta. Se usa en puertas de exterior de mayor jerarquía. Necesita mantenimiento (lustre o barniz) cada cierto tiempo." },
  { id: "g_corrediza", tema: "sistemas", termino: "Corrediza", def: "Las hojas se deslizan de costado, una detrás de la otra, sin ocupar lugar hacia adentro. Ideal cuando no hay espacio para que la ventana abra hacia el ambiente." },
  { id: "g_batiente", tema: "sistemas", termino: "De abrir (batiente)", def: "La hoja abre hacia adentro o afuera con bisagras, como una puerta. Cierra muy bien y aísla mejor que la corrediza, pero necesita espacio para el barrido." },
  { id: "g_oscilo", tema: "sistemas", termino: "Oscilobatiente", def: "Una misma ventana abre de dos formas: como puerta (de costado) o apenas inclinada desde arriba para ventilar sin abrir del todo. Muy práctica y segura." },
  { id: "g_panofijo", tema: "sistemas", termino: "Paño fijo", def: "Un vidrio que no abre, va fijo en el marco. Se usa para dar luz o combinar con hojas que sí abren. Es la opción más económica y hermética." },
  { id: "g_proyectante", tema: "sistemas", termino: "Proyectante / banderola", def: "Ventanas chicas que abren inclinándose desde arriba (banderola) o desde abajo (proyectante). Dejan ventilar aunque llueva. Comunes en baños y cocinas." },
  { id: "g_levadizo", tema: "sistemas", termino: "Portón levadizo", def: "El portón sube entero y queda paralelo al techo del garaje. Ocupa poco lugar y se le puede poner motor con control remoto." },
  { id: "g_multipunto", tema: "seguridad", termino: "Cerradura multipunto", def: "Con una sola vuelta de llave, la puerta se traba en varios puntos a la vez (arriba, al medio y abajo). Mucho más segura que una cerradura común." },
  { id: "g_premarco", tema: "seguridad", termino: "Premarco", def: "Un marco que se coloca primero en la pared, durante la obra. Después la abertura se monta sobre él. Ayuda a que quede derecha y bien sellada." },
  { id: "g_burlete", tema: "seguridad", termino: "Burlete", def: "La goma que va en el contorno de la hoja. Sella contra el marco para que no entre aire, agua ni polvo, y mejora la aislación." },
];

// Prefijo para las rutas de imágenes según si estamos en la raíz o en /pages
const BASE = location.pathname.includes("/pages/") ? ".." : ".";

/* ==================== estado ==================== */
const admin = {
  contacto: { ...CONTACTO_DEFAULT },
  productos: JSON.parse(JSON.stringify(PRODUCTOS_DEFAULT)),
  galeria: JSON.parse(JSON.stringify(GALERIA_DEFAULT)),
  glosario: JSON.parse(JSON.stringify(GLOSARIO_DEFAULT)),
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
  return { contacto: admin.contacto, productos: admin.productos, galeria: admin.galeria, glosario: admin.glosario };
}
function aplicar(d) {
  if (!d) return;
  if (d.contacto) admin.contacto = Object.assign({ ...CONTACTO_DEFAULT }, d.contacto);
  if (Array.isArray(d.productos)) admin.productos = d.productos;
  if (Array.isArray(d.galeria)) admin.galeria = d.galeria;
  if (Array.isArray(d.glosario)) admin.glosario = d.glosario;
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

  // zoom al tocar la foto de un producto (sin flechas)
  cont.querySelectorAll(".item-foto img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const art = img.closest(".item");
      const p = admin.productos.find(x => x.id === art.dataset.id);
      if (p) abrirLightbox([{ img: rutaImg(p.img), titulo: p.nombre, detalle: p.desc }], 0, false);
    });
  });
}

/* ==================== render del glosario ==================== */
function renderGlosario() {
  const cont = document.getElementById("listaGlosario");
  if (!cont) return;
  cont.innerHTML = "";
  Object.keys(GLOSARIO_TEMAS).forEach(tema => {
    const terminos = admin.glosario.filter(t => t.tema === tema);
    if (terminos.length === 0 && !admin.isAdmin) return;

    const sec = document.createElement("section");
    sec.className = "glo-tema";

    let itemsHtml = terminos.map(t => `
      <details class="glo-item" data-id="${t.id}">
        <summary>
          <span class="glo-termino">${esc(t.termino)}</span>
          <span class="glo-mas" aria-hidden="true">+</span>
        </summary>
        <div class="glo-def">
          <p>${esc(t.def)}</p>
          ${admin.isAdmin ? `<div class="item-admin">
            <button class="mini-admin editar" data-tedit="${t.id}">✎ Editar</button>
            <button class="mini-admin borrar" data-tdel="${t.id}">✕ Borrar</button>
          </div>` : ""}
        </div>
      </details>`).join("");

    if (admin.isAdmin) {
      itemsHtml += `<button class="glo-agregar" data-tadd="${tema}">＋ Agregar término a ${esc(GLOSARIO_TEMAS[tema])}</button>`;
    }

    sec.innerHTML = `<h2 class="glo-titulo">${esc(GLOSARIO_TEMAS[tema])}</h2>
      <div class="glo-lista">${itemsHtml}</div>`;
    cont.appendChild(sec);
  });

  if (admin.isAdmin) {
    cont.querySelectorAll("[data-tedit]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); abrirTermino(b.dataset.tedit); }));
    cont.querySelectorAll("[data-tdel]").forEach(b => b.addEventListener("click", async e => {
      e.preventDefault();
      if (!confirm("¿Borrar este término?")) return;
      admin.glosario = admin.glosario.filter(t => t.id !== b.dataset.tdel);
      renderGlosario(); await guardarTodo(); adminToast("Término borrado", "ok");
    }));
    cont.querySelectorAll("[data-tadd]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); abrirTermino("", b.dataset.tadd); }));
  }
}

/* ==================== render de la galería ==================== */
function renderGaleria() {
  const cont = document.getElementById("grillaGaleria");
  if (!cont) return;
  cont.innerHTML = "";
  admin.galeria.forEach(g => {
    const fig = document.createElement("figure");
    const tam = g.tam || (g.grande ? "grande" : "chica");
    fig.className = "obra obra--" + tam;
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

  // zoom al tocar una foto de la galería (con flechas para pasar a la siguiente)
  const fotos = admin.galeria.map(g => ({ img: rutaGaleria(g.img), titulo: g.titulo, detalle: g.detalle }));
  cont.querySelectorAll(".obra img").forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => abrirLightbox(fotos, i, true));
  });
}

/* ==================== lightbox (foto en grande) ==================== */
let lbFotos = [], lbIndex = 0, lbFlechas = false;

function lightboxHTML() {
  if (document.getElementById("lightbox")) return;
  const div = document.createElement("div");
  div.id = "lightbox";
  div.innerHTML = `
    <button class="lb-cerrar" aria-label="Cerrar">✕</button>
    <button class="lb-flecha lb-prev" aria-label="Anterior">‹</button>
    <figure class="lb-figura">
      <img id="lbImg" src="" alt="">
      <figcaption>
        <strong id="lbTitulo"></strong>
        <span id="lbDetalle"></span>
      </figcaption>
    </figure>
    <button class="lb-flecha lb-next" aria-label="Siguiente">›</button>`;
  document.body.appendChild(div);

  div.querySelector(".lb-cerrar").addEventListener("click", cerrarLightbox);
  div.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); lbMover(-1); });
  div.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); lbMover(1); });
  // cerrar al tocar el fondo (no la imagen)
  div.addEventListener("click", e => { if (e.target === div) cerrarLightbox(); });
  // teclado: escape y flechas
  document.addEventListener("keydown", e => {
    if (!div.classList.contains("visible")) return;
    if (e.key === "Escape") cerrarLightbox();
    if (lbFlechas && e.key === "ArrowLeft") lbMover(-1);
    if (lbFlechas && e.key === "ArrowRight") lbMover(1);
  });
}

function abrirLightbox(fotos, index, conFlechas) {
  lightboxHTML();
  lbFotos = fotos;
  lbIndex = index;
  lbFlechas = conFlechas && fotos.length > 1;
  const lb = document.getElementById("lightbox");
  lb.classList.toggle("con-flechas", lbFlechas);
  pintarLightbox();
  lb.classList.add("visible");
  document.body.style.overflow = "hidden";
}
function pintarLightbox() {
  const f = lbFotos[lbIndex];
  if (!f) return;
  document.getElementById("lbImg").src = f.img;
  document.getElementById("lbImg").alt = f.titulo || "";
  document.getElementById("lbTitulo").textContent = f.titulo || "";
  document.getElementById("lbDetalle").textContent = f.detalle || "";
}
function lbMover(dir) {
  lbIndex = (lbIndex + dir + lbFotos.length) % lbFotos.length;
  pintarLightbox();
}
function cerrarLightbox() {
  const lb = document.getElementById("lightbox");
  if (lb) lb.classList.remove("visible");
  document.body.style.overflow = "";
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
        <label>Tamaño en la galería</label>
        <select id="admFotoTam">
          <option value="chica">Chica (1 casillero)</option>
          <option value="mediana">Mediana (doble ancho)</option>
          <option value="grande">Grande (destacada, 2×2)</option>
        </select>
        <div class="adm-acciones">
          <button class="boton" id="admGuardarFoto">Guardar</button>
          <button class="boton--linea" id="admCancelFoto">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- término del glosario -->
    <div class="adm-overlay" id="admTermino">
      <div class="adm-box">
        <h3 id="admTerminoTitle">Nuevo término</h3>
        <input type="hidden" id="admTerminoId"><input type="hidden" id="admTerminoTema">
        <label>Tema</label>
        <select id="admTerminoTemaSel">
          <option value="vidrios">Vidrios</option>
          <option value="materiales">Materiales</option>
          <option value="sistemas">Sistemas de apertura</option>
          <option value="seguridad">Seguridad y herrajes</option>
        </select>
        <label>Término</label>
        <input type="text" id="admTerminoNombre" placeholder="DVH (doble vidrio hermético)">
        <label>Explicación</label>
        <textarea id="admTerminoDef" rows="4" placeholder="Explicalo en palabras simples..."></textarea>
        <div class="adm-acciones">
          <button class="boton" id="admGuardarTermino">Guardar</button>
          <button class="boton--linea" id="admCancelTermino">Cancelar</button>
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

  // término del glosario
  document.getElementById("admCancelTermino").addEventListener("click", () => cerrar("admTermino"));
  document.getElementById("admGuardarTermino").addEventListener("click", guardarTermino);

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
  // tamaño: puede venir como "tam", o del viejo "grande:true"
  document.getElementById("admFotoTam").value = g.tam || (g.grande ? "grande" : "chica");
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
  g.tam = document.getElementById("admFotoTam").value;
  delete g.grande; // ya no se usa el campo viejo
  if (!admin.galeria.includes(g)) admin.galeria.push(g);
  cerrar("admFoto"); renderGaleria(); await guardarTodo(); adminToast("Foto guardada", "ok");
}

/* ---------- término del glosario ---------- */
function abrirTermino(id, tema) {
  const t = admin.glosario.find(x => x.id === id) || { id: "", tema: tema || "vidrios", termino: "", def: "" };
  document.getElementById("admTerminoTitle").textContent = id ? "Editar término" : "Nuevo término";
  document.getElementById("admTerminoId").value = t.id;
  document.getElementById("admTerminoTemaSel").value = t.tema;
  document.getElementById("admTerminoNombre").value = t.termino;
  document.getElementById("admTerminoDef").value = t.def;
  abrir("admTermino");
}
async function guardarTermino() {
  const id = document.getElementById("admTerminoId").value;
  const obj = {
    id: id || ("t" + Date.now()),
    tema: document.getElementById("admTerminoTemaSel").value,
    termino: document.getElementById("admTerminoNombre").value.trim() || "Término",
    def: document.getElementById("admTerminoDef").value.trim(),
  };
  const i = admin.glosario.findIndex(x => x.id === obj.id);
  if (i >= 0) admin.glosario[i] = obj; else admin.glosario.push(obj);
  cerrar("admTermino"); renderGlosario(); await guardarTodo(); adminToast("Término guardado", "ok");
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
  renderGlosario();
}

// buscador del glosario: oculta los términos que no coinciden
function initBuscadorGlosario() {
  const input = document.getElementById("buscarGlosario");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(".glo-tema").forEach(tema => {
      let visibles = 0;
      tema.querySelectorAll(".glo-item").forEach(item => {
        const texto = item.textContent.toLowerCase();
        const match = texto.includes(q);
        item.classList.toggle("oculto", !match);
        if (match) visibles++;
      });
      // si el tema no tiene resultados, oculto el tema entero
      tema.classList.toggle("oculto", visibles === 0);
    });
  });
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
  initBuscadorGlosario();

  // restaurar sesión
  if (modoRemoto && sb) {
    try { const { data } = await sb.auth.getSession(); if (data && data.session) { admin.isAdmin = true; aplicarModo(true); } } catch (e) {}
  } else {
    try { if (sessionStorage.getItem("sj_admin") === "1") { admin.isAdmin = true; aplicarModo(true); } } catch (e) {}
  }
})();
