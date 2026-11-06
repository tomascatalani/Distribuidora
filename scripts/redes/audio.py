# Convierte un guion en un audio MP3 con voz sintética en español argentino.
#
# Uso: python3 -I scripts/redes/audio.py <guion.txt> <salida.mp3> [voz.onnx] [tomas]
#
# Cada frase se graba varias veces (por defecto hasta 6) y se queda la toma que
# Whisper transcribe mejor: la voz es al azar y a veces se come una letra. Al final
# muestra las frases que igual quedaron con errores, para cambiarles las palabras.
# Las tomas buenas se guardan en <salida>.tomas/ y no se vuelven a grabar.
# Instalación y consejos para escribir el guion: scripts/redes/README.md.
import sys, os, re, json, wave, hashlib, unicodedata, subprocess
import numpy as np
from piper import PiperVoice, SynthesisConfig
from faster_whisper import WhisperModel
from num2words import num2words

guion, salida = sys.argv[1], sys.argv[2]
modelo = sys.argv[3] if len(sys.argv) > 3 else 'es_AR-daniela-high.onnx'
TOMAS = int(sys.argv[4]) if len(sys.argv) > 4 else 6
WHISPER = 'deepdml/faster-whisper-large-v3-turbo-ct2'

# Cómo escribir para la voz las palabras que pronuncia mal.
PRONUNCIA = [(r'\bMetricool\b', 'Métricul'), (r'\bhummus\b', 'húmus'), (r'\bsushi\b', 'súchi'),
             (r'\bsticker\b', 'estíker'), (r'\bReels\b', 'videos'), (r'\bReel\b', 'video'), (r'\bups\b', 'úps')]
# Para comparar lo que oyó Whisper con lo que dice el guion.
IGUALES = [('metricul', 'metricool'), ('humus', 'hummus'), ('suchi', 'sushi'), ('estiker', 'sticker'),
           ('tik tok', 'tiktok'), ('tic toc', 'tiktok'), ('ientas', 'ientos')]


def para_la_voz(t):
    for a, b in PRONUNCIA:
        t = re.sub(a, b, t)
    t = re.sub(r'\s*"([^"]+)"\s*', lambda m: ', ' + m.group(1) + ', ', t)
    t = re.sub(r',\s*([,.:?!])', r'\1', t)
    return re.sub(r'\d+(?:\.\d{3})*', lambda m: num2words(int(m.group().replace('.', '')), lang='es'), t)


def palabras(s):
    s = s.lower()
    s = re.sub(r'(\d)\.(\d{3})', r'\1\2', s)
    s = re.sub(r'\d+', lambda m: ' ' + num2words(int(m.group()), lang='es') + ' ', s)
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = ' ' + re.sub(r'\s+', ' ', re.sub(r'[^a-z ]', ' ', s)) + ' '
    for a, b in IGUALES:
        s = s.replace(a, b)
    return s.split()


def distancia(a, b):
    d = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(b) + 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] != b[j - 1]))
    return d[len(b)]


voz = PiperVoice.load(modelo)
sr = voz.config.sample_rate
cfg = SynthesisConfig(length_scale=1.1, noise_scale=0.5, noise_w_scale=0.6)
oido = WhisperModel(WHISPER, device='cpu', compute_type='int8')
silencio = lambda seg: np.zeros(int(sr * seg), np.int16)


def oir(x):
    pad = silencio(0.3)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(sr), '-ac', '1', '-i', '-',
                          '-ar', '16000', '-f', 'f32le', '-'],
                         input=np.concatenate([pad, x, pad]).tobytes(), capture_output=True, check=True).stdout
    segs, _ = oido.transcribe(np.frombuffer(raw, np.float32), language='es', beam_size=5,
                              condition_on_previous_text=False, without_timestamps=True)
    return ' '.join(s.text.strip() for s in segs)


def grabar(frase):
    trozos = [c.audio_int16_array for c in voz.synthesize(frase, syn_config=cfg)]
    out = []
    for i, c in enumerate(trozos):
        out += [c] + ([silencio(0.25)] if i < len(trozos) - 1 else [])
    return np.concatenate(out)


cache = salida + '.tomas'
os.makedirs(cache, exist_ok=True)
parrafos = [p.strip().replace('\n', ' ') for p in open(guion, encoding='utf-8').read().split('\n\n') if p.strip()]
partes, pendientes = [silencio(0.4)], []
for pi, p in enumerate(parrafos):
    frases = re.split(r'(?<=[.?!])\s+', para_la_voz(p))
    for fi, f in enumerate(frases):
        ref, clave = palabras(f), os.path.join(cache, hashlib.sha1(f.encode()).hexdigest()[:12])
        mejor = None
        if os.path.exists(clave + '.json'):
            c = json.load(open(clave + '.json'))
            mejor = (c['errores'], np.fromfile(clave + '.raw', np.int16), c['oyo'])
        for _ in range(0 if mejor and mejor[0] == 0 else TOMAS):
            x = grabar(f)
            hip = oir(x)
            e = distancia(ref, palabras(hip))
            if mejor is None or e < mejor[0]:
                mejor = (e, x, hip)
            if e == 0:
                break
        e, x, hip = mejor
        x.tofile(clave + '.raw')
        json.dump(dict(errores=e, oyo=hip, frase=f), open(clave + '.json', 'w'), ensure_ascii=False)
        print(f'{pi + 1}.{fi + 1} errores={e} | {hip}', flush=True)
        if e:
            pendientes.append((f, hip))
        partes += [x, silencio(0.35 if fi < len(frases) - 1 else 0)]
    partes.append(silencio(0.85 if pi < len(parrafos) - 1 else 0.8))

crudo = salida + '.wav'
with wave.open(crudo, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes(np.concatenate(partes).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', crudo, '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11',
                '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '96k', salida], check=True)
os.remove(crudo)
print(f'\n{salida}: {round(sum(len(x) for x in partes) / sr)} segundos')
for f, hip in pendientes:
    print(f'Revisar: "{f}"\n  se oye: "{hip}"')
