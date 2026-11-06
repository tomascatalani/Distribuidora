"""Hoja de vista previa de cada pieza. Uso: python3 -I scripts/redes/preview.py <carpeta png> <carpeta salida>"""
import glob, os, sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for d in sorted(glob.glob(os.path.join(src, '*'))):
    fs = sorted(glob.glob(os.path.join(d, '*.png')))
    if not fs:
        continue
    first = Image.open(fs[0])
    w, h = 360, round(360 * first.height / first.width)
    cols = min(len(fs), 4 if h < 500 else 5)
    rows = (len(fs) + cols - 1) // cols
    c = Image.new('RGB', (cols * (w + 10) - 10, rows * (h + 10) - 10), 'white')
    for k, f in enumerate(fs):
        im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
        c.paste(im, ((k % cols) * (w + 10), (k // cols) * (h + 10)))
    c.save(os.path.join(out, os.path.basename(d) + '.jpg'), quality=88)
    print(os.path.basename(d), len(fs), c.size)
