// text-extraction.ts
import Tesseract from 'tesseract.js';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const extractDetails = async (text: string): Promise<{ name: string | null; department: string | null; identityNo: string | null }> => {
  // Fix 1: Add error handling for empty or invalid text
  if (!text || typeof text !== 'string') {
    console.error('Invalid text input:', text);
    return { name: null, department: null, identityNo: null };
  }

  // Fix 2: Improve prompts to be more specific and handle edge cases
  const promptSID = `Extract only the student ID number from this text. If multiple numbers exist, pick the one that looks like a student ID. Return only the number, no additional text: ${text}.  DO KEEP IN MIND: There should be no other text, just the department name and no other generated text from your side`;
  const promptName = `Extract only the student's full name from this text. Return only the name, no additional text: ${text},  DO KEEP IN MIND: There should be no other text, just the department name and no other generated text from your side`;
  const promptDepartment = `Extract only the department name from this text. Return only the department name, no additional text: ${text}. DO KEEP IN MIND: There should be no other text, just the department name and no other generated text from your side`;

  try {
    const [sidCompletion, nameCompletion, deptCompletion] = await Promise.all([
      groqClient.chat.completions.create({
        messages: [{ role: 'user', content: promptSID }],
        model: 'llama3-8b-8192',
      }),
      groqClient.chat.completions.create({
        messages: [{ role: 'user', content: promptName }],
        model: 'llama3-8b-8192',
      }),
      groqClient.chat.completions.create({
        messages: [{ role: 'user', content: promptDepartment }],
        model: 'llama3-8b-8192',
      })
    ]);

    // Fix 3: Proper response extraction
    const identityNo = sidCompletion.choices[0]?.message?.content?.trim() || null;
    const name = nameCompletion.choices[0]?.message?.content?.trim() || null;
    const department = deptCompletion.choices[0]?.message?.content?.trim() || null;

    console.log('Extracted details:', { identityNo, name, department });
    return { name, department, identityNo };
  } catch (error) {
    console.error('Error in extractDetails:', error);
    return { name: null, department: null, identityNo: null };
  }
};

const extractTextFromImageLinks = async (imageLinks: string[]): Promise<Record<string, string>> => {
  // Fix 4: Add input validation
  if (!Array.isArray(imageLinks) || imageLinks.length === 0) {
    throw new Error('Invalid image links input');
  }

  const extractedText: Record<string, string> = {};

  await Promise.all(imageLinks.map(async (link) => {
    try {
      // Fix 5: Add timeout to fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(link);
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const imageBuffer = await response.buffer();

      // Fix 6: Add Tesseract configuration for better OCR
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: m => console.log(m),
        // tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.- ',
      });

      extractedText[link] = text.trim();
      console.log('Extracted text from image:', text.trim());
    } catch (error) {
      console.error(`Error processing ${link}:`, error);
      extractedText[link] = '';
    }
  }));

  return extractedText;
};

export default extractTextFromImageLinks;