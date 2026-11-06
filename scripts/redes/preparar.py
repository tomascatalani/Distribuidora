"""Baja las fuentes del sitio (Google Fonts) y el logo (Cloudinary) para armar piezas de redes.
Uso: python3 -I scripts/redes/preparar.py <carpeta de trabajo>
Deja en <trabajo>/build/assets/: los .woff2, local-fonts.css y logo.png."""
import os, re, sys, urllib.request

dst = os.path.join(sys.argv[1], 'build', 'assets')
os.makedirs(dst, exist_ok=True)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
CSS = ('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400'
       '&family=Open+Sans:wght@400;600&display=swap')
LOGO = 'https://res.cloudinary.com/dxlunrd1f/image/upload/f_png,w_240/v1773665883/puesto-de-palta/isologotipo.png'


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


css = get(CSS).decode()
out = []
for sub, b in re.findall(r'/\* ([a-z-]+) \*/\s*@font-face \{(.*?)\}', css, re.S):
    if sub != 'latin':
        continue
    fam = re.search(r"font-family: '([^']+)'", b).group(1)
    sty = re.search(r'font-style: (\w+)', b).group(1)
    w = re.search(r'font-weight: (\d+)', b).group(1)
    url = re.search(r'url\((https[^)]+)\)', b).group(1)
    fn = f"{fam.replace(' ', '')}-{sty}-{w}.woff2"
    open(os.path.join(dst, fn), 'wb').write(get(url))
    out.append(f"@font-face{{font-family:'{fam}';font-style:{sty};font-weight:{w};src:url('{fn}') format('woff2');}}")
open(os.path.join(dst, 'local-fonts.css'), 'w').write('\n'.join(out) + '\n')
open(os.path.join(dst, 'logo.png'), 'wb').write(get(LOGO))
print('\n'.join(out))
print('logo.png listo en', dst)
