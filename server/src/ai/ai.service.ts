import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      console.error('GOOGLE_API_KEY is not defined in environment variables');
    } else {
      console.log(
        `GOOGLE_API_KEY loaded successfully (length: ${apiKey.length})`,
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'dummy_key');
  }

  async getClothingTicker(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const base64Image = buffer.toString('base64');

      const prompt =
        'You are an expert at identifying clothing items for Google Image Search. Analyze this photo (which may be a clothing tag or the clothing itself). Your goal is to generate the best possible Google Search query to find this exact item.\n\nPriority 1: If you see any specific model numbers, article numbers, style codes, reference IDs, or barcode numbers on the tag, return: "[Brand] [ArticleNumber]".\n\nPriority 2: If no specific article numbers are visible, extract the brand, color, and specific style/fit of the clothing. Return: "[Brand] [Color] [Style/Type]" (e.g., "Nike Red Zip-Up Hoodie", "Zara Black V-Neck T-Shirt").\n\nRULES:\n1. Return ONLY the search query string. Do not use quotes.\n2. Do NOT include generic irrelevant words like "gym", "left", "right", "photo", "tag".\n3. The query MUST be highly specific to finding this clothing item in a Google Search.';

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Image,
                  mimeType,
                },
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0,
        },
      });
      console.log('result23', result);
      const ticker = result.response.text().trim();
      console.log('ticker23', ticker);
      if (ticker === 'NOT_FOUND' || ticker.includes('NOT_FOUND')) {
        return '';
      }

      return ticker;
    } catch (error: unknown) {
      console.log('Gemini API Error details:', error);
      console.error('Gemini API Error details:', error);
      return '';
    }
  }
}
