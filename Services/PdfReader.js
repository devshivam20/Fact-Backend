import { PDFParse } from "pdf-parse";

export async function extractText(fileBuffer) {
  try {

    const parser = new PDFParse({
      data: fileBuffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;

  } catch(error) {

    console.log("PDF Read Error:", error);

    throw error;
  }
}