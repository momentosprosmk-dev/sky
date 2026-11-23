/* ==========================================================================
   Sky — Configuración Central de Enlaces y Contacto
   Edita aquí el número de WhatsApp y enlaces de la tienda.
   ========================================================================== */

window.enlaces = {
  // Cambia aquí el número de WhatsApp de la clienta (solo dígitos)
  codigoPais: "57",
  whatsapp: "3000000000",

  // Correo y redes (opcional)
  email: "hola@skyamigurumi.com",
  instagram: "#",
  tiktok: "#",

  // Helper para construir el enlace completo de WhatsApp
  obtenerUrlWhatsapp(mensaje = "") {
    const limpio = String(this.whatsapp || "").replace(/\D/g, "");
    const prefijo = String(this.codigoPais || "").replace(/\D/g, "");
    const numeroCompleto =
      prefijo && !limpio.startsWith(prefijo) ? `${prefijo}${limpio}` : limpio;

    const base = `https://wa.me/${numeroCompleto}`;
    return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
  },
};
