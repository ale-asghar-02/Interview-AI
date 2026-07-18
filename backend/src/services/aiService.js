const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const logger = require('../utils/logger');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const interviewReportSchema = z.object({
  jobTitle: z.string().describe("Title of the job the candidate is applying for"),
  matchScore: z.number().describe("Score between 0-100 how well candidate matches the job"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("Technical question for the interview"),
    intention: z.string().describe("Why interviewer asks this question"),
    answer: z.string().describe("How to answer, what points to cover")
  })).describe("Technical questions with intention and answers"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("Behavioral question for the interview"),
    intention: z.string().describe("Why interviewer asks this question"),
    answer: z.string().describe("How to answer, what points to cover")
  })).describe("Behavioral questions with intention and answers"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("Skill the candidate is lacking"),
    severity: z.enum(["low", "medium", "high"]).describe("Importance of this skill gap")
  })).describe("Skill gaps in candidate's profile"),
  preparationPlan: z.array(z.object({
    day: z.number().describe("Day number starting from 1"),
    focus: z.string().describe("Main focus of this day"),
    tasks: z.array(z.string()).describe("Tasks to do on this day")
  })).describe("Day-wise preparation plan"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  
  const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: z.toJSONSchema(interviewReportSchema),
      },
    });

    const parsed = JSON.parse(response.text);

    // ✅ Zod se validate karo — AI ne galat response diya toh catch ho
    const validated = interviewReportSchema.parse(parsed);

    logger.info('Interview report generated successfully');
    return validated;

  } catch (err) {
    // ✅ JSON parse fail
    if (err instanceof SyntaxError) {
      logger.error(`AI Response Parse Error: ${err.message}`);
      throw new Error('AI returned invalid response, please try again');
    }

    // ✅ Zod validation fail
    if (err.name === 'ZodError') {
      logger.error(`AI Response Validation Error: ${JSON.stringify(err.errors)}`);
      throw new Error('AI response format was incorrect, please try again');
    }

    // ✅ Gemini API errors
    logger.error(`Gemini Interview Report Error: ${err.message}`);
    throw err; // errorHandler handle karega
  }
}

async function generatePdfFromHtml(htmlContent) {
  if (!htmlContent) {
    throw new Error('HTML content is required to generate PDF');
  }

  try {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = (await import('puppeteer-core')).default;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm', border: 'none' },
    });

    await browser.close();

    logger.info('PDF generated successfully');
    return pdfBuffer;

  } catch (err) {
    logger.error(`PDF Generation Error: ${err.message}`);
    throw new Error('Failed to generate PDF, please try again');
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  const resumePdfSchema = z.object({
    html: z.string().describe('The HTML content of the resume'),
  });

  // ✅ UPDATED PROMPT — Clean, flat, shadow-free design
  const prompt = `Generate a professional resume in HTML format for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    STRICT DESIGN RULES — follow these exactly:
    - Use a completely FLAT design. NO shadows, NO box-shadows, NO drop-shadows anywhere.
    - NO card-style layouts, NO rounded containers with backgrounds, NO elevated boxes.
    - White background (#ffffff) for the entire page. No grey or colored background blocks.
    - Section headings should be bold, uppercase, with a colored underline only (e.g., border-bottom: 1px solid #2c5f8a).
    - All content in clean sans-serif font (Arial or Helvetica).
    - Font sizes: Name 22px, section headings 17px, body text 14px.
    - Bullet points should use simple dashes (-) or default list-style, no custom icons.
    - No colored background on any section or element. All text on white.
    - No borders around sections — only the horizontal rule lines between them.
    - Margins: page padding 10mm top/bottom, 10mm left/right.
    - The resume should be ATS-friendly, concise, 1-2 pages when printed to A4 PDF.
    - Content should NOT sound AI-generated. Write naturally and professionally.
    - Tailor the resume content to match the given job description.

    Return a JSON object with a single field "html" containing the complete HTML string ready for Puppeteer PDF generation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: z.toJSONSchema(resumePdfSchema),
      },
    });

    const jsonContent = JSON.parse(response.text);

    // ✅ Zod validate
    const validated = resumePdfSchema.parse(jsonContent);

    logger.info('Resume HTML generated successfully');
    return await generatePdfFromHtml(validated.html);

  } catch (err) {
    // ✅ JSON parse fail
    if (err instanceof SyntaxError) {
      logger.error(`Resume Parse Error: ${err.message}`);
      throw new Error('AI returned invalid response, please try again');
    }

    // ✅ Zod validation fail
    if (err.name === 'ZodError') {
      logger.error(`Resume Validation Error: ${JSON.stringify(err.errors)}`);
      throw new Error('AI response format was incorrect, please try again');
    }

    logger.error(`Gemini Resume Error: ${err.message}`);
    throw err;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };