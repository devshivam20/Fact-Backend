import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { extractText } from "./Services/PdfReader.js";
import { extractClaims } from "./Services/ExtractClaims.js";
import { verifyClaim } from "./Services/Verifier.js";

dotenv.config();

const app = express();

const upload = multer();
const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
  storage: memoryStorage,
});

app.use(cors());

app.use(express.json());

app.post("/factcheck", memoryUpload.single("pdf"), async (req, res) => {
  try {
    console.log("PDF received:", req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const text = await extractText(req.file.buffer);
/*     console.log("Extracted text:");
    console.log(text); */
    const claims = await extractClaims(text);
  /*   console.log("Claims:");
    console.log(claims); */
    const results = await Promise.all(
      claims.map(async (claim) => {
        const verification = await verifyClaim(claim);

        return {
          claim,
          ...verification,
        };
      }),
    );

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
