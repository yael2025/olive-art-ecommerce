const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const translateProductToHebrew = async ({
  name,
  description,
  category,
}) => {
  const prompt = `
Translate the following ecommerce product data from English to Hebrew.

Rules:
- Return valid JSON only.
- Do not add markdown.
- Keep the meaning natural and suitable for an ecommerce website.
- Product names should sound natural in Hebrew.
- Preserve Judaica terminology accurately.
- Do not translate brand names if they should remain unchanged.

Input:
{
  "name": "${name || ""}",
  "description": "${description || ""}",
  "category": "${category || ""}"
}

Return exactly this structure:
{
  "nameHe": "",
  "descriptionHe": "",
  "categoryHe": ""
}
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const translated = JSON.parse(response.output_text);

  return {
    nameHe: translated.nameHe || "",
    descriptionHe: translated.descriptionHe || "",
    categoryHe: translated.categoryHe || "",
  };
};

module.exports = {
  translateProductToHebrew,
};