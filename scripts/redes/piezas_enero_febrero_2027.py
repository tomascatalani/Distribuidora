"""Datos de cada pieza de enero y febrero 2027 (texto, hora, canción, notas) y armado del pedido para Metricool.
Uso: python3 -I scripts/redes/piezas_enero_febrero_2027.py <carpeta de trabajo>  -> escribe piezas_final.json y payloads/<pieza>.json"""
import html, json, os, re, sys

base = sys.argv[1]
urls = json.load(open(os.path.join(base, 'urls.json')))
TZ = 'America/Buenos_Aires'
WA = '11 4027 0343'

GRASS = 'Paltas Hass sobre el pasto, vistas desde arriba'
LIMONES = 'Paltas y limones en una fuente de madera, contra una pared de ladrillos'
FUENTE = 'Una fuente de barro con paltas sobre el pasto, vista desde arriba'
CAROZO = 'Media palta con el carozo, sobre una mesa de madera oscura'
FOTOS = {  # descripción de la foto de fondo por pieza y número de imagen
    ('2027-01-05-carrusel', 1): 'Cuatro paltas Hass sobre el pasto, en distintos tonos de maduración, vistas desde arriba',
    ('2027-01-05-carrusel', 6): GRASS,
    ('2027-01-10-historia', 1): LIMONES,
    ('2027-01-12-carrusel', 1): LIMONES,
    ('2027-01-12-carrusel', 6): LIMONES,
    ('2027-01-19-carrusel', 1): 'Una bandeja blanca con salsa de soja, palillos y paltas, una cortada al medio',
    ('2027-01-19-carrusel', 6): 'Una bandeja blanca con salsa de soja, palillos y media palta',
    ('2027-01-24-historia', 1): FUENTE,
    ('2027-01-26-carrusel', 1): FUENTE,
    ('2027-01-26-carrusel', 7): FUENTE,
    ('2027-02-02-carrusel', 1): CAROZO,
    ('2027-02-02-carrusel', 6): CAROZO,
    ('2027-02-04-historia', 1): CAROZO,
    ('2027-02-11-carrusel', 1): 'Una palta cortada al medio sobre una tabla de madera, con nueces pecán',
    ('2027-02-11-carrusel', 6): 'Palta cortada al medio con nueces pecán, de cerca',
    ('2027-02-14-post', 1): 'Dos mitades de palta, una con carozo, sobre una mesa de madera',
    ('2027-02-16-carrusel', 1): 'Dos paltas Hass enteras en un plato con nueces pecán, bajo unas hojas de palmera',
    ('2027-02-16-carrusel', 6): 'Palta cortada al medio y nueces pecán sobre una tabla',
}

BLOG = 'en puestodepalta.com/blog'
TAGS = '#palta #paltahass'
PIEZAS = [
    dict(id='2027-01-05-carrusel', fecha='2027-01-05', hora='20:00', dia='martes', tipo='Carrusel', titulo='El punto exacto 2: cómo saber si está lista sin lastimarla',
         musica='Ansiada Maduración',
         notas='Segunda de la serie El punto exacto (la tercera sale el 16/2). Va con el Reel de Tom especialista del lunes 4/1, si lo graban.',
         texto='El punto exacto, parte 2: cómo saber si una palta está lista sin lastimarla.\n\n'
               'El color ayuda, pero no alcanza. Apoyala en la palma y apretá apenas, con toda la mano: los dedos dejan marcas que después son manchas marrones. Y el cabito también avisa.\n\n'
               f'Guardá este post para la próxima. Y si la querés lista para un día justo, pedila en su punto por WhatsApp al {WA}.\n\n'
               f'{TAGS} #tips #puestodepalta'),
    dict(id='2027-01-07-dato', fecha='2027-01-07', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='La palta no madura en el árbol',
         musica='Divina Cosecha',
         notas='Completa El punto exacto 2 del martes.',
         texto='La palta no madura en el árbol. Puede quedar colgada meses y sigue dura: recién empieza a ablandarse cuando la cosechan.\n\n'
               'Por eso una palta dura no está mal. Está esperando su momento, en tu frutera.\n\n'
               f'{TAGS} #sabiasque #puestodepalta'),
    dict(id='2027-01-07-historia', fecha='2027-01-07', hora='21:00', dia='jueves', tipo='Historia', titulo='Curiosidad: la palta no madura en el árbol',
         musica='Divina Cosecha',
         notas='Agregá una encuesta en el espacio libre de abajo: "¿Lo sabías?" con Sí y No.'),
    dict(id='2027-01-10-historia', fecha='2027-01-10', hora='19:00', dia='domingo', tipo='Historia', titulo='Nota nueva: El tercer intento de Tucumán con la palta',
         musica='Mañanas en el Depósito',
         notas='Subila recién cuando la nota esté publicada. Agregá el sticker de Enlace entre el texto y la foto, con puestodepalta.com/blog/el-tercer-intento-de-tucuman-con-la-palta'),
    dict(id='2027-01-12-carrusel', fecha='2027-01-12', hora='20:00', dia='martes', tipo='Carrusel', titulo='El tercer intento de Tucumán con la palta',
         musica='Divina Cosecha',
         notas='Sale después de que publiques la nota del 10/1. Va con el Reel del lunes 11/1 (el guion está en el Plan de redes).',
         texto='En los años 70, familias de Concepción, en Tucumán, plantaron paltos por primera vez. Las heladas de 2011, 2013 y 2015 arrasaron el segundo intento.\n\n'
               'Hoy el INTA dice que el clima volvió a abrirse y que hay zonas aptas. Lo que falta es estructura. Mientras tanto, hasta Paraguay le vende palta a la Argentina.\n\n'
               f'La nota completa, {BLOG}\n\n#palta #tucuman #produccionargentina #puestodepalta'),
    dict(id='2027-01-14-dato', fecha='2027-01-14', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='De 8.100 a 33.770 toneladas',
         musica='Interminables Logísticas',
         notas='De la nota El número que nadie planeó, que ya está publicada.',
         texto='En la temporada 2023-2024, la Argentina importó 8.100 toneladas de palta. Para la 2025-2026 se proyectaron 33.770: cuatro veces más, en solo dos temporadas.\n\n'
               f'Sin campañas ni publicidad: cada vez comemos más palta. La historia completa está en la nota El número que nadie planeó, {BLOG}\n\n'
               f'{TAGS} #argentina #puestodepalta'),
    dict(id='2027-01-14-historia', fecha='2027-01-14', hora='21:00', dia='jueves', tipo='Historia', titulo='Encuesta: ¿comés más palta que antes?',
         musica='Interminables Logísticas',
         notas='Agregá una encuesta en el espacio libre de abajo: "¿Comés más palta que hace dos años?" con "Sí, mucha más" y "Más o menos igual".'),
    dict(id='2027-01-19-carrusel', fecha='2027-01-19', hora='20:00', dia='martes', tipo='Carrusel', titulo='La palta del sushi: lista y firme a la vez',
         musica='La Bella Entrega',
         notas='Va con el Reel del viernes 22/1 (las tomas hay que grabarlas antes) y con la receta del miércoles 20/1 (poke o rolls con palta).',
         texto='La palta del sushi tiene que estar lista y firme a la vez. Cómo darte cuenta: cede apenas al apretarla con la palma.\n\n'
               'Cortala a lo largo, sacale el carozo con una cuchara, pelala con la mano y cortá láminas finas con un cuchillo bien afilado. ¿Te quedó muy blanda? Va al guacamole.\n\n'
               f'Si la querés en su punto para un día justo, pedila por WhatsApp al {WA}.\n\n'
               '#palta #sushi #recetas #puestodepalta'),
    dict(id='2027-01-21-dato', fecha='2027-01-21', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='−8 grados: la palta que resiste el hielo',
         musica='Mercado al Alba',
         notas='Cambió el dato del calendario: el de los 400 gramos por persona era viejo y no cerraba con las 33.770 toneladas del 14/1. Este sigue con las heladas de la nota de Tucumán. Sale de la nota La palta que resiste el hielo, que ya está publicada.',
         texto='En enero de 2026, una helada de 8 grados bajo cero cruzó Florida. Los paltos comerciales no aguantan mucho más de 3 bajo cero.\n\n'
               'Pero unos árboles que un investigador de la Universidad de Florida viene criando desde hace veinte años sobrevivieron sin daño. La historia completa está en la nota La palta que resiste el hielo, '
               f'{BLOG}\n\n#palta #ciencia #heladas #puestodepalta'),
    dict(id='2027-01-21-historia', fecha='2027-01-21', hora='21:00', dia='jueves', tipo='Historia', titulo='Pregunta: ¿cuánto frío aguanta un palto?',
         musica='Mercado al Alba',
         notas='Agregá un sticker de Cuestionario en el espacio libre de abajo: "¿Cuánto frío aguanta un palto común?" con 0 grados, 3 bajo cero (la correcta) y 10 bajo cero.'),
    dict(id='2027-01-24-historia', fecha='2027-01-24', hora='19:00', dia='domingo', tipo='Historia', titulo='Nota nueva: Trece pesos y un certificado',
         musica='Mañanas en el Depósito',
         notas='Subila recién cuando la nota esté publicada. Agregá el sticker de Enlace entre el texto y la foto, con puestodepalta.com/blog/trece-pesos-y-un-certificado'),
    dict(id='2027-01-26-carrusel', fecha='2027-01-26', hora='20:00', dia='martes', tipo='Carrusel', titulo='Trece pesos y un certificado',
         musica='Mañanas en el Depósito',
         notas='Sale después de que publiques la nota del 24/1. Va con el Reel del lunes 25/1 (el guion está en el Plan de redes).',
         texto='Trece pesos por kilo: menos de un dólar. Es lo que cobraban en octubre los productores chicos de palta en Michoacán, México. Pedían un mínimo de 45.\n\n'
               'Tres semanas antes, México anunció que para exportar va a hacer falta un certificado de que la huerta no fue bosque. ¿Quién paga ese papel? El grande tiene una oficina. El chico, una camioneta.\n\n'
               f'La nota completa, {BLOG}\n\n#palta #mexico #michoacan #puestodepalta'),
    dict(id='2027-01-28-dato', fecha='2027-01-28', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='30 días en el mar',
         musica='Interminables Logísticas',
         notas='De la nota Treinta días en el mar y una palta que no se pudre, que ya está publicada.',
         texto='Una palta que sale de Chile tarda unos 30 días en llegar a Rotterdam: treinta días en una cámara de frío, adentro de un contenedor, en un barco.\n\n'
               f'Y algo tiene que impedir que los hongos hagan su trabajo en el camino. La historia completa está en la nota Treinta días en el mar y una palta que no se pudre, {BLOG}\n\n'
               f'{TAGS} #logistica #puestodepalta'),
    dict(id='2027-01-28-historia', fecha='2027-01-28', hora='21:00', dia='jueves', tipo='Historia', titulo='Pregunta: ¿cuánto tarda de Chile a Europa?',
         musica='Interminables Logísticas',
         notas='Agregá un sticker de Cuestionario en el espacio libre de abajo: "¿Cuánto tarda una palta de Chile a Europa?" con Una semana, Un mes (la correcta) y Tres meses.'),
    dict(id='2027-02-02-carrusel', fecha='2027-02-02', hora='20:00', dia='martes', tipo='Carrusel', titulo='Lo que tirás también es palta',
         musica='Temida Facturación',
         notas='Sale de cuatro notas que ya están publicadas. La imagen 4 adelanta el carrusel de las investigadoras del 11/2. Va con el Reel del viernes 5/2.',
         texto='Lo que tirás también es palta. El carozo tiene un pigmento naranja que podría reemplazar colorantes artificiales. Con la cáscara, en Australia hicieron un plástico para envolver alimentos. Y en México, con cáscaras y carozos, un material que limpia agua.\n\n'
               f'Todo esto salió de cuatro notas del blog. Están {BLOG}\n\n'
               '#palta #reciclaje #ciencia #puestodepalta'),
    dict(id='2027-02-04-dato', fecha='2027-02-04', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='El carozo es el 16% de la palta',
         musica='Mercado al Alba',
         notas='De la nota El naranja que nadie miraba, que ya está publicada.',
         texto='El carozo es cerca del 16% del peso de una palta. Y casi siempre termina en la basura.\n\n'
               f'Adentro tiene un pigmento naranja que podría servir como colorante natural. La historia completa está en la nota El naranja que nadie miraba, {BLOG}\n\n'
               '#palta #carozo #sabiasque #puestodepalta'),
    dict(id='2027-02-04-historia', fecha='2027-02-04', hora='21:00', dia='jueves', tipo='Historia', titulo='Encuesta: ¿qué hacés con el carozo?',
         musica='Mercado al Alba',
         notas='Agregá una encuesta abajo, sobre la mesa: "¿Qué hacés con el carozo?" con "Lo tiro" y "Lo planto".'),
    dict(id='2027-02-11-carrusel', fecha='2027-02-11', hora='20:00', dia='jueves', tipo='Carrusel', titulo='Investigadoras y palta (Día de la Mujer y la Niña en la Ciencia)',
         musica='Mañanas en el Depósito',
         notas='Reemplaza el dato del jueves. Los nombres y dónde trabaja cada una se confirmaron el 7/11 en la UNAM y en notas de prensa sobre el INIA.',
         texto='Hoy es el Día Internacional de la Mujer y la Niña en la Ciencia. Tres investigadoras que trabajan con palta:\n\n'
               'Sayra Orozco, de la UNAM, que junto a Michel Rivero hizo con cáscaras y carozos un material que limpia agua en Michoacán. Y Martina Ladino y Soledad Sánchez, del INIA La Platina, en Chile, que con Pablo Ulloa y Bruno Defilippi prueban aceites de hinojo y mostaza para que la palta no se pudra en el viaje.\n\n'
               f'Las dos historias, {BLOG}\n\n#mujeresenciencia #ciencia #palta #puestodepalta'),
    dict(id='2027-02-14-post', fecha='2027-02-14', hora='12:00', dia='domingo', tipo='Post', titulo='San Valentín: el palto también necesita pareja',
         musica='Ansiada Maduración',
         notas='Al mediodía, para que esté arriba todo el día. Si Pipi prefiere su idea (la palta partida como un corazón), va esa en lugar de esta. Lo de uno de cada diez árboles sale de la nota del 27/12.',
         texto='El palto también necesita pareja. Sus flores abren como hembra y como macho, y cada árbol lo hace en un horario distinto: tipo A o tipo B. Juntos, se polinizan.\n\n'
               'Por eso en California, uno de cada diez árboles de una huerta es tipo B: está ahí para que los otros tengan con quién.\n\n'
               'Feliz San Valentín.\n\n#sanvalentin #palta #paltahass #puestodepalta'),
    dict(id='2027-02-16-carrusel', fecha='2027-02-16', hora='20:00', dia='martes', tipo='Carrusel', titulo='El punto exacto 3: apurarla o frenarla',
         musica='Ansiada Maduración',
         notas='Tercera y última de la serie El punto exacto. Va con el Reel de Tom especialista del lunes 15/2, si lo graban.',
         texto='El punto exacto, parte 3: cómo apurar una palta o frenarla.\n\n'
               'Para apurarla, en una bolsa de papel con una banana o una manzana. Mientras está dura, afuera de la heladera. Cuando está lista, a la heladera, que la frena unos días. Horno y microondas, nunca: la ablandan, pero no la maduran.\n\n'
               f'Guardá este post. Y si la necesitás lista para un día justo, pedila en su punto por WhatsApp al {WA}.\n\n'
               f'{TAGS} #tips #puestodepalta'),
    dict(id='2027-02-18-dato', fecha='2027-02-18', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='0,72 euros: menos que un café',
         musica='Temida Facturación',
         notas='De la nota Cuando hay demasiada palta, que ya está publicada.',
         texto='En Francia, en el verano europeo de 2026, una palta Hass llegó a costar 72 centavos de euro. Menos que un café.\n\n'
               f'Había tanta palta en Europa que se vendía a precio de liquidación. La historia completa está en la nota Cuando hay demasiada palta, {BLOG}\n\n'
               f'{TAGS} #europa #puestodepalta'),
    dict(id='2027-02-18-historia', fecha='2027-02-18', hora='21:00', dia='jueves', tipo='Historia', titulo='Curiosidad: 0,72 euros',
         musica='Temida Facturación',
         notas='Agregá una encuesta en el espacio libre de abajo: "¿Lo sabías?" con Sí y No.'),
    dict(id='2027-02-25-dato', fecha='2027-02-25', hora='20:00', dia='jueves', tipo='Post (dato)', titulo='Kenia frenó sus exportaciones de palta',
         musica='Interminables Logísticas',
         notas='De la nota El robo de la palta keniata, que ya está publicada.',
         texto='En octubre de 2025, Kenia frenó todas sus exportaciones de palta por barco. Algunos exportadores mandaban a Europa fruta que todavía no estaba lista, con permisos irregulares.\n\n'
               f'Una palta con menos de 21% de materia seca no madura bien: llega linda por fuera y después no sirve. La historia completa está en la nota El robo de la palta keniata, {BLOG}\n\n'
               '#palta #kenia #exportacion #puestodepalta'),
    dict(id='2027-02-25-historia', fecha='2027-02-25', hora='21:00', dia='jueves', tipo='Historia', titulo='Pregunta: ¿por qué frenó Kenia?',
         musica='Interminables Logísticas',
         notas='Agregá un sticker de Cuestionario en el espacio libre de abajo: "¿Por qué Kenia frenó sus exportaciones de palta?" con Una plaga, Fruta inmadura (la correcta) y Una sequía.'),
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
    # que el lector de pantalla lea bien los símbolos
    alts = [a.replace('−8°', '8 grados bajo cero.').replace('30 → 71', 'De 30 a 71') for a in alts]
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
