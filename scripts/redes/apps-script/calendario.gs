/**
 * @OnlyCurrentDoc
 *
 * Calendario de redes de Puesto de Palta: una carpeta en el Drive por cada publicación, y aviso cuando
 * aparece el archivo final.
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
 *   2. buscarFinales(): busca, dentro de esas carpetas, archivos cuyo nombre empiece con FINAL. Escribe el nombre
 *      (con su link) en la columna Archivo final y, si la pieza todavía no estaba hecha, pasa el estado a
 *      "Listo para subir", que se pinta de verde.
 *   instalar() deja las dos cosas andando solas una vez por hora.
 *
 * No guarda claves ni ids: los ids viven en la planilla, que es privada.
 */

const HOJA_CAL = 'Calendario';
const HOJA_CARPETAS = 'Carpetas';
const HOJA_MATERIAL = 'Material';
const NOMBRE_RAIZ = 'Redes por día';
const LIMITE_MS = 4.5 * 60 * 1000;
const LISTO = 'Listo para subir';
const AVANZAN = ['Idea', 'A definir', 'Planificado por Pipi', 'Hay que grabar', 'Guion listo', 'Grabado'];

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
  const r = armarCarpetas();
  avisar_(r.termino
    ? 'Listo: ' + r.carpetas + ' carpetas armadas, con su material. Desde ahora, una vez por hora, la planilla busca los archivos FINAL.'
    : 'Ya arrancó: van ' + r.carpetas + ' carpetas y faltan ' + r.faltan + ' archivos por copiar. Sigue sola en la próxima hora.');
}

function cadaHora() {
  armarCarpetas();
  buscarFinales();
}

function menuArmar() {
  const r = armarCarpetas();
  avisar_(r.termino
    ? 'Listo: todas las carpetas están armadas (' + r.carpetas + ').'
    : 'Faltan ' + r.faltan + ' archivos por copiar. Sigue sola en la próxima hora, o volvé a tocar este botón.');
}

function menuFinales() {
  const n = buscarFinales();
  avisar_(n ? 'Listo: actualicé ' + n + ' fila(s) con su archivo final.' : 'No hay archivos FINAL nuevos.');
}

/** Crea las carpetas que falten, pone sus links en el calendario y copia el material que falte. */
function armarCarpetas() {
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
  return { termino: !sinTiempo && faltan === 0, carpetas: Object.keys(carpetas).length, faltan: faltan };
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
      if (!archivo && tipo === 'texto') archivo = carpeta.createFile(Utilities.newBlob('﻿' + fuente, 'text/plain', nombre));
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

function carpetaRaiz_(hc) {
  const guardada = String(hc.getRange('B2').getValue() || '').trim();
  if (guardada) {
    try { return DriveApp.getFolderById(guardada); } catch (e) { /* la borraron: se arma de nuevo */ }
  }
  const idMadre = String(hc.getRange('B1').getValue() || '').trim();
  const madre = idMadre ? DriveApp.getFolderById(idMadre) : DriveApp.getRootFolder();
  const raiz = subcarpeta_(madre, NOMBRE_RAIZ);
  hc.getRange('B2').setValue(raiz.getId());
  return raiz;
}

function subcarpeta_(madre, nombre) {
  return primero_(madre.getFoldersByName(nombre)) || madre.createFolder(nombre);
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
