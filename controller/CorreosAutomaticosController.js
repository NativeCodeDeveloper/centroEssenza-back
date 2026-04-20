import "dotenv/config";

export default class CorreosAutomaticosController {

    constructor() {

    }


    static async enviarSeguimiento(req, res) {
        try {
            const { asunto, email, mensaje } = req.body;
            console.log(req.body);

            // Validación básica
            if (!asunto || !email || !mensaje) {
                return res.status(400).json({ message: 'sindato' });
            }

            const apiKey = process.env.BREVO_API_KEY;
            const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;

            if (!apiKey) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ mensaje: 'sindato' });
            }

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: NOMBRE_EMPRESA,
                        email: "contacto@nativecode.cl",
                    },
                    to: [
                        {
                            email: email, // email del cliente
                            name: "Cliente",
                        },
                    ],
                    replyTo: {
                        email: "contacto@nativecode.cl",
                        name: NOMBRE_EMPRESA,
                    },
                    subject: asunto,
                    htmlContent: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #0369a1;">${NOMBRE_EMPRESA}</h2>
                            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
                                ${mensaje.replace(/\n/g, '<br/>')}
                            </div>
                            <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
                                Si tienes alguna consulta adicional, no dudes en contactarnos en nuestros canales regulares.
                            </p>
                        </div>
                    `,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error Brevo:", data);
                return res.status(500).json({ mensaje: false });
            }

            return res.json({
                message: true,
            });

        } catch (error) {
            console.error("Error servidor:", error);
            return res.status(500).json({ ok: false, error: "Error del servidor al enviar correo" });
        }
    }

    static async enviarTelemedicina(req, res) {
        try {
            const { email, nombrePaciente, apellidoPaciente, asunto, linkTelemedicina } = req.body;
            console.log("[TELEMEDICINA] BODY:", req.body);

            if (!email || !nombrePaciente || !asunto || !linkTelemedicina) {
                return res.status(400).json({ message: "sindato" });
            }

            const { BREVO_API_KEY, NOMBRE_EMPRESA, CORREO_REMITENTE, CORREO_RECEPTOR } = process.env;

            if (!BREVO_API_KEY) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ message: false, error: "BREVO_API_KEY no configurada" });
            }

            const fromEmail = CORREO_REMITENTE || CORREO_RECEPTOR;
            if (!fromEmail) {
                console.error("Falta CORREO_REMITENTE/CORREO_RECEPTOR en .env");
                return res.status(500).json({ message: false, error: "No hay remitente configurado" });
            }

            const nombreEmpresa = NOMBRE_EMPRESA || "Clinica";
            const nombreCompleto = `${nombrePaciente} ${apellidoPaciente || ""}`.trim();
            const subject = asunto.trim() || "Enlace de Telemedicina";
            const textContent =
                `Hola ${nombreCompleto || "Paciente"},\n\n` +
                `Te compartimos el enlace para tu atencion por telemedicina:\n${linkTelemedicina}\n\n` +
                `Por favor ingresa a la sala unos minutos antes de la hora acordada.\n\n` +
                `Si tienes algun inconveniente para acceder, responde este correo.\n\n` +
                `Equipo clinico ${nombreEmpresa}`;

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: nombreEmpresa,
                        email: fromEmail,
                    },
                    to: [
                        {
                            email,
                            name: nombreCompleto || "Paciente",
                        },
                    ],
                    replyTo: {
                        email: fromEmail,
                        name: nombreEmpresa,
                    },
                    subject,
                    textContent,
                    htmlContent: `
                        <div style="background:#f5f7fb;padding:24px 12px;font-family:Arial,sans-serif;color:#334155;">
                            <div style="max-width:820px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:24px;overflow:hidden;">
                                <div style="background:#1e293b;padding:32px 38px;">
                                    <div style="color:#93c5fd;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Comunicacion Clinica</div>
                                    <div style="margin-top:14px;color:#ffffff;font-size:26px;font-weight:700;line-height:1.25;">${nombreEmpresa}</div>
                                    <div style="margin-top:14px;color:#cbd5e1;font-size:14px;">Informacion oficial enviada desde nuestro equipo de atencion.</div>
                                </div>
                                <div style="padding:34px 38px 26px 38px;">
                                    <div style="display:inline-block;background:#eef2ff;color:#3657d6;border-radius:999px;padding:12px 22px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                                        Acceso a Telemedicina
                                    </div>
                                    <div style="margin-top:18px;background:#f8fafc;border:1px solid #dbe4f0;border-radius:22px;padding:28px 26px;">
                                        <p style="margin:0 0 22px 0;font-size:17px;font-weight:700;color:#334155;">Hola ${nombreCompleto || "Paciente"},</p>
                                        <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#475569;">Te compartimos el enlace para tu atencion por telemedicina:</p>
                                        <p style="margin:0 0 22px 0;">
                                            <a href="${linkTelemedicina}" style="color:#3657d6;font-size:15px;font-weight:700;text-decoration:underline;word-break:break-all;">${linkTelemedicina}</a>
                                        </p>
                                        <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#475569;">Por favor ingresa a la sala unos minutos antes de la hora acordada.</p>
                                        <p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">Si tienes algun inconveniente para acceder, responde este correo.</p>
                                    </div>
                                    <div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:24px;">
                                        <p style="margin:0 0 14px 0;font-size:15px;font-weight:700;color:#1e293b;">Equipo clinico ${nombreEmpresa}</p>
                                        <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b;">Este correo corresponde a una comunicacion formal de atencion. Si requiere asistencia adicional, puede responder directamente a este mensaje o contactarnos por nuestros canales oficiales.</p>
                                    </div>
                                </div>
                                <div style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:18px 38px;color:#94a3b8;font-size:13px;">
                                    ${nombreEmpresa} · Mensajeria institucional de pacientes
                                </div>
                            </div>
                        </div>
                    `,
                }),
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => "");
                console.error("Error Brevo telemedicina:", response.status, errText);
                return res.status(500).json({ message: false, error: errText || "Brevo rechazo el correo" });
            }

            const data = await response.json().catch(() => ({}));
            console.log("[TELEMEDICINA] Correo enviado:", data);
            return res.json({ message: true });
        } catch (error) {
            console.error("Error servidor telemedicina:", error);
            return res.status(500).json({ message: false, error: "Error del servidor al enviar correo de telemedicina" });
        }
    }







    static async enviarFormularioContacto(req, res) {
        try {
            const { nombre, email, mensaje } = req.body;
            const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;
            console.log(req.body);

            // Validación básica
            if (!nombre || !email || !mensaje) {
                return res.status(400).json({ message: 'sindato' });
            }

            const apiKey = process.env.BREVO_API_KEY;
            if (!apiKey) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ mensaje: 'sindato' });}

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: "E-Commerce ProSuite",
                        email: "contacto@nativecode.cl", // remitente de TU dominio
                    },
                    to: [
                        {
                            email: "contacto@nativecode.cl", // donde recibes tú
                            name: "NativeCode",
                        },
                    ],
                    replyTo: {
                        email,
                        name: nombre,
                    },
                    subject: `Nuevo mensaje de ${nombre}`,
                    htmlContent: `

            <h2>Nueva consulta de Cliente desde E-Commerce Pro (Formulario de Contacto):</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong><br/>${mensaje}</p>
          `,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error Brevo:", data);
                return res.status(500).json({ mensaje:false });
            }

            return res.json({
                message: true,});

        } catch (error) {
            console.error("Error servidor:", error);
            return res.status(500).json({ ok: false, error: "Error del servidor al enviar correo" });
        }
    }






    static async enviarComprobanteCompra(req, res) {
        try {
            const { cliente, venta, productos } = req.body;
            console.log("BODY COMPROBANTE:", req.body);
            const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;

            // Validación básica
            if (!cliente || !venta || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ message: 'sindato' });
            }

            const apiKey = process.env.BREVO_API_KEY;
            if (!apiKey) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ message: 'sindato' });
            }

            // Armamos tabla HTML con el detalle de la compra
            const filasProductos = productos.map((producto) => {
                const subtotal = Number(producto.cantidad) * Number(producto.precioUnitario || producto.precio);
                return `
                <tr>
                    <td>${producto.nombre}</td>
                    <td style="text-align:center;">${producto.cantidad}</td>
                    <td style="text-align:right;">$${Number(producto.precioUnitario || producto.precio).toLocaleString('es-CL')}</td>
                    <td style="text-align:right;">$${subtotal.toLocaleString('es-CL')}</td>
                </tr>
            `;
            }).join("");

            const totalTexto = Number(venta.total).toLocaleString('es-CL');

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: "E-Commerce ProSuite",
                        email: "contacto@nativecode.cl", // remitente de TU dominio
                    },
                    to: [
                        {
                            email: cliente.email,         // cliente que compró
                            name: cliente.nombre,
                        },
                        {
                            email: "contacto@nativecode.cl", // copia para ti
                            name: "NativeCode",
                        },
                    ],
                    replyTo: {
                        email: "contacto@nativecode.cl",
                        name: "Soporte ProSuite",
                    },
                    subject: `Comprobante de compra #${venta.codigo || venta.id || ""}`,
                    htmlContent: `
                    <h2>Gracias por tu compra, ${cliente.nombre}</h2>
                    <p>Este es el comprobante de tu compra realizada en <strong> ${NOMBRE_EMPRESA} </strong>.</p>

                    <h3>Datos de la compra</h3>
                    <p><strong>Código de pedido:</strong> ${venta.codigo || "-"}<br/>
                    <strong>Método de pago:</strong> ${venta.medioPago || "-"}<br/>
                    <strong>Fecha:</strong> ${venta.fecha || new Date().toLocaleString('es-CL')}</p>

                    <h3>Detalle de productos</h3>
                    <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th align="left">Producto</th>
                                <th>Cant.</th>
                                <th align="right">Precio</th>
                                <th align="right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filasProductos}
                        </tbody>
                    </table>

                    <h3 style="text-align:right; margin-top:16px;">
                        Total pagado: $${totalTexto} CLP
                    </h3>

                    <p>Ante cualquier duda sobre tu compra, porfavor contacta a nuestros canales de ventas oficiales.</p>
                `,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error Brevo comprobante:", data);
                return res.status(500).json({ message: false });
            }

            return res.json({ message: true });

        } catch (error) {
            console.error("Error servidor (comprobante):", error);
            return res.status(500).json({ message: false, error: "Error del servidor al enviar comprobante" });
        }
    }
}
