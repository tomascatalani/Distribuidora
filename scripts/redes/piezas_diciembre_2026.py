"""Datos de cada pieza (texto, hora, canción, notas) y armado del pedido para Metricool.
Uso: python3 -I scripts/redes/piezas_diciembre_2026.py <carpeta de trabajo>  -> escribe piezas_final.json y payloads/<pieza>.json"""
import html, json, os, re, sys

base = sys.argv[1]
urls = json.load(open(os.path.join(base, 'urls.json')))
TZ = 'America/Buenos_Aires'
WA = '11 4027 0343'

FOTOS = {  # descripción de la foto de fondo por pieza y número de imagen
    ('2026-11-29-historia', 1): 'Dos mitades de palta sobre una mesa de madera, con luz cálida',
    ('2026-12-01-carrusel', 1): 'Dos mitades de palta sobre una mesa de madera, con luz cálida',
    ('2026-12-01-carrusel', 6): 'Dos mitades de palta, una con carozo, sobre madera',
    ('2026-12-08-carrusel', 1): 'Un cajón con paltas en distintos puntos de maduración',
    ('2026-12-08-carrusel', 6): 'Una caja llena de paltas verdes',
    ('2026-12-10-dato', 1): 'Una palta Hass en la palma de una mano, con jazmines de fondo',
    ('2026-12-10-historia', 1): 'Una palta Hass en la palma de una mano, con jazmines de fondo',
    ('2026-12-13-historia', 1): 'Paltas en una canasta de mimbre',
    ('2026-12-15-carrusel', 1): 'Paltas en una canasta de mimbre sobre una mesa, en un jardín',
    ('2026-12-15-carrusel', 7): 'Una canasta con paltas sobre el pasto, vista desde arriba',
    ('2026-12-22-carrusel', 1): 'Dos mitades de palta, una con carozo, en un plato con nueces pecán',
    ('2026-12-22-carrusel', 6): 'Palta cortada al medio en un plato blanco con nueces pecán',
    ('2026-12-27-historia', 1): 'Una mano sostiene una palta entre jazmines',
    ('2026-12-29-carrusel', 1): 'Una mano sostiene una palta entre jazmines',
    ('2026-12-29-carrusel', 6): 'Una palta en la palma de una mano, con luz de tarde',
}

PIEZAS = [
    dict(id='2026-11-29-historia', fecha='2026-11-29', hora='19:00', dia='domingo', tipo='Historia', titulo='Nota nueva: La palta que nadie cultivó a propósito',
         musica='Mañanas en el Depósito',
         notas='Subila recién cuando la nota esté publicada. Agregá el sticker de Enlace entre el texto y la foto, con el link de la nota (puestodepalta.com/blog y tocá la nota).'),
    dict(id='2026-12-01-carrusel', fecha='2026-12-01', hora='20:00', dia='martes', tipo='Carrusel', titulo='La palta que nadie cultivó a propósito',
         musica='Divina Cosecha',
         notas='Sale después de que publiques la nota del 29/11. Va con el Reel del lunes 30/11.',
         texto='El mundo come casi una sola palta: la Hass. Y un hongo que pudre la raíz de los árboles ya es un problema serio en varios países.\n\n'
               'En Nicaragua y Honduras crecen 47 variedades que la ciencia no tenía registradas. Nadie las creó a propósito, y quienes las cultivan nunca tuvieron problemas con ese hongo. ¿Será el plan B del mundo?\n\n'
               'La nota completa, en puestodepalta.com/blog\n\n#palta #paltahass #biodiversidad #puestodepalta'),
    dict(id='2026-12-03-dato', fecha='2026-12-03', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='47 variedades sin registrar',
         musica='Mercado al Alba',
         notas='Sale después de la nota del 29/11. Va en lugar del post del Día del Médico, que pasó a historia.',
         texto='Hay 47 variedades de palta que la ciencia no tenía registradas. Crecen en Nicaragua y Honduras, no tienen nombre y nadie las exporta.\n\n'
               'Quienes las cultivan nunca tuvieron problemas con el hongo que pudre la raíz de la Hass. La historia completa está en la nota La palta que nadie cultivó a propósito, en puestodepalta.com/blog\n\n'
               '#palta #paltahass #biodiversidad #puestodepalta'),
    dict(id='2026-12-03-historia', fecha='2026-12-03', hora='21:00', dia='jueves', tipo='Historia', titulo='Curiosidad: 47 variedades sin registrar',
         musica='Mercado al Alba',
         notas='Agregá una encuesta en el espacio libre de abajo: "¿Lo sabías?" con Sí y No.'),
    dict(id='2026-12-08-carrusel', fecha='2026-12-08', hora='20:00', dia='martes (feriado)', tipo='Carrusel', titulo='Pedila en su punto para las Fiestas',
         musica='La Bella Entrega',
         notas='Es feriado y se entrega igual: si querés, contalo también en una historia.',
         texto='Para las Fiestas, pedila en su punto: nos decís para qué día la querés y te la mandamos lista.\n\n'
               'Entregamos de lunes a sábado, feriados incluidos. El 24 y el 31 también. El 25 de diciembre y el 1 de enero no hay entregas.\n\n'
               f'Pedidos por WhatsApp al {WA}.\n\n#palta #fiestas #navidad #puestodepalta'),
    dict(id='2026-12-10-dato', fecha='2026-12-10', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='1926: un carozo en un patio de California',
         musica='Divina Cosecha',
         notas='Adelanto de la nota del domingo 13/12. Si esa nota cambia de fecha, sacá la última línea del texto.',
         texto='En 1926, Rudolph Hass plantó un carozo en un patio de La Habra Heights, California. Creció un árbol de cáscara negra y rugosa que nadie en la industria quería.\n\n'
               'De ese único árbol viene casi toda la palta Hass que se come en el mundo. Probablemente, también la que tenés en casa.\n\n'
               'El domingo, la historia completa en el blog.\n\n#palta #paltahass #historia #puestodepalta'),
    dict(id='2026-12-10-historia', fecha='2026-12-10', hora='21:00', dia='jueves', tipo='Historia', titulo='Pregunta: ¿de dónde viene la Hass?',
         musica='Divina Cosecha',
         notas='Agregá un sticker de Cuestionario sobre la mano: "¿De dónde viene la palta Hass?" con México, Perú, California (la correcta) y Chile.'),
    dict(id='2026-12-13-historia', fecha='2026-12-13', hora='19:00', dia='domingo', tipo='Historia', titulo='Nota nueva: La cuna del Hass',
         musica='Mañanas en el Depósito',
         notas='Subila recién cuando la nota esté publicada. Agregá el sticker de Enlace entre el texto y la foto, con puestodepalta.com/blog/la-cuna-del-hass-ya-no-puede-competir'),
    dict(id='2026-12-15-carrusel', fecha='2026-12-15', hora='20:00', dia='martes', tipo='Carrusel', titulo='La cuna del Hass ya no puede competir',
         musica='Mañanas en el Depósito',
         notas='Sale después de la nota del 13/12. Va con el Reel del lunes 14/12.',
         texto='En 1926, Rudolph Hass plantó un carozo en un patio de California. De ese árbol viene casi toda la palta Hass del mundo.\n\n'
               'Hoy California tiene la mitad de productores que hace diez años y pide un límite para la palta de México. Dicen que la suya es mejor. El mercado pregunta cuánto sale el cajón.\n\n'
               'La nota completa, en puestodepalta.com/blog\n\n#palta #paltahass #california #puestodepalta'),
    dict(id='2026-12-17-dato', fecha='2026-12-17', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='De 6.000 a 3.000 productores',
         musica='Mercado al Alba',
         notas='Sale después de la nota del 13/12.',
         texto='Hace diez años había 6.000 productores de palta en California. Hoy quedan 3.000.\n\n'
               'Compiten con la palta de México, que llega en volumen y más barata. La historia completa está en la nota La cuna del Hass ya no puede competir, en puestodepalta.com/blog\n\n'
               '#palta #paltahass #productores #puestodepalta'),
    dict(id='2026-12-17-historia', fecha='2026-12-17', hora='21:00', dia='jueves', tipo='Historia', titulo='Encuesta: ¿te importa de dónde viene?',
         musica='Mercado al Alba',
         notas='Agregá una encuesta en el espacio libre de abajo: "¿Te importa de dónde viene tu palta?" con "Sí, mucho" y "Me da igual".'),
    dict(id='2026-12-22-carrusel', fecha='2026-12-22', hora='20:00', dia='martes', tipo='Carrusel', titulo='El punto exacto 1: cómo guardar la palta con 35 grados',
         musica='Ansiada Maduración',
         notas='Primera de la serie El punto exacto. La segunda sale el 5/1.',
         texto='El punto exacto, parte 1: cómo guardar la palta con 35 grados.\n\n'
               'Verde, afuera y a la sombra. Lista, a la heladera. Cortada, con limón y bien tapada. Y el carozo solo protege la parte que tapa.\n\n'
               f'Guardá este post para el verano. Y si la querés lista para un día justo, pedila en su punto por WhatsApp al {WA}.\n\n'
               '#palta #paltahass #tips #puestodepalta'),
    dict(id='2026-12-27-historia', fecha='2026-12-27', hora='19:00', dia='domingo', tipo='Historia', titulo='Nota nueva: El árbol que no sabemos cómo va a actuar',
         musica='Mañanas en el Depósito',
         notas='Subila recién cuando la nota esté publicada. Agregá el sticker de Enlace entre el texto y la foto, con el link de la nota (puestodepalta.com/blog y tocá la nota). En Notion el título dice "como" sin tilde: si querés, corregilo antes de publicarla.'),
    dict(id='2026-12-29-carrusel', fecha='2026-12-29', hora='20:00', dia='martes', tipo='Carrusel', titulo='El árbol que no sabemos cómo va a actuar',
         musica='Mañanas en el Depósito',
         notas='Sale después de la nota del 27/12. Va con el Reel del lunes 28/12.',
         texto='La flor de la palta abre dos veces: primero como hembra y después como macho. Hay árboles tipo A y tipo B, y se necesitan de a pares.\n\n'
               'Durante cien años, para saber de qué tipo era un árbol había que esperar a que floreciera. En julio de 2026 encontraron el gen que lo decide. Tiene 42 millones de años.\n\n'
               'La nota completa, en puestodepalta.com/blog\n\n#palta #paltahass #ciencia #puestodepalta'),
    dict(id='2026-12-31-carrusel', fecha='2026-12-31', hora='12:00', dia='jueves', tipo='Carrusel', titulo='2026 en la palta, en 8 números',
         musica='Divina Cosecha',
         notas='Cinco números salen de notas que hoy son borrador (9/11, 19/11, 29/11, 13/12 y 27/12). Si alguna no se publica, sacamos esa imagen.',
         texto='2026 en la palta, en 8 números: todo lo que fuimos contando en el blog este año. ¿Cuál te sorprendió más?\n\n'
               'Gracias por leernos. ¡Feliz 2027!\n\n'
               'Todas las notas, en puestodepalta.com/blog\n\n#palta #paltahass #resumen2026 #puestodepalta'),
]


def textos_html(pieza):
    """Texto visible de cada imagen, sacado del HTML."""
    h = open(os.path.join(base, 'build', pieza + '.html')).read()
    out = []
    for sec in re.findall(r'<section class="slide[^"]*"[^>]*>(.*?)</section>', h, re.S):
        body = re.search(r'<div class="body">(.*)</div>\s*(?:<div class="gap"[^>]*></div>)?(?:<div class="banda2"[^>]*></div>)?\s*<div class="bottom">', sec, re.S)
        t = body.group(1) if body else sec
        t = re.sub(r'<div class="gap"[^>]*></div>', ' ', t)
        t = re.sub(r'<div class="label">(.*?)</div>', r'\1. ', t)
        t = re.sub(r'</div>', ' ', t)
        t = re.sub(r'<[^>]+>', '', t)
        t = html.unescape(re.sub(r'\s+', ' ', t)).strip()
        out.append(t)
    return out


os.makedirs(os.path.join(base, 'payloads'), exist_ok=True)
for p in PIEZAS:
    ids = sorted(k for k in urls if k.startswith(p['id'] + '-'))
    p['media'] = [urls[k]['url'] for k in ids]
    alts = []
    for i, t in enumerate(textos_html(p['id']), 1):
        foto = FOTOS.get((p['id'], i))
        alts.append((foto + '. Texto: ' if foto else 'Texto: ') + t)
    p['alt'] = alts
    story = p['tipo'] == 'Historia'
    info = {
        'autoPublish': False, 'descendants': [], 'draft': True, 'firstCommentText': '', 'hasNotReadNotes': False,
        'media': p['media'], 'mediaAltText': alts,
        'providers': [{'network': 'instagram'}] if story else [{'network': 'instagram'}, {'network': 'facebook'}],
        'publicationDate': {'dateTime': f"{p['fecha']}T{p['hora']}:00", 'timezone': TZ},
        'shortener': False, 'smartLinkData': {'ids': []},
        'instagramData': {'type': 'STORY' if story else 'POST', 'collaborators': [], 'showReelOnFeed': True, 'isAiGenerated': False},
    }
    if not story:
        info['text'] = p['texto']
        info['facebookData'] = {'type': 'POST'}
    p['date'] = f"{p['fecha']}T{p['hora']}:00-03:00"
    json.dump({'date': p['date'], 'info': json.dumps(info, ensure_ascii=False)}, open(os.path.join(base, 'payloads', p['id'] + '.json'), 'w'), ensure_ascii=False)
json.dump(PIEZAS, open(os.path.join(base, 'piezas_final.json'), 'w'), ensure_ascii=False, indent=1)
for p in PIEZAS:
    print(p['id'], len(p['media']), 'imágenes |', p['alt'][0][:110])
