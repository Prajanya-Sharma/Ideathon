import Tesseract from 'tesseract.js';
import fetch from 'node-fetch';

/**
 * Extracts details like Name, Department, and Identity No. from the text.
 *
 * @param {string} text - The input text to extract details from.
 * @returns {object} An object containing name, department, and identity number.
 */
export const extractDetails = (text: string): { name: string | null; department: string | null; identityNo: string | null } => {
  const nameMatch = text.match(/(Name|Namc):?\s*([A-Za-z]+(?:[ '-][A-Za-z]+)*)(?=\s*[-'\n$])/); 
  const identityMatch = text.match(/Identity No\.:\s*(\d+)/);
  const departmentMatch = text.match(/Department:\s*(.+)/);

  const name = nameMatch ? nameMatch[2].trim().replace(/\s+[A-Za-z]$/, '') : null;  // Removing trailing single letters like 'O'
  const identityNo = identityMatch ? identityMatch[1].trim() : null;
  const department = departmentMatch ? departmentMatch[1].trim() : null;

  console.log(`Name: ${name}`);
  console.log(nameMatch)
  console.log(`Identity No.: ${identityNo}`);

  return { name, department, identityNo };
};



/**
 * Extracts text from an array of image URLs.
 *
 * @param {string[]} imageLinks - An array of image URLs.
 * @returns {Promise<Record<string, string>>} A promise resolving to a dictionary mapping file names to extracted text.
 */
const extractTextFromImageLinks = async (imageLinks: string[]): Promise<Record<string, string>> => {
  const extractedText: Record<string, string> = {};

  // Process each image link asynchronously
  await Promise.all(imageLinks.map(async (link) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      console.log('here');
      
      const imageBuffer = await response.buffer();
      
      // Use Tesseract.js to recognize text
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');

      // Map the extracted text to the image link
      extractedText[link] = text;
      console.log(extractedText);
      
    } catch (error) {
      console.error(`Error processing ${link}:`, error);
    }
  }));  
  return extractedText;
};

// Example usage
export default extractTextFromImageLinks;
