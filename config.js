import express, { Router, json } from "express";
import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";

const app = express();

// Sirve archivos estáticos de la carpeta ./dist
app.use(express.static(path.join(path.resolve(), "./dist")));
app.use('/assets', express.static(path.join(path.resolve(), './dist/assets')));


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
