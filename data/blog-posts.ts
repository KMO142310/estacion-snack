export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  relatedProductSlugs: string[];
  relatedLinks?: Array<{
    label: string;
    href: string;
  }>;
  intro: string[];
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'que-comprar-para-oficina-frutos-secos-y-dulces-santa-cruz',
    title: 'Qué comprar para oficina: frutos secos y dulces por kilo en Santa Cruz',
    description:
      'Una guía práctica para armar una compra simple para oficina: qué bolsas rinden mejor, qué conviene mezclar y cómo pedir sin terminar con productos que sobran.',
    excerpt:
      'Si la compra es para una oficina, no conviene pedir al azar. Esta guía te ayuda a elegir bolsas que se sirvan fácil, rindan bien y no cansen al segundo día.',
    category: 'Oficina',
    publishedAt: '2026-05-15',
    readTime: '5 min',
    relatedProductSlugs: ['mix-europeo', 'almendra-entera', 'chuby-bardu'],
    relatedLinks: [
      { label: 'Ver catálogo', href: '/#productos' },
      { label: 'Revisar envíos', href: '/envios' },
      { label: 'Hacer una consulta', href: '/contacto' },
    ],
    intro: [
      'Cuando una compra es para oficina, el criterio cambia. Ya no basta con que el producto te guste a ti. Tiene que ser fácil de servir, rendir varios días y funcionar con personas que comen distinto.',
      'En Santa Cruz, muchas veces estas compras se hacen rápido y por WhatsApp. Por eso conviene llegar con una idea clara: qué producto sirve para dejar a mano, cuál aguanta mejor una semana y cuál vale la pena sumar solo como apoyo.',
    ],
    sections: [
      {
        heading: 'Parte por una base que no fatigue',
        paragraphs: [
          'Si solo vas a elegir una bolsa salada, el Mix Europeo suele ser la mejor entrada. Tiene variedad sin volverse raro y permite que cada persona saque algo distinto del mismo bowl.',
          'La Almendra Entera también funciona muy bien cuando la oficina prefiere algo más simple y limpio. Es fácil de porcionar, no ensucia y se puede dejar en un frasco sin que pierda sentido a los dos días.',
        ],
      },
      {
        heading: 'El dulce en oficina conviene pensarlo como complemento',
        paragraphs: [
          'En una mesa de trabajo el dulce funciona mejor cuando acompaña y no domina. Chuby Bardú suele rendir bien porque se sirve rápido, se ve bien en un recipiente chico y se reparte sin que alguien tenga que manipular mucho.',
          'Las gomitas también pueden servir, pero conviene usarlas más como apoyo que como compra principal si la oficina es pequeña. En espacios chicos, una combinación con demasiado dulce se consume fuerte el primer día y después pierde gracia.',
        ],
      },
      {
        heading: 'Una combinación simple que casi siempre funciona',
        paragraphs: [
          'Si quieres resolver una compra sin pensar demasiado, una mezcla segura es una bolsa de Mix Europeo y una de Chuby Bardú. Tienes una opción más neutra y otra más lúdica, sin recargar la compra ni duplicar funciones.',
          'Si el equipo prefiere evitar chocolate o busca algo más sobrio, cambia Bardú por Almendra Entera. La lógica sigue siendo la misma: una bolsa más variada y una bolsa más directa.',
        ],
      },
      {
        heading: 'Qué conviene preguntar antes de pedir',
        paragraphs: [
          'Antes de escribir por WhatsApp, ayuda tener tres respuestas: cuántas personas comen, si el producto quedará fijo varios días y si quieres algo solo para picar o también para ofrecer a visitas.',
          'Con eso el pedido sale más afinado desde el comienzo. No necesitas un catálogo enorme para resolver una oficina; necesitas dos o tres bolsas bien elegidas y una forma simple de reponer cuando se acaban.',
        ],
      },
    ],
  },
  {
    slug: 'dulces-por-kilo-para-cumpleanos-en-santa-cruz',
    title: 'Dulces por kilo para cumpleaños en Santa Cruz: qué conviene pedir',
    description:
      'Cómo elegir dulces por kilo para cumpleaños y mesas simples: qué bolsas lucen mejor, cuáles rinden más y cómo armar una compra que tenga sentido para niños y adultos.',
    excerpt:
      'Si compras para cumpleaños, no se trata solo de llenar una mesa. Conviene elegir bolsas que se vean bien, se sirvan fácil y no te dejen con sobrantes sin destino.',
    category: 'Cumpleaños',
    publishedAt: '2026-05-15',
    readTime: '5 min',
    relatedProductSlugs: ['gomita-osito-docile', 'chuby-bardu', 'mani-confitado-tropical'],
    relatedLinks: [
      { label: 'Ver packs', href: '/#packs' },
      { label: 'Ver catálogo', href: '/#productos' },
      { label: 'Hablar por WhatsApp', href: '/contacto' },
    ],
    intro: [
      'Los cumpleaños no siempre necesitan una mesa enorme para verse bien. Muchas veces lo que más ayuda es elegir pocas cosas, pero que se sirvan fácil, tengan color y aguanten bien durante toda la celebración.',
      'Cuando compras dulces por kilo en Santa Cruz, la ventaja está en que puedes armar una combinación simple con precios visibles y sin depender de bolsas chicas repetidas. Eso hace más fácil calcular, servir y repetir si hace falta.',
    ],
    sections: [
      {
        heading: 'Empieza por lo que se ve y se reparte bien',
        paragraphs: [
          'Para cumpleaños, Chuby Bardú suele ser una de las mejores bolsas para partir. Tiene color, se entiende al instante y funciona tanto en bowls como en vasos o recipientes individuales.',
          'Las Gomitas Osito Docile también ayudan mucho cuando quieres algo blando, amigable y fácil de servir a niños. Entre ambas cubres dos texturas distintas sin tener que sumar demasiadas variedades.',
        ],
      },
      {
        heading: 'El maní tropical suma color, pero cumple otro rol',
        paragraphs: [
          'El Maní Confitado Tropical no reemplaza a las gomitas ni al chocolate. Cumple mejor como tercera bolsa o como apoyo para una mesa donde quieres algo crujiente y más de sobremesa.',
          'Si la celebración tiene más adultos o mezcla edades, ahí sí gana fuerza. No es el producto más infantil del catálogo, pero sí uno de los que más rinde cuando la gente picotea varias veces.',
        ],
      },
      {
        heading: 'Cómo armar una compra que no quede desbalanceada',
        paragraphs: [
          'Una combinación razonable para un cumpleaños pequeño es Bardú más Gomitas Osito. Si quieres una tercera bolsa, suma Tropical. Con eso cubres chocolate, goma y algo crujiente, sin repetir demasiado el mismo registro.',
          'La clave es no comprar cuatro cosas que hacen prácticamente lo mismo. En mesas chicas, dos o tres bolsas distintas suelen verse mejor que una acumulación de dulces parecidos sin jerarquía.',
        ],
      },
      {
        heading: 'Qué conviene definir antes de escribir',
        paragraphs: [
          'Antes de hacer el pedido, piensa si los dulces van para una mesa principal, para repartir en bolsitas o para ambas cosas. Esa respuesta cambia qué productos conviene priorizar.',
          'Si ya sabes eso, el pedido por WhatsApp sale mucho más claro. Puedes decir cuántas bolsas te interesan, para qué ocasión son y si necesitas retiro o despacho. Esa simpleza vale más que un formulario largo cuando el evento está encima.',
        ],
      },
    ],
  },
  {
    slug: 'como-funciona-el-despacho-en-santa-cruz-palmilla-peralillo-y-marchigue',
    title: 'Cómo funciona el despacho en Santa Cruz, Palmilla, Peralillo y Marchigüe',
    description:
      'Una explicación simple del despacho local de Estación Snack: qué comunas cubrimos, cuánto cuesta el envío, cuándo entregamos y cómo se coordina el pedido por WhatsApp.',
    excerpt:
      'Si nunca has pedido antes, esta es la duda más normal: si llegamos a tu comuna, cuánto cuesta y cómo coordinamos la entrega. Aquí está explicado sin rodeos.',
    category: 'Despacho local',
    publishedAt: '2026-05-15',
    readTime: '4 min',
    relatedProductSlugs: ['mix-europeo', 'mani-confitado-tropical'],
    relatedLinks: [
      { label: 'Ver envíos', href: '/envios' },
      { label: 'Preguntas frecuentes', href: '/faq' },
      { label: 'Contacto', href: '/contacto' },
    ],
    intro: [
      'Una de las preguntas más comunes antes de hacer un pedido es si despachamos a la comuna donde estás. La respuesta corta es sí, pero dentro de una cobertura local bien definida.',
      'Trabajamos en Santa Cruz y comunas cercanas porque preferimos prometer solo lo que de verdad podemos coordinar bien. Eso hace que el pedido sea más simple y que la entrega no dependa de sistemas externos ni de un courier genérico.',
    ],
    sections: [
      {
        heading: 'A qué comunas llegamos',
        paragraphs: [
          'Hoy cubrimos Santa Cruz, Palmilla, Peralillo y Marchigüe, además del retiro en local. Son las comunas donde el sistema actual funciona con más claridad y donde podemos mantener costos razonables.',
          'No usamos la idea de “despacho a todo Chile” porque no sería honesta con la operación real del negocio. La gracia acá es justamente la cercanía: pedido directo, coordinación simple y cobertura concreta.',
        ],
      },
      {
        heading: 'Cuánto cuesta y cuándo sale gratis',
        paragraphs: [
          'El retiro en local es gratis. En Santa Cruz el despacho cuesta $1.000 y en Palmilla, Peralillo y Marchigüe cuesta $2.000. Sobre $25.000, el envío sale gratis dentro de la cobertura.',
          'Esa regla simple sirve para que el pedido se entienda desde el inicio. No hay tarifas escondidas ni cálculo raro al final de la conversación.',
        ],
      },
      {
        heading: 'Cómo coordinamos la entrega',
        paragraphs: [
          'El pedido se arma desde la web y se confirma por WhatsApp. Ahí revisamos la bolsa, la comuna, el horario y la forma de pago. La coordinación ocurre con nombre y apellido, no con una app que te deja esperando un correo.',
          'Despachamos de martes a sábado en horario de tarde-noche. Cuando hace falta ajustar algún detalle, se conversa ahí mismo. Ese formato es precisamente parte del valor del sitio.',
        ],
      },
      {
        heading: 'Qué hacer si estás fuera de cobertura',
        paragraphs: [
          'Si estás fuera de estas comunas, igual vale la pena escribir. No porque prometamos llegar siempre, sino porque algunas situaciones sí se pueden evaluar caso a caso.',
          'Lo importante es que la información base ya está clara antes de mandar el mensaje. Sabes a qué comunas llegamos, cuánto cuesta y cómo operamos. Eso evita pérdidas de tiempo para ambos lados.',
        ],
      },
    ],
  },
  {
    slug: 'que-pedir-primero-frutos-secos-santa-cruz',
    title: 'Qué pedir primero si buscas frutos secos por kilo en Santa Cruz',
    description:
      'Una guía corta para partir bien: qué bolsa conviene mirar primero, cómo elegir entre mix, almendra o confitados y cómo armar un primer pedido simple.',
    excerpt:
      'Si es tu primera compra, no hace falta pedir de todo. Esta guía te ayuda a partir por las bolsas más fáciles de aprovechar en la casa, la oficina o la sobremesa.',
    category: 'Guía local',
    publishedAt: '2026-05-14',
    readTime: '4 min',
    relatedProductSlugs: ['mix-europeo', 'almendra-entera', 'mani-confitado-tropical'],
    intro: [
      'Cuando alguien llega por primera vez a Estación Snack, la duda más común no es el precio. Es por dónde conviene partir.',
      'Como el catálogo es corto, la gracia está en elegir bien según el uso real: picoteo diario, algo dulce para compartir o una bolsa que dure varios días en la casa.',
    ],
    sections: [
      {
        heading: 'Si quieres una bolsa que le guste a casi todos',
        paragraphs: [
          'El punto de partida más fácil suele ser el Mix Europeo. Tiene almendra, maní, nuez y avellana, así que funciona bien para dejar a mano y picar durante la semana.',
          'Es la bolsa más simple para probar el catálogo porque no exige contexto: sirve para la oficina, para la once, para llevar en el auto o para tener algo salado en casa sin abrir varias bolsas distintas.',
        ],
      },
      {
        heading: 'Si prefieres algo más limpio y directo',
        paragraphs: [
          'La Almendra Entera conviene cuando buscas una sola cosa bien resuelta. Es la opción más fácil de repartir en porciones pequeñas y la que mejor aguanta abierta si la guardas bien.',
          'También es la más útil si te gusta mezclar en tu propia cocina: puedes usarla sola, sumarla a yogur o dejarla como colación sin depender de un mix armado.',
        ],
      },
      {
        heading: 'Si quieres algo dulce para compartir',
        paragraphs: [
          'Para una primera compra dulce, el Maní Confitado Tropical es una buena entrada porque da color, rinde bien al servir y suele gustar tanto a niños como a adultos.',
          'Si prefieres un sabor más clásico, el Maní Confitado Rojo es más directo. El criterio no es cuál es “mejor”, sino qué tipo de picoteo quieres armar.',
        ],
      },
      {
        heading: 'Una primera compra simple que suele funcionar',
        paragraphs: [
          'Si quieres pedir sin complicarte, una combinación razonable es partir con un salado y un dulce. Por ejemplo: una bolsa de Mix Europeo y una de Maní Tropical.',
          'Con eso ves la calidad, el tamaño de las bolsas y el ritmo en que se consume en tu casa. Después ya es mucho más fácil repetir o afinar el pedido por WhatsApp.',
        ],
      },
    ],
  },
  {
    slug: 'como-guardar-frutos-secos-y-dulces-por-kilo',
    title: 'Cómo guardar frutos secos y dulces por kilo para que duren mejor',
    description:
      'Consejos simples para conservar mejor almendras, mix, gomitas y chocolates: dónde guardarlos, qué separar y cómo evitar que pierdan textura.',
    excerpt:
      'Una buena compra no termina cuando llega la bolsa. Guardar bien cada producto hace que dure más, conserve mejor la textura y no pierda gracia a los pocos días.',
    category: 'Consejos',
    publishedAt: '2026-05-14',
    readTime: '3 min',
    relatedProductSlugs: ['mix-europeo', 'chuby-bardu', 'gomita-osito-docile'],
    intro: [
      'Cuando compras por kilo, el almacenamiento importa casi tanto como el producto mismo.',
      'No hace falta tener recipientes especiales, pero sí conviene separar por tipo y evitar tres cosas: calor, humedad y bolsas abiertas por muchos días.',
    ],
    sections: [
      {
        heading: 'Frutos secos: mejor cerrados y lejos del calor',
        paragraphs: [
          'El Mix Europeo y la Almendra Entera aguantan mejor en un frasco o recipiente hermético, guardados en una despensa fresca o en un mueble sin sol directo.',
          'Si sabes que los vas a consumir lento, conviene dividir una bolsa grande en dos envases más chicos. Así no abres y cierras el mismo todos los días.',
        ],
      },
      {
        heading: 'Dulces y chocolates: separados por textura',
        paragraphs: [
          'Las gomitas y los chocolates no conviene guardarlos juntos. Las gomitas toleran mejor una temperatura ambiente fresca; los confites de chocolate agradecen un lugar más seco y estable.',
          'Los confitados, en cambio, suelen mantenerse bien mientras no tomen humedad. Si quedan cerca de vapor o cocina, pierden crocancia mucho antes.',
        ],
      },
      {
        heading: 'Qué hacer si compras para varios días',
        paragraphs: [
          'Si la compra es para casa, una buena práctica es dejar una parte en uso y otra cerrada. Eso funciona especialmente bien con Mix Europeo, Bardú y gomitas.',
          'Cuando el producto se ve y se sirve fácil, además se consume con más orden. A veces cambiar de bolsa a un frasco hace que dure más por simple hábito.',
        ],
      },
    ],
  },
  {
    slug: 'ideas-para-armar-un-picoteo-con-frutos-secos-y-dulces',
    title: 'Ideas simples para armar un picoteo con frutos secos y dulces',
    description:
      'Tres combinaciones fáciles para casa, oficina o cumpleaños: qué productos mezclar, cómo servirlos y qué bolsas conviene pedir juntas.',
    excerpt:
      'No siempre se compra por producto. Muchas veces se compra por ocasión: una sobremesa, una junta chica, una oficina o un cumpleaños. Estas combinaciones ayudan a pedir más claro.',
    category: 'Ideas',
    publishedAt: '2026-05-14',
    readTime: '4 min',
    relatedProductSlugs: ['mix-europeo', 'gomita-osito-docile', 'chuby-bardu'],
    intro: [
      'Cuando el catálogo es corto y bien elegido, conviene pensar en pares o combinaciones, no solo en bolsas sueltas.',
      'Eso ayuda a pedir mejor, a repartir mejor y también a que el pedido tenga más sentido según la ocasión.',
    ],
    sections: [
      {
        heading: 'Para una tarde en casa o una mesa tranquila',
        paragraphs: [
          'La combinación más fácil es Mix Europeo con Almendra Entera. Un bowl queda más diverso y el otro más simple, así que cada uno se sirve a su ritmo.',
          'Sirve para una sobremesa, una reunión chica o simplemente para dejar algo resuelto durante varios días sin caer en puro dulce.',
        ],
      },
      {
        heading: 'Para cumpleaños, oficina o algo más compartible',
        paragraphs: [
          'Si el plan es más social, Bardú con Gomita Osito Docile funciona muy bien. Tienes un chocolate de color fácil de servir y una goma que llena mesa rápido.',
          'También es una combinación útil cuando quieres algo que se vea alegre sin tener que comprar demasiadas variedades.',
        ],
      },
      {
        heading: 'Para quienes quieren un dulce más clásico',
        paragraphs: [
          'El Maní Confitado Rojo y el Tropical cumplen roles parecidos, pero no iguales. El rojo es más clásico y directo; el tropical se siente más variado y más de compartir.',
          'Pedir una de cada una también funciona bien si no sabes cuál va a correr más en tu casa. Son bolsas que se entienden fácil apenas llegan.',
        ],
      },
    ],
  },
];
