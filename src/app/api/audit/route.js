import { NextResponse } from 'next/server';
import { parseChat } from '../../../utils/parser';
import { analyzeChat, analyzeCrossStudentPatterns } from '../../../utils/analyzer';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('chats');
    const apiKey = request.headers.get('x-api-key') || formData.get('apiKey') || process.env.GEMINI_API_KEY;
    const model = request.headers.get('x-model') || formData.get('model') || 'gemini-3.6-flash';

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API Key is missing. Provide x-api-key header or local variable.' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No chat files uploaded.' },
        { status: 400 }
      );
    }

    const individualReports = [];

    // Process each chat file sequentially
    for (const file of files) {
      const fileName = file.name;
      const chatText = await file.text();
      
      const parsedMessages = parseChat(chatText);

      if (parsedMessages.length === 0) {
        individualReports.push({
          fileName,
          studentName: fileName.replace(/\.txt$/i, ''),
          error: 'No messages could be parsed from this file.'
        });
        continue;
      }

      try {
        const auditReport = await analyzeChat(parsedMessages, apiKey, model);
        individualReports.push({
          fileName,
          studentName: fileName.replace(/\.txt$/i, ''),
          messageCount: parsedMessages.length,
          messages: parsedMessages,
          ...auditReport
        });
      } catch (err) {
        console.error(`Error auditing ${fileName}:`, err);
        individualReports.push({
          fileName,
          studentName: fileName.replace(/\.txt$/i, ''),
          error: err.message
        });
      }
    }

    // Process cross-student patterns if we have multiple valid audits
    let crossStudentPatterns = null;
    const successfulReports = individualReports.filter(r => !r.error);

    if (successfulReports.length > 1) {
      try {
        // Strip out heavy messages to keep request payload thin
        const reportsForCross = successfulReports.map(r => {
          const { messages, ...rest } = r;
          return rest;
        });
        crossStudentPatterns = await analyzeCrossStudentPatterns(reportsForCross, apiKey, model);
      } catch (err) {
        console.error('Error in cross-student patterns:', err);
        crossStudentPatterns = {
          error: 'Could not complete cross-student patterns analysis.'
        };
      }
    }

    return NextResponse.json({
      success: true,
      individualReports,
      crossStudentPatterns
    });

  } catch (error) {
    console.error('Server error during audit:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
