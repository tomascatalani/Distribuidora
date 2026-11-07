"""Arma el HTML de las piezas de enero y febrero 2027 (mismo diseño que diciembre).
Uso: python3 -I scripts/redes/enero_febrero_2027.py <carpeta de trabajo>
Escribe <trabajo>/build/<pieza>.html y las fotos recortadas en <trabajo>/build/assets/. Las fotos originales van en
<trabajo>/fotos_full/ (bajadas del Drive) y las fuentes y el logo los deja preparar.py.
En el Drive hay nombres repetidos (dos DSC_0733, por ejemplo), así que cada foto se guarda como n<orden>_<nombre>.
La lista con el id de cada una está en la carpeta del proyecto (redes/enero-febrero-2027/fotos.tsv), no en el repo."""
import os, sys, json
from PIL import Image, ImageOps

BASE = sys.argv[1]
SRC = os.path.join(BASE, 'fotos_full')
OUT = os.path.join(BASE, 'build')
ASSETS = os.path.join(OUT, 'assets')

# ---------- fotos: recorte (archivo, formato, desplazamiento 0..1[, zoom[, brillo]]) ----------
# brillo: gamma mayor que 1 aclara las sombras sin quemar las luces (para las fotos oscuras)
CROPS = {
    'e05-portada': ('n423_DSC_0673.JPG', 'post', 0.5),
    'e05-cierre': ('n420_DSC_0670.JPG', 'post', 0.5),
    'e10-historia': ('n466_DSC_0733.JPG', 'band', 0.5, 1.0, 1.3),
    'e12-portada': ('n464_DSC_0732.JPG', 'post', 1.0, 1.0, 1.3),
    'e12-cierre': ('n476_DSC_0738.JPG', 'post', 1.0, 1.0, 1.3),
    'e19-portada': ('n201_DFB_3100.jpg', 'post', 0.45),
    'e19-cierre': ('n204_DFB_3102.JPG', 'post', 0.0),
    'e24-historia': ('n477_DSC_0739.JPG', 'band', 0.2),
    'e26-portada': ('n477_DSC_0739.JPG', 'post', 0.1),
    'e26-cierre': ('n483_DSC_0742.JPG', 'post', 0.35),
    'f02-portada': ('n660_DSC_0890.JPG', 'post', 0.5, 1.0, 1.35),
    'f02-cierre': ('n664_DSC_0894.JPG', 'post', 0.5, 1.0, 1.35),
    'f04-historia': ('n663_DSC_0893.JPG', 'story', 0.5, 1.0, 1.25),
    'f11-portada': ('n540_DSC_0771.JPG', 'post', 1.0),
    'f11-cierre': ('n552_DSC_0777.JPG', 'post', 0.5),
    'f14-post': ('n378_DSC_0605.JPG', 'post', 1.0, 1.0, 1.3),
    'f16-portada': ('n524_DSC_0763.JPG', 'post', 0.6),
    'f16-cierre': ('n563_DSC_0786.JPG', 'post', 0.4),
}
SIZES = {'post': (1080, 1350), 'story': (1080, 1920), 'band': (1080, 820)}


def crop(name):
    fn, kind, off = CROPS[name][:3]
    zoom = CROPS[name][3] if len(CROPS[name]) > 3 else 1.0
    gamma = CROPS[name][4] if len(CROPS[name]) > 4 else 1.0
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
    if gamma != 1.0:
        im = im.point([round(255 * (i / 255) ** (1 / gamma)) for i in range(256)] * 3)
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
  .foto.arriba::before { background:linear-gradient(180deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.6) 36%, rgba(10,10,10,0.1) 64%, rgba(10,10,10,0.5) 100%); }
  .foto.arriba .body { justify-content:flex-start; padding:64px 0 0; }
  .story.negro.libre .body { flex:1 1 auto; justify-content:center; padding-top:0; }
  .huge.xxl { font-size:250px; }
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
WA = '<span class="nowrap">11 4027 0343</span>'


def historia_nota(titulo, texto, foto):
    """Historia con el link a una nota nueva: el sticker de Enlace va entre el texto y la foto."""
    return [slide('negro story', PDP, 'Nota nueva',
        R() + f'<div class="big m">{titulo}</div><div class="small" style="margin-top:40px">{texto}</div>',
        'PUESTODEPALTA.COM/BLOG', '<span></span>').replace('<div class="bottom">',
        f'<div class="gap" style="height:240px"></div><div class="banda2" style="background-image:url(\'assets/{crop(foto)}\')"></div>\n  <div class="bottom">')]


def pregunta(cls, texto):
    """Historia con una pregunta: abajo queda lugar para el sticker de Cuestionario."""
    return [slide(cls + ' story', PDP, 'Pregunta',
        R() + f'<div class="big">{texto}</div>'
        '<div class="small">La respuesta, en el post de hoy.</div>'
        '<div class="gap" style="height:430px"></div>',
        'PUESTODEPALTA.COM', '<span></span>')]


# 5/1 El punto exacto 2
P['2027-01-05-carrusel'] = carrusel([
    ('foto', '<div class="label">El punto exacto · 2</div>' + R() + '<div class="big">Cómo saber si está lista <em>sin lastimarla.</em></div>',
     crop('e05-portada'), 'GUARDALO PARA LA PRÓXIMA', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">El color ayuda, <em>pero no alcanza.</em></div>'
              '<div class="small">La Hass pasa de verde a casi negra cuando madura. Pero hay paltas oscuras que todavía están duras. El color es una pista: confirmalo con la mano.</div>'),
    ('verde', R() + '<div class="big">Con la palma, <em>no con los dedos.</em></div>'
              '<div class="small">Apoyala en la palma y apretá apenas, con toda la mano. Si cede un poco, está lista. Los dedos dejan marcas que después aparecen como manchas marrones en la pulpa.</div>'),
    ('negro', R() + '<div class="big">El cabito <em>también avisa.</em></div>'
              '<div class="small">Sacale el cabito de arriba. Si sale fácil y abajo está verde, está lista. Si abajo está marrón, se pasó. Si no sale, todavía le falta.</div>'),
    ('crema', R() + '<div class="big">Lista no es lo mismo que <em>pasada.</em></div>'
              '<div class="small">Lista: cede apenas y vuelve. Pasada: se hunde y queda la marca, o la cáscara se siente floja. Si se pasó un poco, todavía sirve para guacamole.</div>'),
    ('foto', R() + '<div class="big m">¿La querés lista para un día justo? <em>Pedila en su punto.</em></div>'
             f'<div class="small">Por WhatsApp al {WA}. En febrero, El punto exacto 3: cómo apurarla o frenarla.</div>',
     crop('e05-cierre'), f'WHATSAPP {WA}', LOGO),
], 'EL PUNTO EXACTO · 2')

# 7/1 dato: la palta no madura en el árbol
P['2027-01-07-dato'] = [slide('verde', PDP, 'Dato del jueves',
    R() + '<div class="big">La palta no madura <em>en el árbol.</em></div>'
    '<div class="small">Puede quedar colgada meses y sigue dura. Recién empieza a ablandarse cuando la cosechan.</div>',
    'EL PUNTO EXACTO', LOGO)]

# 7/1 historia: el mismo dato, con encuesta
P['2027-01-07-historia'] = [slide('verde story', PDP, 'Curiosidad',
    R() + '<div class="big">La palta no madura en el árbol.</div>'
    '<div class="small">Recién empieza a ablandarse cuando la cosechan.</div>'
    '<div class="gap" style="height:430px"></div>',
    'PUESTODEPALTA.COM', '<span></span>')]

# 10/1 historia: nota nueva (Tucumán)
P['2027-01-10-historia'] = historia_nota(
    'El tercer intento de Tucumán <em>con la palta.</em>',
    'En Tucumán plantan paltos desde los años 70, y dos veces se cayó todo. Ahora el clima cambió y hay un tercer intento.',
    'e10-historia')

# 12/1 El tercer intento de Tucumán con la palta
P['2027-01-12-carrusel'] = carrusel([
    ('foto arriba', R() + '<div class="big">El tercer intento de Tucumán <em>con la palta.</em></div>'
             '<div class="small">Dos veces lo intentaron y dos veces se cayó. Ahora el clima cambió.</div>', crop('e12-portada'), 'NOTAS DEL PUESTO', 'DESLIZÁ'),
    ('crema', R() + '<div class="big m">En los años 70, familias de Concepción, en Tucumán, plantaron paltos por primera vez.</div>'
              '<div class="small">No era moda: era intuición. Los ensayos florecieron, literalmente. Y después se cayeron.</div>'),
    ('negro', R() + '<div class="big">El segundo intento lo frenó <em>el frío.</em></div>'
              '<div class="small">Las heladas de 2011, 2013 y 2015 arrasaron lo que la siguiente generación había vuelto a plantar.</div>'),
    ('verde', R() + '<div class="big m">Ahora el INTA dice que el clima <em>volvió a abrirse.</em></div>'
              '<div class="small">Según un informe del INTA Famaillá de septiembre de 2026, hay zonas del pedemonte aptas y productores con ganas. Lo que falta es estructura: trabajo en conjunto, investigación y políticas claras.</div>'),
    ('crema', '<div class="huge">5.075</div><div class="big" style="margin-top:8px"><em>kilos de palta Hass.</em></div>'
              '<div class="small">Es lo que mandó Paraguay a la Argentina en su primer envío de 2026. Paraguay tiene unas 150 hectáreas de paltos. Tucumán tiene suelo, clima e historia, y sigue comprando palta de afuera.</div>'),
    ('foto arriba', R() + '<div class="big">El tercer intento ya empezó. <em>¿Esta vez alguien se queda?</em></div>'
             '<div class="small">La nota completa está en el blog.</div>', crop('e12-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'EL TERCER INTENTO DE TUCUMÁN')

# 14/1 dato 8.100 / 33.770
DATO14 = ('<div class="label">Temporada 2023-2024</div><div class="huge tenue">8.100</div>'
          '<div class="big s" style="margin-top:20px">toneladas de palta importó la Argentina.</div>'
          '<div class="label" style="margin-top:84px">Temporada 2025-2026 (proyección)</div><div class="huge acento">33.770</div>')
P['2027-01-14-dato'] = [slide('crema', PDP, 'Dato del jueves', DATO14, 'EL NÚMERO QUE NADIE PLANEÓ', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 14/1 historia: el mismo dato, con encuesta
P['2027-01-14-historia'] = [slide('crema story', PDP, 'Dato del jueves',
    DATO14 + '<div class="gap" style="height:380px"></div>', 'PUESTODEPALTA.COM', '<span></span>')]

# 19/1 La palta del sushi
P['2027-01-19-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">La palta del sushi: <em>lista y firme a la vez.</em></div>'
             '<div class="small">Cómo elegirla y cómo cortarla en láminas.</div>', crop('e19-portada'), 'GUARDALO PARA LA PRÓXIMA', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">Lista, <em>pero firme.</em></div>'
              '<div class="small">Tiene que ceder apenas al apretarla con la palma. Si se hunde, está muy blanda para cortar láminas.</div>'),
    ('verde', R() + '<div class="big">A lo largo, <em>y sin el carozo.</em></div>'
              '<div class="small">Pasá el cuchillo alrededor del carozo, girá las dos mitades y separalas. El carozo sale con una cuchara.</div>'),
    ('negro', R() + '<div class="big">Pelala <em>con la mano.</em></div>'
              '<div class="small">Si está en su punto, la cáscara sale sola, como un guante. Así la pulpa queda entera y lisa.</div>'),
    ('crema', R() + '<div class="big">Cuchillo bien afilado, <em>láminas finas.</em></div>'
              '<div class="small">Apoyá la mitad boca abajo y cortá láminas de dos o tres milímetros, cada una de un solo corte. Con unas gotas de limón no se oscurecen.</div>'),
    ('foto', R() + '<div class="big">¿Te quedó muy blanda? <em>Va al guacamole.</em></div>'
             f'<div class="small">Y si la querés en su punto para un día justo, pedila por WhatsApp al {WA}.</div>',
     crop('e19-cierre'), f'WHATSAPP {WA}', LOGO),
], 'LA PALTA DEL SUSHI')

# 21/1 dato -8 grados
P['2027-01-21-dato'] = [slide('negro', PDP, 'Dato del jueves',
    '<div class="label">Florida, enero de 2026</div><div class="huge xl">−8°</div>'
    '<div class="big m" style="margin-top:16px">Una helada que un palto común <em>no aguanta.</em></div>'
    '<div class="small">Resiste hasta unos 3 grados bajo cero. Pero unos árboles criados durante veinte años en la Universidad de Florida sobrevivieron sin daño.</div>',
    'LA PALTA QUE RESISTE EL HIELO', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 21/1 historia: pregunta
P['2027-01-21-historia'] = pregunta('negro libre', '¿Cuánto frío aguanta un palto común?')

# 24/1 historia: nota nueva (Trece pesos)
P['2027-01-24-historia'] = historia_nota(
    'Trece pesos <em>y un certificado.</em>',
    'Lo que cobraba por kilo un productor chico de Michoacán en octubre, y el papel que México empieza a pedir para exportar.',
    'e24-historia')

# 26/1 Trece pesos y un certificado
P['2027-01-26-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">Trece pesos <em>y un certificado.</em></div>'
             '<div class="small">Lo que cobraba por kilo un productor chico de Michoacán en octubre, y el papel que México empieza a pedir para exportar.</div>',
     crop('e26-portada'), 'NOTAS DEL PUESTO', 'DESLIZÁ'),
    ('crema', '<div class="huge xl">13</div><div class="big" style="margin-top:8px"><em>pesos por kilo.</em></div>'
              '<div class="small">Menos de un dólar. Es lo que cobraban en octubre de 2026 los productores chicos de palta en Michoacán, México. En Uruapan salieron a pedir un mínimo de 45.</div>'),
    ('negro', R() + '<div class="big">Tres semanas antes, <em>otra noticia.</em></div>'
              '<div class="small">El gobierno de México anunció que ninguna palta de una huerta deforestada va a poder salir del país. Para exportar va a hacer falta un certificado ambiental.</div>'),
    ('crema', '<div class="huge l">20.000</div><div class="big" style="margin-top:8px"><em>hectáreas de bosque.</em></div>'
              '<div class="small">Se talaron entre 2018 y 2024 para plantar palta, según el propio gobierno de México. Parte se hizo con fuego.</div>'),
    ('verde', R() + '<div class="big">¿Quién paga <em>el certificado?</em></div>'
              '<div class="small">El que tala para plantar suele ser grande. El que cobra trece pesos tiene una huerta chica, de familia, y para demostrar que no fue bosque necesita trámites e imágenes satelitales. El grande tiene una oficina para eso. El chico tiene una camioneta.</div>'),
    ('negro', R() + '<div class="big m">El nombre se protege. <em>El que la cultiva, no tanto.</em></div>'
              '<div class="small">En junio de 2026, la palta de Michoacán consiguió una indicación geográfica protegida, como el champagne. En la puerta de la huerta vale trece pesos.</div>'),
    ('foto', R() + '<div class="big m">El papel va a decir de dónde viene. <em>No cuánto le pagaron al que la cosechó.</em></div>'
             '<div class="small">La nota completa está en el blog.</div>', crop('e26-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'TRECE PESOS Y UN CERTIFICADO')

# 28/1 dato 30 días
P['2027-01-28-dato'] = [slide('verde', PDP, 'Dato del jueves',
    '<div class="huge xl">30</div>'
    '<div class="big" style="margin-top:16px">días en el mar.</div>'
    '<div class="small">Es lo que tarda una palta en ir de Chile a Rotterdam, en una cámara de frío, adentro de un contenedor.</div>',
    'TREINTA DÍAS EN EL MAR', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 28/1 historia: pregunta
P['2027-01-28-historia'] = pregunta('crema', '¿Cuánto tarda una palta en llegar de Chile a Europa?')

# 2/2 Lo que tirás también es palta
P['2027-02-02-carrusel'] = carrusel([
    ('foto', R() + '<div class="big">Lo que tirás <em>también es palta.</em></div>'
             '<div class="small">Tres cosas que la ciencia encontró en lo que va a la basura.</div>', crop('f02-portada'), 'NOTAS DEL PUESTO', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">El carozo <em>tiene color.</em></div>'
              '<div class="small">Triturado y al aire, en unos 35 minutos se vuelve naranja rojizo. Es un colorante natural, no tóxico, que podría reemplazar a los artificiales en yogures, bebidas y caramelos.</div>', None, 'EL NARANJA QUE NADIE MIRABA'),
    ('negro', R() + '<div class="big">La cáscara, <em>un envase nuevo.</em></div>'
              '<div class="small">En Australia, investigadores de la Universidad Deakin hicieron nanopartículas con cáscara de palta y las mezclaron con pan viejo. Salió un bioplástico para envolver alimentos, más resistente que los de almidón.</div>', None, 'LA CÁSCARA QUE SE CONVIERTE EN PLÁSTICO'),
    ('verde', R() + '<div class="big">Y con los dos, <em>un filtro para el agua.</em></div>'
              '<div class="small">En Michoacán, México, un equipo de la UNAM hizo con cáscaras y carozos un material que atrapa lo que ensucia el agua. El 11 de febrero te contamos quiénes lo hicieron.</div>', None, 'LO QUE LA COMUNIDAD TIRA AL AGUA'),
    ('crema', '<div class="huge xl">2</div><div class="big" style="margin-top:8px"><em>millones de toneladas.</em></div>'
              '<div class="small">Es lo que dejó en carozos y cáscaras la palta de todo el mundo en 2019. Van al compost o, peor, al relleno sanitario.</div>', None, 'EL NARANJA QUE NADIE MIRABA'),
    ('foto', R() + '<div class="big">La próxima vez que partas una palta, <em>mirá el carozo.</em></div>'
             '<div class="small">Las cuatro historias están en el blog.</div>', crop('f02-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'LO QUE TIRÁS TAMBIÉN ES PALTA')

# 4/2 dato 16%
P['2027-02-04-dato'] = [slide('crema', PDP, 'Dato del jueves',
    '<div class="huge xxl acento">16%</div>'
    '<div class="big m" style="margin-top:16px">del peso de una palta <em>es el carozo.</em></div>'
    '<div class="small">Y casi siempre termina en la basura.</div>',
    'EL NARANJA QUE NADIE MIRABA', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 4/2 historia: el carozo, con encuesta
P['2027-02-04-historia'] = [slide('foto partida story', PDP, 'Encuesta',
    '<div class="big">El carozo es el 16% del peso de la palta.</div>'
    '<div class="small" style="margin-top:0">¿Qué hacés con el tuyo?</div>',
    '', '<span></span>', photo=crop('f04-historia'))]

# 11/2 Investigadoras y palta (Día Internacional de la Mujer y la Niña en la Ciencia)
P['2027-02-11-carrusel'] = carrusel([
    ('foto arriba', '<div class="label">11 de febrero</div>' + R() + '<div class="big">Investigadoras <em>y palta.</em></div>'
             '<div class="small">Por el Día Internacional de la Mujer y la Niña en la Ciencia: tres científicas de México y Chile.</div>',
     crop('f11-portada'), 'MUJERES EN LA CIENCIA', 'DESLIZÁ'),
    ('crema', '<div class="label">México</div>' + R() + '<div class="big m">Sayra Orozco limpia agua <em>con lo que se tira.</em></div>'
              '<div class="small">Es investigadora del Instituto de Investigaciones en Materiales de la UNAM. Con Michel Rivero, hizo con cáscaras y carozos de palta un material que atrapa lo que ensucia el agua.</div>'),
    ('verde', '<div class="huge l nowrap">30 → 71</div>'
              '<div class="big m" style="margin-top:16px">sobre 100.</div>'
              '<div class="small">Así subió la calidad de una muestra de agua de la planta de tratamiento de Pichátaro, en Michoacán, al pasar por ese material. La idea es que la propia comunidad lo fabrique.</div>'),
    ('negro', '<div class="label">Chile</div>' + R() + '<div class="big m">Martina Ladino y Soledad Sánchez cuidan la palta <em>en el viaje.</em></div>'
              '<div class="small">Son investigadoras del INIA La Platina. Con Pablo Ulloa y Bruno Defilippi, prueban aceites de hinojo y mostaza contra los hongos que pudren la palta después de la cosecha.</div>'),
    ('crema', R() + '<div class="big">Una alternativa <em>natural.</em></div>'
              '<div class="small">Buscan reemplazar a los fungicidas químicos, como uno que Europa dejó de aprobar. En el laboratorio, los aceites frenaron a los dos hongos principales. Falta probarlo en un viaje de verdad: de Chile a Europa, una palta pasa unos 30 días en el mar.</div>'),
    ('foto', R() + '<div class="big">Gracias a las que investigan <em>lo que comemos.</em></div>'
             '<div class="small">Las dos historias están en el blog.</div>', crop('f11-cierre'), 'PUESTODEPALTA.COM/BLOG', LOGO),
], 'MUJERES EN LA CIENCIA')

# 14/2 San Valentín
P['2027-02-14-post'] = [slide('foto', PDP, 'San Valentín',
    R() + '<div class="big">El palto también necesita <em>pareja.</em></div>'
    '<div class="small">Sus flores abren como hembra y como macho, en horarios distintos según el árbol: tipo A o tipo B. Por eso en California, uno de cada diez árboles de una huerta es tipo B: está ahí para que los otros tengan con quién.</div>',
    '14 DE FEBRERO', LOGO, photo=crop('f14-post'))]

# 16/2 El punto exacto 3
P['2027-02-16-carrusel'] = carrusel([
    ('foto', '<div class="label">El punto exacto · 3</div>' + R() + '<div class="big">Apurarla <em>o frenarla.</em></div>'
             '<div class="small">Qué hacer si la necesitás lista antes, o si querés que dure unos días más.</div>',
     crop('f16-portada'), 'GUARDALO PARA LA PRÓXIMA', 'DESLIZÁ'),
    ('crema', R() + '<div class="big">Para apurarla, <em>bolsa de papel.</em></div>'
              '<div class="small">Cerrala en una bolsa de papel con una banana o una manzana. Largan etileno, un gas que acelera la maduración. Revisala todos los días.</div>'),
    ('verde', R() + '<div class="big">Mientras está dura, <em>afuera de la heladera.</em></div>'
              '<div class="small">A temperatura ambiente madura sola. Si la metés dura en la heladera, se frena y después puede madurar despareja.</div>'),
    ('negro', R() + '<div class="big m">Para frenarla, heladera. <em>Pero recién cuando está lista.</em></div>'
              '<div class="small">Cuando cede apenas al apretarla, a la heladera. Así aguanta unos días más sin pasarse.</div>'),
    ('crema', R() + '<div class="big">Horno y microondas, <em>no.</em></div>'
              '<div class="small">La ablandan, pero no la maduran: queda blanda, sin gusto, y puede ponerse amarga.</div>'),
    ('foto', R() + '<div class="big m">¿No tenés tiempo de esperar? <em>Pedila en su punto.</em></div>'
             f'<div class="small">Nos decís para qué día la querés y llega lista. Por WhatsApp al {WA}.</div>',
     crop('f16-cierre'), f'WHATSAPP {WA}', LOGO),
], 'EL PUNTO EXACTO · 3')

# 18/2 dato 0,72 euros
DATO18 = ('<div class="label">Francia, verano de 2026</div><div class="huge xl acento">0,72</div>'
          '<div class="big m" style="margin-top:16px">euros por una palta Hass. <em>Menos que un café.</em></div>')
P['2027-02-18-dato'] = [slide('negro', PDP, 'Dato del jueves',
    DATO18 + '<div class="small">Había tanta palta en Europa que se vendía a precio de liquidación.</div>',
    'CUANDO HAY DEMASIADA PALTA', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 18/2 historia: el mismo dato, con encuesta
P['2027-02-18-historia'] = [slide('negro story libre', PDP, 'Dato del jueves',
    DATO18 + '<div class="gap" style="height:430px"></div>', 'PUESTODEPALTA.COM', '<span></span>')]

# 25/2 dato Kenia
P['2027-02-25-dato'] = [slide('verde', PDP, 'Dato del jueves',
    '<div class="label">Kenia, octubre de 2025</div>' + R() +
    '<div class="big m">Kenia frenó <em>todas</em> sus exportaciones de palta por barco.</div>'
    '<div class="small">Algunos exportadores mandaban fruta inmadura a Europa, con permisos irregulares. Recién volvieron a abrirlas en abril de 2026.</div>',
    'EL ROBO DE LA PALTA KENIATA', '<span>PUESTODEPALTA.COM/BLOG</span>')]

# 25/2 historia: pregunta
P['2027-02-25-historia'] = pregunta('verde', '¿Por qué Kenia frenó todas sus exportaciones de palta?')

meta = {}
for name, slides in P.items():
    with open(os.path.join(OUT, name + '.html'), 'w') as f:
        f.write(page(slides))
    meta[name] = {'slides': len(slides), 'story': 'historia' in name}
json.dump(meta, open(os.path.join(OUT, 'piezas.json'), 'w'), indent=1)
print(json.dumps(meta))
