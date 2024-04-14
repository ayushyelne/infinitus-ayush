const OpenAI = require("openai").default;
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5001;
const fs = require("fs");
const pdf = require("pdf-parse");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

function readPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  return pdf(dataBuffer);
}

readPDF("./assignment.pdf")
  .then((data) => console.log(data.text))
  .catch((error) => console.error("Error reading PDF:", error));

let pdfText = "";
readPDF("./assignment.pdf").then((data) => (pdfText = data.text));

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

async function queryLLM(question, pdfText) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. You would be getting information from a pdf, be consistant with the content provided. pdf content: ${pdfText}`,
      },
      { role: "user", content: `Answer form the pdf content: ${question}` },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log("user:", question, "system:", completion.choices[0]);
  return completion.choices[0].message.content;
}

app.post("/api/question", async (req, res) => {
  console.log("Received question:", req.body.question);
  if (!req.body.question || typeof req.body.question !== "string") {
    return res.status(400).send({
      error: "No question provided or question is not a valid string",
    });
  }

  try {
    const answer = await queryLLM(req.body.question, pdfText);
    console.log("Sending answer:", answer);
    res.send({ answer });
  } catch (error) {
    console.error("Error querying LLM:", error);
    res.status(500).send({ error: "Failed to get response from LLM" });
  }
});

app.use(express.static("React/build"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
