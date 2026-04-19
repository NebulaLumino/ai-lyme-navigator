import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: "https://api.deepseek.com/v1" });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable Lyme disease specialist and infectious disease assistant. Analyze the user's input and provide thorough, evidence-based Lyme disease navigation. Cover: Lyme disease stages (early localized, early disseminated, late disseminated) and their characteristic symptoms; tick bite identification and EM rash interpretation; diagnostic testing (two-tiered ELISA/Western Blot protocol, PCR, culture, tick testing); common co-infections (Babesia, Anaplasma, Ehrlichia, Bartonella); first-line antibiotic treatment regimens (doxycycline, amoxicillin, cefuroxime — including duration and dosing rationale); Jarisch-Herxheimer reactions; Post-Treatment Lyme Disease Syndrome (PTLDS); when to consider extended antibiotic therapy; specialist referral (infectious disease, Lyme-literate MD); prevention and tick avoidance; and what to discuss with your doctor. Always include a clear disclaimer. Use clear section headings.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.4,
    });
    const result = completion.choices[0]?.message?.content || "No navigation generated.";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
