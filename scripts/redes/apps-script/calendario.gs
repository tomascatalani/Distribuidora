/**
 * @OnlyCurrentDoc
 *
 * Calendario de redes de Puesto de Palta: una carpeta en el Drive por cada publicación, aviso cuando aparece el
 * archivo final, y dos carpetas para saber qué fotos y videos ya se usaron y cuáles quedan para usar.
 *
 * Va pegado en la planilla del calendario (Extensiones > Apps Script) y corre con la cuenta de quien lo instala.
 * Usa dos pestañas ocultas que arma Claude con el generador de la planilla:
 *   - Carpetas: en B1, el id de la carpeta madre del Drive. Desde la fila que dice "ID" en la columna A, una fila
 *     por publicación: su id, el nombre de su carpeta, el mes y (lo escribe este script) el id de la carpeta.
 *   - Material: lo que va en cada carpeta. Tipo "url" (una imagen que se baja de internet), "drive" (una copia de
 *     un archivo del Drive) o "texto" (un .txt con ese contenido). La columna Hecho la llena este script.
 *
 * Qué hace:
 *   1. armarCarpetas(): dentro de la carpeta madre crea "Redes por día", una carpeta por mes y una por publicación.
 *      Copia el material con su nombre nuevo (los originales quedan como estaban) y pone el link de cada carpeta en
 *      la columna Carpeta del calendario. Google corta cada vuelta a los 6 minutos: si no llega, sigue donde quedó
 *      en la vuelta siguiente.
 *   2. ordenarMaterial_(): dentro de la carpeta madre arma "Material ya usado" y "Material para usar", cada una con
 *      Fotos y Videos, con accesos directos (no copias: no ocupan lugar ni tocan los originales) a las fotos y
 *      videos de IMAGEN Y VIDEO > IMAGEN y VIDEO.
 *        - Ya usado: lo que está en las subcarpetas YA USADAS / YA USADOS, lo que usa el calendario (los archivos
 *          "drive" de la pestaña Material y la lista "Usado en el calendario (lo actualiza Claude).csv", que Claude
 *          deja en el Drive) y las otras copias con el mismo nombre.
 *        - Para usar: el resto de las fotos y videos sueltos de IMAGEN y VIDEO.
 *      Si un original pasa a YA USADAS, o lo empieza a usar el calendario, su acceso directo se muda solo. Lo repasa
 *      una vez por día, o cuando se toca "Armar las carpetas ahora".
 *   3. buscarFinales(): busca, dentro de las carpetas de cada día, archivos cuyo nombre empiece con FINAL. Escribe
 *      el nombre (con su link) en la columna Archivo final y, si la pieza todavía no estaba hecha, pasa el estado a
 *      "Listo para subir", que se pinta de verde.
 *   instalar() deja todo andando solo una vez por hora.
 *
 * No guarda claves ni ids: los ids viven en la planilla y en el Drive, que son privados.
 */

const HOJA_CAL = 'Calendario';
const HOJA_CARPETAS = 'Carpetas';
const HOJA_MATERIAL = 'Material';
const NOMBRE_RAIZ = 'Redes por día';
const LIMITE_MS = 4.5 * 60 * 1000;
const LISTO = 'Listo para subir';
const AVANZAN = ['Idea', 'A definir', 'Planificado por Pipi', 'Hay que grabar', 'Guion listo', 'Grabado'];

// Material ya usado y para usar
const NOMBRE_USADO = 'Material ya usado';
const NOMBRE_PARA_USAR = 'Material para usar';
const NOMBRE_LISTA = 'Usado en el calendario (lo actualiza Claude).csv';
const CARPETA_ORIGEN = 'IMAGEN Y VIDEO';  // dentro de la carpeta madre
const FUENTES = ['IMAGEN', 'VIDEO'];      // dentro de CARPETA_ORIGEN: sus fotos y videos sueltos son el material
const YA_USADO = /^\s*ya\s+usad/i;        // las subcarpetas YA USADAS y YA USADOS
const REPASO_MS = 20 * 60 * 60 * 1000;    // una vez por día
const MARGEN_MS = 90 * 1000;              // lo que tiene que quedar de la vuelta para arrancar a ordenar
const ATAJO = 'application/vnd.google-apps.shortcut';

// Una sola vez, al instalar: la hora de los Reels corregida el 9/11/2026 (se había tomado la de Metricool, que está
// en UTC, como si fuera la de Argentina). Si ya se cambió a mano, no encuentra nada y no toca nada.
const ARREGLOS = [['20 a 22 h', '19 a 21 h'], ['las 22 h llegaron', 'las 19 h llegaron'], ['las 18 h a 746', 'las 15 h a 746']];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Puesto de Palta')
    .addItem('Armar las carpetas ahora', 'menuArmar')
    .addItem('Buscar archivos FINAL ahora', 'menuFinales')
    .addSeparator()
    .addItem('Instalar (una sola vez)', 'instalar')
    .addToUi();
}

/** Se corre una vez desde el editor: crea el aviso de cada hora y arranca a armar las carpetas. */
function instalar() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'cadaHora'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('cadaHora').timeBased().everyHours(1).create();
  const horas = arreglarHoras_(SpreadsheetApp.getActive());
  const r = armarCarpetas(true);
  avisar_((r.termino && materialListo_(r)
    ? 'Listo: ' + r.carpetas + ' carpetas armadas, con su material. ' + textoMaterial_(r.material) + '. Desde ahora, una vez por hora, la planilla busca los archivos FINAL.'
    : 'Ya arrancó: ' + pendientes_(r) + '. Sigue sola en la próxima hora.') + textoError_(r) +
    (horas ? ' También corregí la hora de los Reels en la planilla: de 20 a 22 h pasó a 19 a 21 h.' : ''));
}

/** Hace los cambios de ARREGLOS en toda la planilla, una sola vez. Devuelve cuántos reemplazos hizo. */
function arreglarHoras_(ss) {
  const props = PropertiesService.getDocumentProperties();
  if (props.getProperty('horasCorregidas')) return 0;
  let n = 0;
  ARREGLOS.forEach(function (a) { n += ss.createTextFinder(a[0]).matchCase(true).replaceAllWith(a[1]); });
  props.setProperty('horasCorregidas', String(Date.now()));
  return n;
}

function cadaHora() {
  armarCarpetas(false);
  buscarFinales();
}

function menuArmar() {
  const r = armarCarpetas(true);
  avisar_((r.termino && materialListo_(r)
    ? 'Listo: todas las carpetas están armadas (' + r.carpetas + '). ' + textoMaterial_(r.material) + '.'
    : 'Falta: ' + pendientes_(r) + '. Sigue sola en la próxima hora, o volvé a tocar este botón.') + textoError_(r));
}

function menuFinales() {
  const n = buscarFinales();
  avisar_(n ? 'Listo: actualicé ' + n + ' fila(s) con su archivo final.' : 'No hay archivos FINAL nuevos.');
}

/**
 * Crea las carpetas que falten, pone sus links en el calendario, copia el material que falte y, si sobra tiempo,
 * ordena Material ya usado y Material para usar (con forzar, aunque ya se haya hecho en el día).
 */
function armarCarpetas(forzar) {
  const inicio = Date.now();
  const ss = SpreadsheetApp.getActive();
  const hc = ss.getSheetByName(HOJA_CARPETAS);
  const raiz = carpetaRaiz_(hc);
  const datos = hc.getDataRange().getValues();
  const f0 = filaEncabezado_(datos, HOJA_CARPETAS);
  const meses = {};
  const carpetas = {};  // id de la publicación -> id de su carpeta
  let sinTiempo = false;
  for (let i = f0 + 1; i < datos.length; i++) {
    const id = datos[i][0], nombre = datos[i][1], mes = datos[i][2], idCarpeta = datos[i][3];
    if (!id) continue;
    if (idCarpeta) { carpetas[id] = idCarpeta; continue; }
    if (Date.now() - inicio > LIMITE_MS) { sinTiempo = true; break; }
    if (!meses[mes]) meses[mes] = subcarpeta_(raiz, String(mes));
    const c = subcarpeta_(meses[mes], String(nombre));
    hc.getRange(i + 1, 4).setValue(c.getId());
    carpetas[id] = c.getId();
  }
  ponerLinks_(ss, carpetas);
  const faltan = sinTiempo ? contarFaltantes_(ss) : copiarMaterial_(ss, carpetas, inicio);
  let material = null;  // null: no hubo tiempo de ordenarlo en esta vuelta
  if (Date.now() - inicio < LIMITE_MS - MARGEN_MS) {
    try {
      material = ordenarMaterial_(ss, inicio, forzar);
    } catch (err) {
      material = { listo: false, error: err.message };
      Logger.log('Material ya usado y para usar: ' + err.message);
    }
  }
  return { termino: !sinTiempo && faltan === 0, carpetas: Object.keys(carpetas).length, faltan: faltan, material: material };
}

/** Copia lo que falte de la pestaña Material. Devuelve cuántos archivos quedan sin copiar. */
function copiarMaterial_(ss, carpetas, inicio) {
  const hm = ss.getSheetByName(HOJA_MATERIAL);
  const datos = hm.getDataRange().getValues();
  const f0 = filaEncabezado_(datos, HOJA_MATERIAL);
  let faltan = 0;
  for (let i = f0 + 1; i < datos.length; i++) {
    const id = datos[i][0], tipo = datos[i][1], fuente = datos[i][2], nombre = String(datos[i][3]), hecho = datos[i][4];
    if (!id || hecho) continue;
    if (Date.now() - inicio > LIMITE_MS || !carpetas[id]) { faltan++; continue; }
    const carpeta = DriveApp.getFolderById(carpetas[id]);
    let archivo = primero_(carpeta.getFilesByName(nombre));
    try {
      if (!archivo && tipo === 'drive') archivo = DriveApp.getFileById(String(fuente)).makeCopy(nombre, carpeta);
      if (!archivo && tipo === 'url') archivo = carpeta.createFile(UrlFetchApp.fetch(String(fuente)).getBlob().setName(nombre));
      if (!archivo && tipo === 'texto') archivo = carpeta.createFile(Utilities.newBlob('\uFEFF' + fuente, 'text/plain', nombre));
    } catch (err) {
      hm.getRange(i + 1, 6).setValue('Error (se reintenta en la próxima vuelta): ' + err.message);
      faltan++;
      continue;
    }
    if (archivo) {
      hm.getRange(i + 1, 5).setValue(archivo.getUrl());
      hm.getRange(i + 1, 6).clearContent();
    } else {
      faltan++;
    }
  }
  return faltan;
}

function contarFaltantes_(ss) {
  const datos = ss.getSheetByName(HOJA_MATERIAL).getDataRange().getValues();
  const f0 = filaEncabezado_(datos, HOJA_MATERIAL);
  return datos.slice(f0 + 1).filter(function (f) { return f[0] && !f[4]; }).length;
}

/**
 * Arma Material ya usado y Material para usar con accesos directos (ver el comentario de arriba). Crea los que
 * faltan, muda los que cambiaron de lado y saca los de originales que ya no están en IMAGEN ni en VIDEO.
 * Devuelve { listo, usado, paraUsar, faltan, error }, o { listo: true, salteado: true } si ya se hizo en el día.
 */
function ordenarMaterial_(ss, inicio, forzar) {
  const props = PropertiesService.getDocumentProperties();
  const ultimo = Number(props.getProperty('materialOrdenado') || 0);
  if (!forzar && ultimo && Date.now() - ultimo < REPASO_MS) return { listo: true, salteado: true };

  const madre = carpetaMadre_(ss.getSheetByName(HOJA_CARPETAS));
  const origen = carpetaPorNombre_(madre, CARPETA_ORIGEN);
  if (!origen) throw new Error('no encuentro la carpeta ' + CARPETA_ORIGEN + ' dentro de ' + madre.getName());

  // 1. Las fotos y videos de IMAGEN y VIDEO: los sueltos y los de YA USADAS / YA USADOS.
  const archivos = {};  // id del original -> { id, nombre, tipo: 'Fotos' | 'Videos', usado }
  const usadoNombre = {};
  const noEstan = [];
  FUENTES.forEach(function (n) {
    const fuente = carpetaPorNombre_(origen, n);
    if (!fuente) { noEstan.push(CARPETA_ORIGEN + ' > ' + n); return; }
    const subs = fuente.getFolders();
    while (subs.hasNext()) {
      const s = subs.next();
      if (s.isTrashed() || !YA_USADO.test(s.getName())) continue;
      recorrerMaterial_(s, function (a) { a.usado = true; usadoNombre[a.nombre] = true; agregar_(archivos, a); });
    }
    recorrerMaterial_(fuente, function (a) { agregar_(archivos, a); });
  });
  if (!Object.keys(archivos).length) throw new Error('no encuentro fotos ni videos en ' + CARPETA_ORIGEN);

  // 2. Lo que usa el calendario: la pestaña Material y la lista que deja Claude en el Drive.
  const usadoId = {};
  const dm = ss.getSheetByName(HOJA_MATERIAL).getDataRange().getValues();
  for (let i = filaEncabezado_(dm, HOJA_MATERIAL) + 1; i < dm.length; i++) {
    if (dm[i][0] && dm[i][1] === 'drive' && dm[i][2]) usadoId[String(dm[i][2]).trim()] = true;
  }
  leerLista_().forEach(function (r) {
    if (r.id) usadoId[r.id] = true;
    if (r.nombre) usadoNombre[r.nombre] = true;
  });
  // Si hay dos copias de la misma foto (mismo nombre) y se usó una, las dos van a ya usado.
  Object.keys(archivos).forEach(function (id) { if (usadoId[id]) usadoNombre[archivos[id].nombre] = true; });
  Object.keys(archivos).forEach(function (id) {
    const a = archivos[id];
    if (usadoId[id] || usadoNombre[a.nombre]) a.usado = true;
  });

  // 3. Las carpetas de destino y los accesos directos que ya están.
  const cu = subcarpeta_(madre, NOMBRE_USADO), cp = subcarpeta_(madre, NOMBRE_PARA_USAR);
  const destino = {
    usadoFotos: subcarpeta_(cu, 'Fotos'), usadoVideos: subcarpeta_(cu, 'Videos'),
    paraUsarFotos: subcarpeta_(cp, 'Fotos'), paraUsarVideos: subcarpeta_(cp, 'Videos'),
  };
  const hay = {};  // id del original -> { atajo, lugar }
  Object.keys(destino).forEach(function (lugar) {
    const it = destino[lugar].getFiles();
    while (it.hasNext()) {
      const f = it.next();
      if (f.isTrashed() || f.getMimeType() !== ATAJO) continue;  // si alguien dejó un archivo de verdad, no se toca
      const t = f.getTargetId();
      if (!t) continue;
      if (hay[t]) { f.setTrashed(true); continue; }  // repetido
      hay[t] = { atajo: f, lugar: lugar };
    }
  });

  // 4. Crear o mudar lo que haga falta: primero lo ya usado, que son menos.
  const ids = Object.keys(archivos).sort(function (x, y) { return archivos[y].usado - archivos[x].usado; });
  let faltan = 0, errores = 0, usado = 0, paraUsar = 0;
  ids.forEach(function (id) {
    const a = archivos[id];
    const lugar = (a.usado ? 'usado' : 'paraUsar') + a.tipo;
    if (a.usado) usado++; else paraUsar++;
    const h = hay[id];
    if (h && h.lugar === lugar) return;
    if (Date.now() - inicio > LIMITE_MS) { faltan++; return; }
    try {
      if (h) h.atajo.moveTo(destino[lugar]);
      else destino[lugar].createShortcut(id);
    } catch (err) {
      Logger.log('Acceso directo a ' + a.nombre + ' (se reintenta mañana): ' + err.message);
      errores++;
    }
  });
  if (faltan) return { listo: false, usado: usado, paraUsar: paraUsar, faltan: faltan };

  // 5. Sacar los accesos directos de originales que ya no están (borrados o movidos fuera de IMAGEN y VIDEO).
  //    Si no se encontró alguna carpeta de origen, no se saca nada, para no vaciar Fotos o Videos por error.
  if (!noEstan.length) {
    Object.keys(hay).forEach(function (t) { if (!archivos[t]) hay[t].atajo.setTrashed(true); });
  }
  props.setProperty('materialOrdenado', String(Date.now()));
  const r = { listo: true, usado: usado, paraUsar: paraUsar, faltan: 0 };
  if (noEstan.length) r.error = 'no encuentro ' + noEstan.join(' ni ');
  if (errores) r.error = (r.error ? r.error + '; ' : '') + errores + ' accesos directos fallaron y se reintentan mañana';
  return r;
}

/** Llama a fn con cada foto o video suelto de la carpeta (sin entrar en sus subcarpetas). */
function recorrerMaterial_(carpeta, fn) {
  const it = carpeta.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    if (f.isTrashed()) continue;
    const mime = String(f.getMimeType());
    const tipo = mime.indexOf('image/') === 0 ? 'Fotos' : mime.indexOf('video/') === 0 ? 'Videos' : '';
    if (tipo) fn({ id: f.getId(), nombre: f.getName(), tipo: tipo, usado: false });
  }
}

function agregar_(archivos, a) {
  if (archivos[a.id]) archivos[a.id].usado = archivos[a.id].usado || a.usado;
  else archivos[a.id] = a;
}

/** Lee la lista que deja Claude en el Drive (la más nueva, si hay varias): columnas Archivo, Id y Dónde se usa. */
function leerLista_() {
  const it = DriveApp.searchFiles("title = '" + NOMBRE_LISTA.replace(/'/g, "\\'") + "' and trashed = false");
  let lista = null;
  while (it.hasNext()) {
    const f = it.next();
    if (!/^text\//.test(f.getMimeType())) continue;
    if (!lista || f.getDateCreated() > lista.getDateCreated()) lista = f;
  }
  if (!lista) return [];
  const filas = Utilities.parseCsv(lista.getBlob().getDataAsString('UTF-8').replace(/^\uFEFF/, ''));
  return filas.slice(1).map(function (r) {
    return { nombre: String(r[0] || '').trim(), id: String(r[1] || '').trim() };
  });
}

function materialListo_(r) {
  return !!(r.material && r.material.listo);
}

function textoMaterial_(m) {
  return m.salteado
    ? 'Material ya usado y Material para usar están al día'
    : 'Material ya usado tiene ' + m.usado + ' accesos directos y Material para usar, ' + m.paraUsar;
}

function pendientes_(r) {
  const p = ['van ' + r.carpetas + ' carpetas'];
  if (r.faltan) p.push('faltan ' + r.faltan + ' archivos por copiar');
  if (!materialListo_(r)) {
    p.push(r.material && r.material.faltan
      ? 'faltan ' + r.material.faltan + ' accesos directos en Material ya usado y para usar'
      : 'Material ya usado y para usar se arman después');
  }
  return p.join(', ');
}

function textoError_(r) {
  return r.material && r.material.error ? ' (Material ya usado y para usar: ' + r.material.error + '.)' : '';
}

/** Pone "Abrir carpeta" con su link en la columna Carpeta, en las filas que todavía no lo tienen. */
function ponerLinks_(ss, carpetas) {
  const cal = ss.getSheetByName(HOJA_CAL);
  const col = columnas_(cal);
  const n = cal.getLastRow() - 1;
  if (n < 1) return;
  const ids = cal.getRange(2, col['ID'], n, 1).getValues();
  for (let i = 0; i < n; i++) {
    const idCarpeta = carpetas[ids[i][0]];
    if (!idCarpeta) continue;
    const celda = cal.getRange(i + 2, col['Carpeta']);
    if (celda.getRichTextValue().getLinkUrl()) continue;
    celda.setRichTextValue(link_('Abrir carpeta', 'https://drive.google.com/drive/folders/' + idCarpeta));
  }
}

/** Busca archivos FINAL en las carpetas de cada publicación y actualiza el calendario. Devuelve cuántas filas cambió. */
function buscarFinales() {
  const ss = SpreadsheetApp.getActive();
  const datos = ss.getSheetByName(HOJA_CARPETAS).getDataRange().getValues();
  const f0 = filaEncabezado_(datos, HOJA_CARPETAS);
  const porCarpeta = {};  // id de la carpeta -> id de la publicación
  for (let i = f0 + 1; i < datos.length; i++) {
    if (datos[i][0] && datos[i][3]) porCarpeta[datos[i][3]] = datos[i][0];
  }
  const finales = {};
  const it = DriveApp.searchFiles("title contains 'FINAL' and trashed = false");
  while (it.hasNext()) {
    const f = it.next();
    if (!/^\s*final/i.test(f.getName())) continue;
    const padres = f.getParents();
    while (padres.hasNext()) {
      const id = porCarpeta[padres.next().getId()];
      if (id && (!finales[id] || f.getLastUpdated() > finales[id].fecha)) {
        finales[id] = { nombre: f.getName(), url: f.getUrl(), fecha: f.getLastUpdated() };
      }
    }
  }
  const cal = ss.getSheetByName(HOJA_CAL);
  const col = columnas_(cal);
  const n = cal.getLastRow() - 1;
  if (n < 1) return 0;
  const ids = cal.getRange(2, col['ID'], n, 1).getValues();
  const estados = cal.getRange(2, col['Estado'], n, 1).getValues();
  const actuales = cal.getRange(2, col['Archivo final'], n, 1).getRichTextValues();
  let cambios = 0;
  for (let i = 0; i < n; i++) {
    const f = finales[ids[i][0]];
    if (!f) continue;
    let cambio = false;
    if (actuales[i][0].getText() !== f.nombre || actuales[i][0].getLinkUrl() !== f.url) {
      cal.getRange(i + 2, col['Archivo final']).setRichTextValue(link_(f.nombre, f.url));
      cambio = true;
    }
    if (AVANZAN.indexOf(String(estados[i][0])) >= 0) {
      cal.getRange(i + 2, col['Estado']).setValue(LISTO);
      cambio = true;
    }
    if (cambio) cambios++;
  }
  return cambios;
}

function carpetaMadre_(hc) {
  const idMadre = String(hc.getRange('B1').getValue() || '').trim();
  return idMadre ? DriveApp.getFolderById(idMadre) : DriveApp.getRootFolder();
}

function carpetaRaiz_(hc) {
  const guardada = String(hc.getRange('B2').getValue() || '').trim();
  if (guardada) {
    try {
      const c = DriveApp.getFolderById(guardada);
      if (!c.isTrashed()) return c;
    } catch (e) { /* la borraron: se arma de nuevo */ }
  }
  const raiz = subcarpeta_(carpetaMadre_(hc), NOMBRE_RAIZ);
  hc.getRange('B2').setValue(raiz.getId());
  return raiz;
}

function subcarpeta_(madre, nombre) {
  return carpetaPorNombre_(madre, nombre) || madre.createFolder(nombre);
}

/** La primera subcarpeta con ese nombre que no esté en la papelera, o null. */
function carpetaPorNombre_(madre, nombre) {
  const it = madre.getFoldersByName(nombre);
  while (it.hasNext()) {
    const c = it.next();
    if (!c.isTrashed()) return c;
  }
  return null;
}

function primero_(it) {
  return it.hasNext() ? it.next() : null;
}

function filaEncabezado_(datos, hoja) {
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][0]).trim() === 'ID') return i;
  }
  throw new Error('No encuentro la fila que dice ID en la pestaña ' + hoja + '.');
}

function columnas_(hoja) {
  const enc = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const col = {};
  enc.forEach(function (t, i) { if (t) col[String(t).trim()] = i + 1; });
  ['ID', 'Estado', 'Carpeta', 'Archivo final'].forEach(function (k) {
    if (!col[k]) throw new Error('Falta la columna ' + k + ' en la pestaña ' + HOJA_CAL + '.');
  });
  return col;
}

function link_(texto, url) {
  return SpreadsheetApp.newRichTextValue().setText(texto).setLinkUrl(url).build();
}

function avisar_(msg) {
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {
    try { SpreadsheetApp.getActive().toast(msg, 'Puesto de Palta', 15); } catch (e2) { /* corre solo, sin pantalla */ }
  }
  Logger.log(msg);
}
