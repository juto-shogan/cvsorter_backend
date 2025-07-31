// src/services/fileProcessor.js
import fs from 'fs';
import { PdfReader } from 'pdfreader'; // For PDF text extraction
import mammoth from 'mammoth';       // For DOCX text extraction - make sure you've installed it!

class FileProcessor {
  /**
   * Extracts text content from a given file path based on its MIME type.
   * @param {string} filePath - The full path to the file.
   * @param {string} mimetype - The MIME type of the file.
   * @returns {Promise<string>} A promise that resolves with the extracted text.
   * @throws {Error} If the file type is unsupported for text extraction.
   */
  async extractText(filePath, mimetype) {
    if (mimetype === 'application/pdf') {
      return this.extractTextFromPdf(filePath);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractTextFromDocx(filePath);
    } else if (mimetype === 'text/plain') {
      return fs.promises.readFile(filePath, 'utf8');
    } else {
      throw new Error(`Unsupported file type for text extraction: ${mimetype}`);
    }
  }

  /**
   * Helper method to extract text from a PDF file.
   * @param {string} filePath - The path to the PDF file.
   * @returns {Promise<string>} A promise that resolves with the extracted text.
   */
  async extractTextFromPdf(filePath) {
    return new Promise((resolve, reject) => {
      let text = '';
      new PdfReader().parseFileItems(filePath, (err, item) => {
        if (err) {
          return reject(err);
        } else if (!item) {
          // End of file
          return resolve(text);
        } else if (item.text) {
          // Concatenate text from each item
          text += item.text + ' ';
        }
      });
    });
  }

  /**
   * Helper method to extract text from a DOCX file using 'mammoth'.
   * @param {string} filePath - The path to the DOCX file.
   * @returns {Promise<string>} A promise that resolves with the extracted text.
   * @throws {Error} If text extraction from DOCX fails.
   */
  async extractTextFromDocx(filePath) {
    try {
      // mammoth.extractRawText returns a promise that resolves to an object with a 'value' property
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value; // The extracted text is in the 'value' property
    } catch (error) {
      console.error('Error extracting text from DOCX using mammoth:', error);
      throw new Error(`Failed to extract text from DOCX file: ${error.message}`);
    }
  }

  /**
   * Deletes a file from the file system.
   * @param {string} filePath - The full path to the file to be deleted.
   * @returns {Promise<void>} A promise that resolves when the file is deleted or if it doesn't exist.
   */
  async deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.warn(`File not found, cannot delete: ${filePath}`);
    }
  }

  // You can add more file-related utility methods here if needed.
}

export default new FileProcessor();