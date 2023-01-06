import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({ message: "Hello from DALL-E!" });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log("prompt", prompt);
    const result = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const url = result.data.data[0].url;
    console.log("url", url);
    res.status(200).send({ url });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
