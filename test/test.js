import OpenAI from "openai";

const openai = new OpenAI();

const name = "Hao Wu";
const gender = "Male";
const astrologicalSign = "Gemini";
const dateToday = "2024/06/23(yyyy/mm/dd)";
const card = "The Fool";
const position = "reverse";
const question = "How I am doing today?"

export async function callGpt() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
            content: "You are a professional Tarot Reader." +
                "Your mission is to use information from the user's to give them insights, guidance, and understanding through the tarot reading process. " +
                "Your role involves interpreting the cards with intuition and expertise to provide meaningful advice and support.",
      },
          { role: "user", content: `name: ${name}\ngender: ${gender}\n astrologicalSign: ${astrologicalSign}\ndateToday: ${dateToday}\ncard: ${card}\nposition: ${position}\nquestion: ${question}`,},
      ],
    temperature: 0.8,
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0]);
}

callGpt();