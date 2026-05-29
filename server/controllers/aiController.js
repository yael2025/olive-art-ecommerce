const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateProductDescription = async (req, res) => {
  try {
    const { name, category } = req.body;

    const prompt = `
        You are writing a product description for a handmade Judaica ecommerce website.

        Product name: ${name}
        Category: ${category}

        Detect the language of the product name and category.
        Write the product description in the same language.

        Rules:
        - If the input is Hebrew, write the description in Hebrew.
        - If the input is English, write the description in English.
        - Do not mention that you detected the language.
        - Write 3-5 sentences.
        - Use a warm, elegant, artistic style.
        - Make it suitable for an ecommerce product page.`

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    res.json({
      description: response.output_text,
    });
  } catch (error) {
    console.error("AI generation error:", error.message);
    res.status(500).json({ message: "Failed to generate description" });
  }
};

module.exports = {
  generateProductDescription,
};