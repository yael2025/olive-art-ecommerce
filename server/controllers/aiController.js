const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateProductDescription = async (req, res) => {
  try {
    const { name, category } = req.body;

    const prompt = `
Write a short and elegant product description for a handmade Judaica product.

Product name: ${name}
Category: ${category}

The style should be warm, artistic, and suitable for an ecommerce website.
`;

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