import twilio from 'twilio';

/**
 * SERVICIO DE NOTIFICACIONES WHATSAPP VÍA TWILIO
 *
 * Envía mensajes de recordatorio de citas por WhatsApp.
 * Requiere variables de entorno:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_WHATSAPP_NUMBER (ej: +14155238886)
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
 * Envía un mensaje de confirmación de agendamiento por WhatsApp
 */
export async function enviarConfirmacionWhatsApp({ telefono, nombrePaciente, fechaInicio, horaInicio }) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, NOMBRE_EMPRESA } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
        console.warn("[WSP-CONFIRMACION] Credenciales de Twilio no configuradas. Mensaje no enviado.");
        return false;
    }

    if (!telefono) {
        console.warn("[WSP-CONFIRMACION] Teléfono vacío. Mensaje no enviado.");
        return false;
    }

    const destinatario = formatearTelefonoWhatsApp(telefono);
    if (!destinatario) {
        console.warn("[WSP-CONFIRMACION] No se pudo formatear el teléfono:", telefono);
        return false;
    }

    const empresa = NOMBRE_EMPRESA || "la clínica";
    const fecha = new Date(fechaInicio);
    const fechaFormateada = fecha.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const mensaje = `Hola ${nombrePaciente}, tu cita en ${empresa} ha sido agendada para el ${fechaFormateada} a las ${horaInicio}. ¡Te esperamos!`;

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        await client.messages.create({
            body: mensaje,
            from: `whatsapp:${TWILIO_WHATSAPP_NUMBER.startsWith('+') ? TWILIO_WHATSAPP_NUMBER : '+' + TWILIO_WHATSAPP_NUMBER}`,
            to: destinatario
        });

        console.log(`[WSP-CONFIRMACION] Mensaje de confirmación enviado a ${destinatario}`);
        return true;
    } catch (error) {
        console.error("[WSP-CONFIRMACION] Error al enviar mensaje:", error.message);
        return false;
    }
}

/**
 * Envía un mensaje de recordatorio por WhatsApp usando Twilio
 */
export async function enviarMensajeWhatsApp({ telefono, nombrePaciente, horasRestantes }) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, NOMBRE_EMPRESA } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
        console.warn("[WSP-RECORDATORIO] Credenciales de Twilio no configuradas. Mensaje no enviado.");
        return false;
    }

    if (!telefono) {
        console.warn("[WSP-RECORDATORIO] Teléfono vacío. Mensaje no enviado.");
        return false;
    }

    const destinatario = formatearTelefonoWhatsApp(telefono);
    if (!destinatario) {
        console.warn("[WSP-RECORDATORIO] No se pudo formatear el teléfono:", telefono);
        return false;
    }

    const empresa = NOMBRE_EMPRESA || "la clínica";
    const textoHoras = horasRestantes === 1 ? "1 hora" : `${horasRestantes} horas`;

    const mensaje = `Hola ${nombrePaciente}, recuerda que tienes una cita en ${empresa} en ${textoHoras}. ¡Te esperamos!`;

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        await client.messages.create({
            body: mensaje,
            from: `whatsapp:${TWILIO_WHATSAPP_NUMBER.startsWith('+') ? TWILIO_WHATSAPP_NUMBER : '+' + TWILIO_WHATSAPP_NUMBER}`,
            to: destinatario
        });

        console.log(`[WSP-RECORDATORIO] Mensaje de ${textoHoras} enviado a ${destinatario}`);
        return true;
    } catch (error) {
        console.error("[WSP-RECORDATORIO] Error al enviar mensaje:", error.message);
        return false;
    }
}
