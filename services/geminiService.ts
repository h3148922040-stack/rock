
import { GoogleGenAI } from "@google/genai";

export const askClockQuestion = async (question: string) => {
  try {
    // Fix: Initialize GoogleGenAI with process.env.API_KEY directly as per mandatory guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: "你是一个温柔博学的钟表匠爷爷，专门给6-12岁的小朋友解释时钟的工作原理。你的语言要生动形象，多用比喻，比如把齿轮比作咬合的小牙齿，把发条比作蓄电池。回复要简短易懂。",
        temperature: 0.7,
      },
    });

    return response.text || "我还在想怎么解释，请稍后再问我吧！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "哎呀，我的‘大脑齿轮’卡住了，能再问一遍吗？";
  }
};
