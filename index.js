import express, { Router, json } from "express";
import cors from "cors";
import "dotenv/config";
import sgMail from "@sendgrid/mail";
import { readFile } from "fs/promises";
import path from "path";

const app = express();

// Sirve archivos estáticos de la carpeta ./dist
app.use(express.static(path.join(path.resolve(), "./dist")));
app.use('/assets', express.static(path.join(path.resolve(), './dist/assets')));

// Middleware de CORS y JSON
app.use(json());
app.use(cors());

// Configura SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Endpoint para manejar el formulario de contacto
app.post("/contact", async (req, res) => {
  const name = `${req.body.firstName} ${req.body.lastName}`;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: `${process.env.EMAIL_USER}`,
    to: "beloqui.cesar@gmail.com",
    subject: "Contacto Formulario - Portfolio",
    html: `<p>Nombre: ${name}</p>
           <p>Email: ${email}</p>
           <p>Teléfono: ${phone}</p>
           <p>Mensaje: ${message}</p>`,
  };
  try {
    await sgMail.send(mail);
    res.json({ code: 200, status: "Mensaje enviado" });
  } catch (e) {
    res.json(e);
  }
});

// Sirve el archivo HTML para todas las demás rutas
app.get("*", async (_req, res) => {
  try {
    const html = await readFile("./dist/index.html", "utf-8");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server corriendo en http://localhost:${PORT}`));
