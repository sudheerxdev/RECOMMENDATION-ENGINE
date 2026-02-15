import pdfParse from 'pdf-parse';
import { uploadResumeBuffer } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { extractSkillsFromResumeText } from './llmService.js';

export const extractTextFromPdfBuffer = async (buffer) => {
  try {
    const parsed = await pdfParse(buffer);
    return parsed.text || '';
  } catch (error) {
    throw new ApiError(400, 'Failed to parse PDF resume');
  }
};

export const analyzeResume = async ({ fileBuffer, originalName }) => {
  const resumeText = await extractTextFromPdfBuffer(fileBuffer);
  const extractedSkills = await extractSkillsFromResumeText(resumeText);
  const uploadResult = await uploadResumeBuffer(fileBuffer, originalName);

  return {
    resumeText,
    extractedSkills,
    cloudinaryUrl: uploadResult?.secure_url || null,
    textLength: resumeText.length
  };
};
