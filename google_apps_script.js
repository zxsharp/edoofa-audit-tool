/**
 * Google Apps Script for Edoofa Conversational Audit Tool Integration
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click on "Extensions" -> "Apps Script".
 * 3. Delete any existing code and paste this script.
 * 4. Click the Save icon.
 * 5. Click "Deploy" -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Configure:
 *    - Description: Edoofa Audit Tool Sync
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (this allows the dashboard to post results)
 * 8. Click "Deploy", authorize permissions, and copy the generated Web App URL.
 * 9. Paste this URL into the "Google Sheets Sync URL" field on your Dashboard.
 */

function doPost(e) {
  // Handle CORS Preflight requests
  if (typeof e === 'undefined') {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No data received" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Set headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Student Name",
        "Message Count",
        "Overall Summary",
        "Category Code",
        "Severity",
        "Finding Title",
        "Rationale",
        "Supporting Quote"
      ]);
      
      // Style headers
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackgroundColor("#0f172a");
      headerRange.setFontColor("#f8fafc");
    }
    
    var timestamp = new Date();
    
    // If it's a multi-student log, we loop over individual reports
    var reports = payload.individualReports || [payload];
    
    reports.forEach(function(report) {
      if (report.findings && report.findings.length > 0) {
        report.findings.forEach(function(finding) {
          // Extract supporting quote text
          var quotesText = "";
          if (finding.messages && finding.messages.length > 0) {
            quotesText = finding.messages.map(function(m) {
              return "Line " + m.id + " (" + m.sender + "): \"" + m.text + "\"";
            }).join(" | ");
          }
          
          sheet.appendRow([
            timestamp,
            report.studentName || "Unknown Student",
            report.messageCount || 0,
            report.overallSummary || "",
            finding.category || "",
            finding.severity || "",
            finding.issue || finding.title || "",
            finding.rationale || "",
            quotesText
          ]);
        });
      } else {
        // Log clean transcripts (no violations)
        sheet.appendRow([
          timestamp,
          report.studentName || "Unknown Student",
          report.messageCount || 0,
          "Fully Compliant - No Violations Found",
          "N/A",
          "Clean",
          "None",
          "N/A",
          "N/A"
        ]);
      }
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", rowsAdded: sheet.getLastRow() - 1 }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeaders({
                           'Access-Control-Allow-Origin': '*',
                           'Access-Control-Allow-Methods': 'POST'
                         });
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeaders({
                           'Access-Control-Allow-Origin': '*',
                           'Access-Control-Allow-Methods': 'POST'
                         });
  }
}

// Handle CORS Preflight Options Request
function doOptions(e) {
  return ContentService.createTextOutput("")
                       .setMimeType(ContentService.MimeType.TEXT)
                       .setHeaders({
                         'Access-Control-Allow-Origin': '*',
                         'Access-Control-Allow-Methods': 'POST, OPTIONS',
                         'Access-Control-Allow-Headers': 'Content-Type',
                         'Access-Control-Max-Age': '86400'
                       });
}
