
import { GoogleGenAI, Type } from "@google/genai";
import { MiniProgramProject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "小程序名称" },
    description: { type: Type.STRING, description: "小程序功能描述" },
    appConfig: { type: Type.STRING, description: "app.json 内容" },
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "文件名" },
          path: { type: Type.STRING, description: "相对路径 (如 pages/index/index.wxml)" },
          content: { type: Type.STRING, description: "代码内容" },
          description: { type: Type.STRING, description: "文件功能说明" },
          language: { type: Type.STRING, enum: ["javascript", "xml", "css", "json"], description: "语言类型" }
        },
        required: ["name", "path", "content", "language"]
      }
    }
  },
  required: ["title", "description", "files", "appConfig"]
};

export const generateMiniProgram = async (prompt: string): Promise<MiniProgramProject> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `你是一个资深的微信小程序专家。请根据以下需求生成一个完整的小程序工程。
    
    需求：${prompt}
    
    技术规范：
    1. 必须包含 app.json (全局配置), app.js, app.wxss。
    2. 主页面位于 pages/index/ 目录下。
    3. UI 必须符合微信原生视觉规范 (WeUI 风格)。
    4. 所有的 WXML 必须对应 WXSS。
    5. 代码注释必须清晰。
    6. language 字段请映射：wxml->xml, wxss->css, js->javascript。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: MP_SCHEMA,
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 5000 }
    },
  });

  const text = response.text;
  if (!text) throw new Error('AI Generation Error');
  return JSON.parse(text);
};
