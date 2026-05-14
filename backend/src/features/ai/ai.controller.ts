import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import { AppError } from '../../middlewares/errorMiddleware.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      throw new AppError('Prompt is required', 400);
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content creator. Generate a highly engaging title and a comprehensive, well-structured content body based on the given prompt. Return ONLY a valid JSON object in the exact format: {"title": "The Title", "content": "The content body formatted in paragraphs. You can use markdown."}'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const resultStr = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(resultStr);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Groq AI Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content'
    });
  }
};
