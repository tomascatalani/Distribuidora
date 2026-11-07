"""Sube las imágenes finales a Cloudinary (preset sin firma) y guarda las URLs.
Lee CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET del entorno; no imprime claves.
Uso: python3 -I scripts/redes/subir.py <carpeta de trabajo> [lote]
El lote es el nombre de la carpeta en Cloudinary (por ejemplo enero-febrero-2027); si no se pone, diciembre-2026."""
import glob, json, os, sys, uuid, urllib.request

base = sys.argv[1]
lote = sys.argv[2] if len(sys.argv) > 2 else 'diciembre-2026'
cloud, preset = os.environ['CLOUDINARY_CLOUD_NAME'], os.environ['CLOUDINARY_UPLOAD_PRESET']
url = f'https://api.cloudinary.com/v1_1/{cloud}/image/upload'
out_path = os.path.join(base, 'urls.json')
urls = json.load(open(out_path)) if os.path.exists(out_path) else {}


def post(fields, fpath):
    b = uuid.uuid4().hex
    body = b''
    for k, v in fields.items():
        body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    body += (f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="{os.path.basename(fpath)}"\r\n'
             'Content-Type: image/jpeg\r\n\r\n').encode() + open(fpath, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request(url, data=body, method='POST',
                                 headers={'Content-Type': f'multipart/form-data; boundary={b}'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


for f in sorted(glob.glob(os.path.join(base, 'final', '*', '*.jpg'))):
    pieza = os.path.basename(os.path.dirname(f))
    pid = os.path.splitext(os.path.basename(f))[0]
    if pid in urls:
        continue
    r = post({'upload_preset': preset, 'folder': f'puesto-de-palta/redes/{lote}/{pieza}', 'public_id': pid}, f)
    urls[pid] = {'url': r['secure_url'], 'bytes': r.get('bytes'), 'w': r.get('width'), 'h': r.get('height'), 'format': r.get('format')}
    json.dump(urls, open(out_path, 'w'), indent=1)
    print(pid, r.get('width'), r.get('height'), r.get('bytes'), r.get('format'))
print('total', len(urls))
