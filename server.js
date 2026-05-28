const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Eres un agente de ética aplicada para estudiantes de ingeniería sobre vehículos autónomos (Moral Machine). 3 casos exactos, luego genera reporte.

FLUJO OBLIGATORIO:
1) PRESENTA: escenario breve + 3 opciones A), B), C) + pregunta
2) ESTUDIANTE RESPONDE con opción + razonamiento
3) TÚ RESPONDES: opción más sólida éticamente + por qué + retroalimentación constructiva + sugerencia

IMPORTANTE:
- NUNCA rechaces una respuesta por corta que sea. SIEMPRE da feedback.
- Cada caso debe ser DIFERENTE y ÚNICO. Usa el nombre del estudiante como semilla creativa para variar los escenarios.
- Varía MUCHO los dilemas: peatones vs pasajeros, ancianos vs niños, reglas de tráfico, sensores fallando, clima adverso, responsabilidad del fabricante vs programador vs regulador, animales en la vía, decisiones con incertidumbre, fallas mecánicas.
- NUNCA repitas el mismo tipo de dilema entre los 3 casos.

CASO 3: después de tu retroalimentación, genera EXACTAMENTE:

===REPORTE===
Nombre: [nombre]
Matricula: [matricula]

CASO 1
Opcion: [A/B/C]
Razonamiento del estudiante: "[cita textual]"
Evaluacion: [2-3 lineas]

CASO 2
Opcion: [A/B/C]
Razonamiento del estudiante: "[cita textual]"
Evaluacion: [2-3 lineas]

CASO 3
Opcion: [A/B/C]
Razonamiento del estudiante: "[cita textual]"
Evaluacion: [3-4 lineas]

SEG0404 - Compromiso ciudadano para la transformacion social:
[Parrafo 3-4 lineas evaluando desempeño general]

RECOMENDACIONES:
1. [accion concreta]
2. [accion concreta]
3. [accion concreta]
===FIN===

REGLAS: casos breves, sin gore, siempre A B C, acepta todas las respuestas, tono amable.
Al inicio: confirma nombre/matricula y presenta Caso 1 de inmediato.`;

app.post("/chat", async (req, res) => {
  try {
    if (!ANTHROPIC_KEY) {
      return res.status(500).json({ error: { message: "API key not configured" } });
    }

    const { messages } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-8) // Keep only last 8 messages for context
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "moral-machine-api" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Moral Machine API server running on port ${PORT}`);
});
// Redeploy trigger - Thu May 28 10:26:49 CST 2026
