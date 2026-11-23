/* ==========================================================================
   Sky — Datos de Colecciones (Boseto preparado para conectar con Google Sheets)
   ========================================================================== */

window.SkyColecciones = (() => {
  const STORAGE_KEY = "sky_colecciones_data";

  const DEFAULT_ITEMS = [
    {
      id: "conejita-bailarina-rosa",
      nombre: "Conejita Bailarina",
      categoria: "peluches",
      categoriaLabel: "Peluches & Animales",
      etiqueta: "Trabajo destacado",
      imagen: "colecciones/conejita-bailarina-rosa.png",
      descripcion:
        "Conejita tejida en felpa suave color crema con tutú, lazo y zapatillas en rosa pastel. Ideal para regalo especial o decoración infantil.",
      tamano: "35 cm aprox.",
      material: "Hilo chenille suave & ojos de seguridad",
      tiempo: "5 a 7 días hábiles",
      visible: true,
    },
    {
      id: "muneca-personalizada-caja",
      nombre: "Muñeca Personalizada en Caja",
      categoria: "personalizados",
      categoriaLabel: "Personalizados",
      etiqueta: "A medida",
      imagen: "colecciones/muneca-personalizada-caja.png",
      descripcion:
        "Diseño personalizado inspirado en persona real: gafas, vestuario a elección, accesorios y presentación en caja de regalo.",
      tamano: "22 cm aprox.",
      material: "100% Algodón mercerizado & accesorios",
      tiempo: "6 a 8 días hábiles",
      visible: true,
    },
    {
      id: "spiderman-amigurumi",
      nombre: "Spider-Man con Máscara",
      categoria: "personajes",
      categoriaLabel: "Personajes",
      etiqueta: "Superhéroe",
      imagen: "colecciones/spiderman-amigurumi.png",
      descripcion:
        "Personaje tejido en crochet con detalles bordados a mano, traje azul y rojo y máscara removible.",
      tamano: "20 cm aprox.",
      material: "Algodón hipoalergénico & bordado manual",
      tiempo: "5 a 6 días hábiles",
      visible: true,
    },
    {
      id: "spiderman-sin-mascara",
      nombre: "Peter Parker + Gorro Intercambiable",
      categoria: "personajes",
      categoriaLabel: "Personajes",
      etiqueta: "2 en 1",
      imagen: "colecciones/spiderman-sin-mascara.png",
      descripcion:
        "Versión con rostro descubierto, cabello rizado y gorro-máscara aparte para cambiar de estilo.",
      tamano: "20 cm aprox.",
      material: "Algodón peinado & ojos de seguridad",
      tiempo: "5 a 7 días hábiles",
      visible: true,
    },
    {
      id: "personaje-jesus-frente",
      nombre: "Jesús Peregrino (Frente)",
      categoria: "personajes",
      categoriaLabel: "Personajes",
      etiqueta: "Edición especial",
      imagen: "colecciones/personaje-jesus-frente.png",
      descripcion:
        "Figura artesanal con túnica blanca, chaleco rosa suave, bolso cruzado y sandalias tejidas punto por punto.",
      tamano: "24 cm aprox.",
      material: "Algodón mercerizado & relleno siliconado",
      tiempo: "6 a 7 días hábiles",
      visible: true,
    },
    {
      id: "personaje-espalda-morral",
      nombre: "Detalle Morral & Cabello Rizado",
      categoria: "personajes",
      categoriaLabel: "Personajes",
      etiqueta: "Detalle artesanal",
      imagen: "colecciones/personaje-espalda-morral.png",
      descripcion:
        "Vista posterior que muestra el acabado del cabello rizado en relieve y morral funcional tejido a crochet.",
      tamano: "24 cm aprox.",
      material: "Algodón mercerizado",
      tiempo: "6 a 7 días hábiles",
      visible: true,
    },
    {
      id: "sonajero-conejita-lila",
      nombre: "Sonajero Conejita Lila",
      categoria: "peluches",
      categoriaLabel: "Peluches & Animales",
      etiqueta: "Para bebés",
      imagen: "colecciones/sonajero-conejita-lila.png",
      descripcion:
        "Sonajero de apego en tono lila con lazo rosa pastel y carita bordada 100% segura para recién nacidos.",
      tamano: "18 cm aprox.",
      material: "Algodón hipoalergénico sin piezas plásticas",
      tiempo: "3 a 4 días hábiles",
      visible: true,
    },
    {
      id: "mini-panda-amigurumi",
      nombre: "Mini Osito Panda",
      categoria: "llaveros",
      categoriaLabel: "Llaveros & Mini",
      etiqueta: "Animalito",
      imagen: "colecciones/mini-panda-amigurumi.png",
      descripcion:
        "Tierno panda miniatura en blanco y negro, ideal como llavero, adorno de escritorio o recuerdo de evento.",
      tamano: "9 cm aprox.",
      material: "Hilo de algodón & ojos de seguridad",
      tiempo: "2 a 3 días hábiles",
      visible: true,
    },
    {
      id: "llavero-gengar-crochet",
      nombre: "Llavero Gengar",
      categoria: "llaveros",
      categoriaLabel: "Llaveros & Mini",
      etiqueta: "Llavero",
      imagen: "colecciones/llavero-gengar-crochet.png",
      descripcion:
        "Personaje morado con ojos rojos, sonrisa bordada y mosquetón metálico resistente para llaves o mochila.",
      tamano: "8 cm aprox.",
      material: "Algodón fino & herraje metálico",
      tiempo: "2 a 3 días hábiles",
      visible: true,
    },
    {
      id: "mini-personaje-azul",
      nombre: "Mini Criatura Kawaii Azul",
      categoria: "llaveros",
      categoriaLabel: "Llaveros & Mini",
      etiqueta: "Miniatura",
      imagen: "colecciones/mini-personaje-azul.png",
      descripcion:
        "Pequeño personaje azul rey de bolsillo con mejillas bordadas, ideal para llavero o detalle personalizado.",
      tamano: "6 cm aprox.",
      material: "Hilo de algodón suave",
      tiempo: "2 días hábiles",
      visible: true,
    },
  ];

  function obtenerTodas() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback a datos por defecto
    }
    return DEFAULT_ITEMS.map((item) => ({ ...item }));
  }

  function obtenerVisibles() {
    return obtenerTodas().filter((item) => item.visible !== false);
  }

  function guardarTodas(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function restaurarEjemplo() {
    localStorage.removeItem(STORAGE_KEY);
    return obtenerTodas();
  }

  function resolverImagen(rutaRelativa, mediaBase = "recursos/media/") {
    if (!rutaRelativa) return "";
    if (/^https?:\/\//i.test(rutaRelativa) || rutaRelativa.startsWith("data:")) {
      return rutaRelativa;
    }
    return `${mediaBase}${rutaRelativa}`;
  }

  return {
    obtenerTodas,
    obtenerVisibles,
    guardarTodas,
    restaurarEjemplo,
    resolverImagen,
    DEFAULT_ITEMS,
  };
})();
