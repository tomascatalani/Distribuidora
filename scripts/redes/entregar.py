"""Copia las imágenes finales a la carpeta del proyecto, con un texto por pieza, y arma un zip.
Uso: python3 -I scripts/redes/entregar.py <carpeta de trabajo> <carpeta destino> [lote] [título]
Sin lote ni título arma el de diciembre 2026 (lote diciembre-2026)."""
import json, os, shutil, sys, zipfile

base, dst = sys.argv[1], sys.argv[2]
lote = sys.argv[3] if len(sys.argv) > 3 else 'diciembre-2026'
titulo = sys.argv[4] if len(sys.argv) > 4 else 'Borradores de ' + lote.replace('-', ' ')
P = json.load(open(os.path.join(base, 'piezas_final.json')))
os.makedirs(dst, exist_ok=True)

indice = [titulo + ' para Instagram y Facebook', '',
          'Están también en Metricool como borrador: no se publican solos.',
          'Las imágenes de cada carpeta son las mismas que guardó Metricool, en calidad completa.', '']
for p in P:
    carpeta = os.path.join(dst, p['id'])
    os.makedirs(carpeta, exist_ok=True)
    src = os.path.join(base, 'final', p['id'])
    for f in sorted(os.listdir(src)):
        shutil.copyfile(os.path.join(src, f), os.path.join(carpeta, f))
    d, m = p['fecha'][8:10].lstrip('0'), p['fecha'][5:7]
    lineas = [f"{p['tipo']} del {p['dia']} {d}/{int(m)} a las {p['hora']}: {p['titulo']}", '',
              f"Canción sugerida: {p['musica']} (álbum El ritual de la palta, de PUESTO DE PALTA).",
              f"Notas: {p['notas']}", '']
    if p.get('texto'):
        lineas += ['Texto del post (para copiar y pegar):', '', p['texto'], '']
    else:
        lineas += ['Las historias no llevan texto: lo que haya que agregar va en las notas de arriba.', '']
    open(os.path.join(carpeta, 'texto-y-notas.txt'), 'w').write('\n'.join(lineas))
    indice.append(f"- {d}/{int(m)} {p['hora']} · {p['tipo']} · {p['titulo']} · {len(os.listdir(src))} imagen(es) · {p['musica']}")
open(os.path.join(dst, 'LEEME.txt'), 'w').write('\n'.join(indice) + '\n')
zp = os.path.join(dst, f'{lote}-todo.zip')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_STORED) as z:
    z.write(os.path.join(dst, 'LEEME.txt'), f'{lote}/LEEME.txt')
    for p in P:
        carpeta = os.path.join(dst, p['id'])
        for f in sorted(os.listdir(carpeta)):
            z.write(os.path.join(carpeta, f), f"{lote}/{p['id']}/{f}")
print('zip', round(os.path.getsize(zp) / 1e6, 1), 'MB')
print(open(os.path.join(dst, 'LEEME.txt')).read())
