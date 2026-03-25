import twilio from 'twilio';

/**
 * SERVICIO DE NOTIFICACIONES WHATSAPP VÍA TWILIO (TEMPLATE APROBADO)
 *
 * Envía mensajes usando contentSid + contentVariables.
 * Requiere variables de entorno:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_WHATSAPP_FROM  (ej: +12605537594)
 * - TWILIO_CONTENT_SID    (ej: HX0b7bd1b24b7822c0f8b92d6408947e6c)
 * - NOMBRE_EMPRESA        (se usa como nombre de clínica por defecto)
 */

/**
 * Formatea el teléfono al formato internacional de Chile para WhatsApp.
 * Acepta: 912345678, +56912345678, 56912345678, 0912345678
 */
function formatearTelefonoWhatsApp(telefono) {
    if (!telefono) return null;

    let limpio = telefono.replace(/[\s\-\(\)\.]/g, '');

    if (limpio.startsWith('+')) {
        return `whatsapp:${limpio}`;
    }

    if (limpio.startsWith('56') && limpio.length >= 11) {
        return `whatsapp:+${limpio}`;
    }

    if (limpio.startsWith('0')) {
        limpio = limpio.substring(1);
    }

    if (limpio.length === 9 && limpio.startsWith('9')) {
        return `whatsapp:+56${limpio}`;
    }

    return `whatsapp:+56${limpio}`;
}

/**
 * Envía un mensaje de WhatsApp usando el template aprobado de Twilio.
 *
 * @param {Object} params
 * @param {string} params.telefono  - Teléfono del paciente
 * @param {string} params.nombre    - Nombre del paciente
 * @param {string} params.clinica   - Nombre de la clínica (opcional, usa NOMBRE_EMPRESA)
 * @param {string} params.fecha     - Fecha de la cita (ej: "Lunes 28 de Julio 2025")
 * @param {string} params.hora      - Hora de la cita (ej: "10:30")
 * @returns {Promise<boolean>} true si se envió correctamente
 */
export async function enviarRecordatorioWhatsapp({ telefono, nombre, clinica, fecha, hora }) {
    const {
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_FROM,
        TWILIO_CONTENT_SID,
        NOMBRE_EMPRESA
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        console.warn("[WSP] Credenciales de Twilio no configuradas. Mensaje no enviado.");
        return false;
    }

    if (!TWILIO_WHATSAPP_FROM) {
        console.warn("[WSP] TWILIO_WHATSAPP_FROM no configurado. Mensaje no enviado.");
        return false;
    }

    if (!TWILIO_CONTENT_SID) {
        console.warn("[WSP] TWILIO_CONTENT_SID no configurado. Mensaje no enviado.");
        return false;
    }

    if (!telefono) {
        console.warn("[WSP] Teléfono vacío. Mensaje no enviado.");
        return false;
    }

    const destinatario = formatearTelefonoWhatsApp(telefono);
    if (!destinatario) {
        console.warn("[WSP] No se pudo formatear el teléfono:", telefono);
        return false;
    }

    const nombreClinica = clinica || NOMBRE_EMPRESA || "la clínica";
    const fromNumber = TWILIO_WHATSAPP_FROM.startsWith('+')
        ? TWILIO_WHATSAPP_FROM
        : `+${TWILIO_WHATSAPP_FROM}`;

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        await client.messages.create({
            from: `whatsapp:${fromNumber}`,
            to: destinatario,
            contentSid: TWILIO_CONTENT_SID,
            contentVariables: JSON.stringify({
                1: nombre,
                2: nombreClinica,
                3: fecha,
                4: hora
            })
        });

        console.log(`[WSP] Mensaje enviado a ${destinatario} (${nombre} - ${fecha} ${hora})`);
        return true;
    } catch (error) {
        console.error("[WSP] Error al enviar mensaje:", error.message);
        return false;
    }
}
