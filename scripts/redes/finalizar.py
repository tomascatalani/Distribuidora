"""Pasa los PNG a JPG de alta calidad (calidad 95, sin submuestreo de color) con nombres finales.
Uso: python3 -I scripts/redes/finalizar.py <carpeta de trabajo>"""
import glob, os, sys
from PIL import Image

base = sys.argv[1]
src, dst = os.path.join(base, 'png'), os.path.join(base, 'final')
for d in sorted(glob.glob(os.path.join(src, '*'))):
    pieza = os.path.basename(d)
    out = os.path.join(dst, pieza)
    os.makedirs(out, exist_ok=True)
    for f in sorted(glob.glob(os.path.join(d, '*.png'))):
        n = os.path.splitext(os.path.basename(f))[0]
        im = Image.open(f).convert('RGB')
        p = os.path.join(out, f'{pieza}-{n}.jpg')
        im.save(p, quality=95, subsampling=0, optimize=True, dpi=(72, 72))
    fs = sorted(os.listdir(out))
    print(pieza, len(fs), Image.open(os.path.join(out, fs[0])).size,
          round(sum(os.path.getsize(os.path.join(out, x)) for x in fs) / 1e6, 2), 'MB')
