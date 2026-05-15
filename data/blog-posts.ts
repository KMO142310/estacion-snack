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
  intro: string[];
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
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
