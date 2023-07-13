import express from "express";
import * as dotenv from "dotenv";

import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

router.route("/").get((req, res) => {
  res.status(200).send({ message: "Hello from DALL-E ROUTES" });
});
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("first");
    console.log(prompt);
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    console.log("second");
    const image = response.data.data[0].b64_json;
    console.log(image, "image");
    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "something went wrong in creating image",
      error: error.message,
    });
  }
});
export default router;
