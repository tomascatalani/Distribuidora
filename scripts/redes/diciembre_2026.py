"""Arma el HTML de las piezas de diciembre 2026 (mismo diseño que el lote 1).
Uso: python3 -I scripts/redes/diciembre_2026.py <carpeta de trabajo>
Escribe <trabajo>/build/<pieza>.html y las fotos recortadas en <trabajo>/build/assets/. Las fotos originales van en <trabajo>/fotos_full/ (bajadas del Drive) y las fuentes y el logo los deja preparar.py."""
import os, sys, json
from PIL import Image, ImageOps

BASE = sys.argv[1]
SRC = os.path.join(BASE, 'fotos_full')
OUT = os.path.join(BASE, 'build')
ASSETS = os.path.join(OUT, 'assets')

# ---------- fotos: recorte (archivo, nombre, formato, desplazamiento 0..1) ----------
CROPS = {
    'd01-portada': ('DSC_0604.JPG', 'post', 0.75),
    'd01-cierre': ('DSC_0612.JPG', 'post', 0.55),
    'd08-portada': ('143969.jpg', 'post', 0.5),
    'd08-cierre': ('143650.jpg', 'post', 0.5, 0.86),
    'd10-dato': ('DSC_0587.JPG', 'post', 0.5),
    'd10-historia': ('DSC_0587.JPG', 'story', 0.55),
    'd13-historia': ('DSC_0683.JPG', 'band', 0.78),
    'd15-portada': ('DSC_0665.JPG', 'post', 0.6),
    'd15-cierre': ('DSC_0681.JPG', 'post', 0.5),
    'd22-portada': ('DSC_0821.JPG', 'post', 0.35),
    'd22-cierre': ('DSC_0802.JPG', 'post', 0.5),
    'd27-historia': ('DSC_0580.JPG', 'band', 0.55),
    'd29-portada': ('DSC_0578.JPG', 'post', 0.55),
    'd29-cierre': ('DSC_0590.JPG', 'post', 0.45),
}
SIZES = {'post': (1080, 1350), 'story': (1080, 1920), 'band': (1080, 820)}


def crop(name):
    fn, kind, off = CROPS[name][:3]
    zoom = CROPS[name][3] if len(CROPS[name]) > 3 else 1.0
    W, H = SIZES[kind]
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, fn))).convert('RGB')
    iw, ih = im.size
    if iw / ih > W / H:  # sobra ancho
        cw = round(ih * W / H)
        x = round((iw - cw) * off)
        box = (x, 0, x + cw, ih)
    else:  # sobra alto
        ch = round(iw * H / W)
        y = round((ih - ch) * off)
        box = (0, y, iw, y + ch)
    if zoom != 1.0:
        bx0, by0, bx1, by1 = box
        bw, bh = (bx1 - bx0), (by1 - by0)
        nw, nh = round(bw * zoom), round(bh * zoom)
        cx, cy = bx0 + bw / 2, by0 + bh / 2
        box = (round(cx - nw / 2), round(cy - nh / 2), round(cx - nw / 2) + nw, round(cy - nh / 2) + nh)
    im = im.crop(box).resize((W, H), Image.LANCZOS)
    im.save(os.path.join(ASSETS, name + '.jpg'), quality=95, subsampling=0)
    return name + '.jpg'


CSS = """
  :root { --verde:#4a7c59; --crema:#faf8f4; --negro:#0a0a0a; --gris:#e8e4dc; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#333; }
  .slide { width:1080px; height:1350px; position:relative; overflow:hidden; display:flex; flex-direction:column;
           padding:96px 96px 88px; font-family:'Open Sans',sans-serif; margin-bottom:40px; }
  .story { height:1920px; padding:230px 96px 300px; }
  .top { display:flex; justify-content:space-between; align-items:center; font-size:22px; font-weight:600;
         letter-spacing:0.28em; text-transform:uppercase; }
  .body { flex:1; display:flex; flex-direction:column; justify-content:center; }
  .big { font-family:'Libre Baskerville',serif; font-size:76px; line-height:1.18; letter-spacing:-0.01em; text-wrap:balance; }
  .big.m { font-size:64px; }
  .big.s { font-size:56px; }
  .big em, .huge em { font-style:italic; }
  .huge { font-family:'Libre Baskerville',serif; font-size:200px; line-height:1; letter-spacing:-0.03em; }
  .huge.xl { font-size:230px; }
  .huge.l { font-size:170px; }
  .small { font-size:36px; line-height:1.5; margin-top:56px; max-width:860px; text-wrap:pretty; }
  .small.s { font-size:33px; }
  .label { font-size:24px; font-weight:600; letter-spacing:0.28em; text-transform:uppercase; margin-bottom:22px; }
  .bottom { display:flex; justify-content:space-between; align-items:flex-end; font-size:24px; letter-spacing:0.12em; }
  .rule { width:96px; height:4px; margin-bottom:48px; }
  .nowrap { white-space:nowrap; }
  .gap { flex:0 0 auto; }

  .crema { background:var(--crema); color:var(--negro); }
  .crema .top, .crema .label { color:var(--verde); }
  .crema .rule { background:var(--verde); }
  .crema .small { color:#3b3b3b; }
  .crema .bottom { color:#8a867e; }
  .crema .tenue { color:#b9b4aa; }
  .crema .acento { color:var(--verde); }

  .negro { background:var(--negro); color:var(--crema); }
  .negro .top, .negro .label { color:#7fb08d; }
  .negro .rule { background:var(--verde); }
  .negro .small { color:rgba(250,248,244,0.75); }
  .negro .bottom { color:rgba(250,248,244,0.45); }
  .negro .acento { color:#7fb08d; }

  .verde { background:var(--verde); color:var(--crema); }
  .verde .top, .verde .label { color:rgba(250,248,244,0.8); }
  .verde .rule { background:var(--crema); }
  .verde .small { color:rgba(250,248,244,0.88); }
  .verde .bottom { color:rgba(250,248,244,0.6); }

  .foto { color:var(--crema); background-size:cover; background-position:center; }
  .foto::before { content:''; position:absolute; inset:0;
                  background:linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.82) 100%); }
  .foto.partida::before { background:linear-gradient(180deg, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.2) 36%, rgba(10,10,10,0.15) 52%, rgba(10,10,10,0.86) 100%); }
  .foto.oscura::before { background:linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.45) 35%, rgba(10,10,10,0.9) 62%, rgba(10,10,10,0.94) 100%); }
  .foto > * { position:relative; }
  .foto .top, .foto .label { color:#a9d4b4; }
  .foto .body { justify-content:flex-end; padding-bottom:40px; }
  .foto.partida .body { justify-content:space-between; padding:56px 0 24px; }
  .foto .rule { background:var(--verde); }
  .foto .small { color:rgba(250,248,244,0.88); }
  .foto .bottom { color:rgba(250,248,244,0.72); }
  .logo { width:120px; height:120px; }

  .banda { position:absolute; left:0; right:0; bottom:0; height:820px; background-size:cover; background-position:center; }
  .banda::before { content:''; position:absolute; inset:0;
                   background:linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 70%, rgba(10,10,10,0.7) 100%); }
  .story.negro .body { flex:0 0 auto; justify-content:flex-start; padding-top:80px; }
  .banda2 { flex:1 1 auto; margin:0 -96px 36px; background-size:cover; background-position:center; position:relative; }
  .banda2::before { content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 22%, rgba(10,10,10,0) 78%, rgba(10,10,10,1) 100%); }
"""


def page(slides):
    return ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<link rel="stylesheet" href="assets/local-fonts.css">\n<style>' + CSS + '</style>\n</head>\n<body>\n'
            + '\n'.join(slides) + '\n</body>\n</html>\n')


def slide(cls, top_l, top_r, body, bot_l='', bot_r='', photo=None, extra=''):
    style = f" style=\"background-image:url('assets/{photo}')\"" if photo else ''
    return (f'<section class="slide {cls}"{style}>{extra}\n'
            f'  <div class="top"><span>{top_l}</span><span>{top_r}</span></div>\n'
            f'  <div class="body">{body}</div>\n'
            f'  <div class="bottom"><span>{bot_l}</span>{bot_r}</div>\n</section>')


LOGO = '<img class="logo" src="assets/logo.png" alt="">'
PDP = 'Puesto de Palta'


def carrusel(slides_spec, label):
    n = len(slides_spec)
    out = []
    for i, s in enumerate(slides_spec, 1):
        cls, body = s[0], s[1]
        photo = s[2] if len(s) > 2 else None
        bl = s[3] if len(s) > 3 else label
        br = s[4] if len(s) > 4 else ''
        out.append(slide(cls, PDP, f'{i}/{n}', body, bl, f'<span>{br}</span>' if br and br != LOGO else (br or '<span></span>'), photo))
    return out


def R():
    return '<div class="rule"></div>'


# ---------- piezas ----------
P = {}

# 1/12 La palta que nadie cultivó a propósito
P['2026-12-01-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">La palta que nadie cultivó <em>a propósito.</em></div>'
             '<div class="small">Y que tal vez sea el plan B del mundo.</div>', crop('d01-portada'), 'NOTAS DEL PUESTO', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">El mundo come casi una sola palta: la Hass.</div>'
              '<div class="small">Una sola variedad, clonada en millones de árboles, desde Estados Unidos hasta Argentina y desde España hasta Sudáfrica. Viaja bien, dura y la cáscara avisa cuando está lista.</div>'),
    ('negro', R() + '<div class="big">Eso funciona, hasta que deja de funcionar.</div>'
              '<div class="small">Un hongo, <em>Phytophthora cinnamomi</em>, pudre la raíz de los árboles y ya es un problema serio en varios países. La Hass casi no tiene defensas contra él, y no hay otra variedad lista para reemplazarla.</div>'),
    ('crema', '<div class="huge">47</div><div class="big" style="margin-top:8px"><em>variedades sin registrar.</em></div>'
              '<div class="small">Crecen en Nicaragua y Honduras, no tienen nombre y nadie las exporta. Su ADN es distinto a todo lo conocido, y quienes las cultivan nunca tuvieron problemas con la pudrición de la raíz.</div>'),
    ('verde', R() + '<div class="big">Una historia de <em>5.000 años.</em></div>'
              '<div class="small">La hipótesis del estudio: gente que migró desde Sudamérica hace unos cinco mil años llevó semillas, y esas semillas se cruzaron con las paltas de Centroamérica. Nadie buscaba una palta resistente. Salió igual.</div>'),
    ('foto', R() + '<div class="big">¿Y si el plan B de la palta <em>ya existe?</em></div>'
             '<div class="small">La nota completa está en el blog.</div>', crop('d01-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'LA PALTA QUE NADIE CULTIVÓ')

# 3/12 historia: curiosidad
P['2026-12-03-historia'] = [slide('verde story', PDP, 'Curiosidad',
    R() + '<div class="big">Hay 47 variedades de palta que la ciencia no tenía registradas.</div>'
    '<div class="small">Crecen en Nicaragua y Honduras. Nadie las cultivó a propósito.</div>'
    '<div class="gap" style="height:430px"></div>',
    'PUESTODEPALTA.COM', '<span></span>')]

# 8/12 Pedila en su punto para las Fiestas
WA = '<span class="nowrap">11 4027 0343</span>'
P['2026-12-08-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">Para las Fiestas, pedila <em>en su punto.</em></div>'
             '<div class="small">Nos decís para qué día la querés y llega lista.</div>', crop('d08-portada'), 'FIESTAS 2026', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">Decinos para qué día la querés.</div>'
              '<div class="small">Y te la mandamos en el punto que la necesitás: lista para comer ese día, ni dura ni pasada.</div>'),
    ('negro', R() + '<div class="big">Entregamos de lunes a sábado.</div>'
              '<div class="small">Feriados incluidos, como el 8 de diciembre.</div>'),
    ('verde', R() + '<div class="big">El 24 y el 31, <em>también.</em></div>'
              '<div class="small">Para que la palta llegue a la mesa de Nochebuena y de fin de año.</div>'),
    ('crema', R() + '<div class="big">El 25 de diciembre y el 1 de enero, no.</div>'
              '<div class="small">Esos dos días no hay entregas, y los domingos tampoco. Pedí con tiempo.</div>'),
    ('foto oscura', R() + '<div class="big">¿Cómo pedir?</div>'
             f'<div class="small">Escribinos por WhatsApp al {WA}: cuántas querés, para qué día y para qué las vas a usar. Ahí también te contamos si llegamos a tu zona.</div>',
     crop('d08-cierre'), f'WHATSAPP {WA}', LOGO),
], 'FIESTAS 2026')

# 10/12 dato 1926
P['2026-12-10-dato'] = [slide('foto partida', PDP, 'Dato del jueves',
    '<div class="huge xl">1926</div>'
    '<div><div class="big m">Un carozo en un patio de California.</div>'
    '<div class="small" style="margin-top:32px">De ahí viene casi toda la palta Hass del mundo.</div></div>',
    'LA CUNA DEL HASS', LOGO, photo=crop('d10-dato'))]

# 10/12 historia: pregunta
P['2026-12-10-historia'] = [slide('foto partida story', PDP, 'Pregunta',
    '<div class="big">¿De dónde creés que viene la palta Hass?</div>'
    '<div class="small" style="margin-top:0">La respuesta, en el post de hoy.</div>',
    '', '<span></span>', photo=crop('d10-historia'))]

# 13/12 historia: nota nueva
P['2026-12-13-historia'] = [slide('negro story', PDP, 'Nota nueva',
    R() + '<div class="big m">La cuna del Hass ya no puede <em>competir.</em></div>'
    '<div class="small" style="margin-top:40px">California inventó la palta que come el mundo. Hoy no le puede ganar al precio de México.</div>',
    'PUESTODEPALTA.COM/BLOG', '<span></span>').replace('<div class="bottom">',
    f'<div class="gap" style="height:240px"></div><div class="banda2" style="background-image:url(\'assets/{crop("d13-historia")}\')"></div>\n  <div class="bottom">')]

# 15/12 La cuna del Hass ya no puede competir
P['2026-12-15-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">La cuna del Hass ya no puede <em>competir.</em></div>'
             '<div class="small">California inventó la palta que come el mundo. Ahora pide que la protejan.</div>', crop('d15-portada'), 'NOTAS DEL PUESTO', 'DESLIZÁ'),
    ('crema', R() + '<div class="big m">En 1926, Rudolph Hass plantó un carozo en un patio de California.</div>'
              '<div class="small">Creció un árbol raro, de cáscara negra y rugosa, que nadie en la industria quería. Hass lo dejó porque le gustaba, y lo patentó en 1935.</div>'),
    ('negro', R() + '<div class="big m">De ese árbol viene casi toda la palta Hass del mundo.</div>'
              '<div class="small">Pero fue México quien la hizo masiva: la plantó a escala industrial y la convirtió en el producto agrícola más exportado de América Latina.</div>'),
    ('crema', '<div class="huge">3.000</div><div class="big" style="margin-top:8px"><em>productores quedan en California.</em></div>'
              '<div class="small">Hace diez años eran 6.000.</div>'),
    ('verde', R() + '<div class="big m">De 2,20 a 0,75 dólares la libra.</div>'
              '<div class="small">Así cayó lo que cobra un productor de California por su palta. En el primer trimestre de 2026, México mandó 300 millones de libras más de lo previsto: más o menos lo que California produce en toda su temporada.</div>'),
    ('negro', R() + '<div class="big m">Ahora piden frenar la palta mexicana.</div>'
              '<div class="small">Los productores de California le pidieron al gobierno de Estados Unidos un límite a las importaciones de México entre marzo y septiembre, cuando ellos cosechan.</div>'),
    ('foto', R() + '<div class="big m">Dicen que su palta es mejor. El mercado pregunta <em>cuánto sale el cajón.</em></div>'
             '<div class="small">La nota completa está en el blog.</div>', crop('d15-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'LA CUNA DEL HASS')

# 17/12 dato 6.000 / 3.000
DATO17 = ('<div class="label">Hace diez años</div><div class="huge tenue">6.000</div>'
          '<div class="big s" style="margin-top:20px">productores de palta en California.</div>'
          '<div class="label" style="margin-top:84px">Hoy</div><div class="huge acento">3.000</div>')
P['2026-12-17-dato'] = [slide('crema', PDP, 'Dato del jueves', DATO17, 'LA CUNA DEL HASS', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 17/12 historia: encuesta
P['2026-12-17-historia'] = [slide('crema story', PDP, 'Dato del jueves',
    DATO17 + '<div class="gap" style="height:380px"></div>', 'PUESTODEPALTA.COM', '<span></span>')]

# 22/12 El punto exacto 1
P['2026-12-22-carrusel'] = carrusel([
    ('foto', '<div class="label">El punto exacto · 1</div>' + R() + '<div class="big">Cómo guardar la palta <em>con 35 grados.</em></div>',
     crop('d22-portada'), 'GUARDALO PARA EL VERANO', 'DESLIZÁ'),
    ('crema', R() + '<div class="big"><em>Verde:</em> afuera y a la sombra.</div>'
              '<div class="small">Si todavía está dura, no va a la heladera. Dejala en un lugar fresco, sin sol. Con calor madura más rápido: revisala todos los días.</div>'),
    ('verde', R() + '<div class="big"><em>Lista:</em> a la heladera.</div>'
              '<div class="small">Cuando cede apenas al apretarla, ya está. En la heladera aguanta unos días más sin pasarse.</div>'),
    ('negro', R() + '<div class="big"><em>Cortada:</em> limón y bien tapada.</div>'
              '<div class="small">Lo que la pone marrón es el aire. Un poco de limón sobre la pulpa, film bien pegado y a la heladera.</div>'),
    ('crema', R() + '<div class="big">El carozo solo protege <em>lo que tapa.</em></div>'
              '<div class="small">Dejarlo puesto ayuda, pero solo en la parte que queda debajo. El resto se oscurece igual si no la tapás.</div>'),
    ('foto', R() + '<div class="big m">¿La querés lista para un día justo? <em>Pedila en su punto.</em></div>'
             f'<div class="small">Por WhatsApp al {WA}. En enero, El punto exacto 2: cómo saber si está lista sin lastimarla.</div>',
     crop('d22-cierre'), f'WHATSAPP {WA}', LOGO),
], 'EL PUNTO EXACTO · 1')

# 27/12 historia: nota nueva
P['2026-12-27-historia'] = [slide('negro story', PDP, 'Nota nueva',
    R() + '<div class="big m">El árbol que no sabemos cómo va a <em>actuar.</em></div>'
    '<div class="small" style="margin-top:40px">Durante cien años, nadie pudo saber cómo iba a florecer un palto recién plantado.</div>',
    'PUESTODEPALTA.COM/BLOG', '<span></span>').replace('<div class="bottom">',
    f'<div class="gap" style="height:240px"></div><div class="banda2" style="background-image:url(\'assets/{crop("d27-historia")}\')"></div>\n  <div class="bottom">')]

# 29/12 El árbol que no sabemos cómo va a actuar
P['2026-12-29-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">La flor de la palta abre <em>dos veces.</em></div>'
             '<div class="small">Y durante cien años nadie supo cómo iba a hacerlo cada árbol.</div>', crop('d29-portada'), 'NOTAS DEL PUESTO', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">Primero abre como hembra. Después, como macho.</div>'
              '<div class="small">Se abre buscando polen, se cierra, y vuelve a abrirse soltando el suyo. Un sistema raro, casi ridículo si lo pensás bien.</div>'),
    ('negro', R() + '<div class="big">Hay árboles tipo A y tipo B.</div>'
              '<div class="small">Cada tipo lo hace en un horario distinto: cuando uno está recibiendo polen, el otro lo está dando. Por eso se necesitan de a pares.</div>'),
    ('verde', R() + '<div class="big m">Para saber de qué tipo era un árbol, había que esperar <em>años.</em></div>'
              '<div class="small">Cinco, siete, a veces diez: hasta que florecía. Recién ahí te enterabas.</div>'),
    ('crema', '<div class="huge">42</div><div class="big" style="margin-top:8px"><em>millones de años.</em></div>'
              '<div class="small">En julio de 2026, investigadores de la Universidad de California encontraron el gen que lo decide. Tiene 42 millones de años: es más viejo que los humanos. Ahora se puede saber el tipo de cada árbol desde que nace.</div>'),
    ('foto', R() + '<div class="big">El palto guardó bien <em>su secreto.</em></div>'
             '<div class="small">La nota completa está en el blog.</div>', crop('d29-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'EL ÁRBOL QUE NO SABEMOS CÓMO VA A ACTUAR')

# 31/12 2026 en la palta, en 8 números
def num(cls, n, unit, txt, nota, size=''):
    return (cls, f'<div class="huge {size}">{n}</div><div class="big" style="margin-top:8px"><em>{unit}</em></div>'
                 f'<div class="small">{txt}</div>', None, f'NOTA: {nota}')

P['2026-12-31-carrusel'] = carrusel([
    ('verde', R() + '<div class="big">2026 en la palta, en <em>8 números.</em></div>'
              '<div class="small">Todo lo que fuimos contando en el blog este año.</div>', None, 'PUESTO DE PALTA', 'DESLIZÁ'),
    num('crema', '33.770', 'toneladas', 'de palta iba a importar Argentina en la temporada 2025-2026, según las proyecciones. Dos temporadas antes eran 8.100.', 'EL NÚMERO QUE NADIE PLANEÓ', 'l'),
    num('negro', '85.000', 'toneladas', 'de palta mexicana se proyectó que entraran a Estados Unidos solo durante el Mundial.', 'LA FRUTA QUE TAMBIÉN CLASIFICÓ AL MUNDIAL', 'l'),
    num('verde', '89%', 'no pasó la prueba.', 'De 54 productos con “aceite de palta” en la etiqueta, comprados en California, 48 tenían en realidad aceite de soja, canola o cártamo.', 'LO QUE DICE ACEITE DE PALTA EN LA ETIQUETA'),
    num('crema', '47', 'variedades sin registrar', 'crecen en Nicaragua y Honduras. Nadie las cultivó a propósito, y quizás sean el plan B del mundo.', 'LA PALTA QUE NADIE CULTIVÓ A PROPÓSITO'),
    num('negro', '42', 'millones de años', 'tiene el gen que decide cómo florece el palto. Lo encontraron recién en 2026.', 'EL ÁRBOL QUE NO SABEMOS CÓMO VA A ACTUAR'),
    num('verde', '0,72', 'euros', 'llegó a costar una palta Hass en Francia entre junio y agosto. Menos que un café: había demasiada palta en Europa.', 'CUANDO HAY DEMASIADA PALTA'),
    num('crema', '52', 'semanas al año', 'de palta desde un solo lugar: lo que busca una empresa peruana al asociarse con productores de México.', 'SUPPLY SIN FIN'),
    num('negro', '1926', 'un carozo', 'en un patio de California. De ahí viene casi toda la palta Hass que se come en el mundo.', 'LA CUNA DEL HASS YA NO PUEDE COMPETIR'),
    ('verde', R() + '<div class="big">Gracias por leernos en 2026. <em>¡Feliz año!</em></div>'
              '<div class="small">Todas las notas están en el blog.</div>', None, 'PUESTODEPALTA.COM/BLOG', LOGO),
], '2026 EN LA PALTA')

meta = {}
for name, slides in P.items():
    with open(os.path.join(OUT, name + '.html'), 'w') as f:
        f.write(page(slides))
    meta[name] = {'slides': len(slides), 'story': 'historia' in name}
json.dump(meta, open(os.path.join(OUT, 'piezas.json'), 'w'), indent=1)
print(json.dumps(meta))
