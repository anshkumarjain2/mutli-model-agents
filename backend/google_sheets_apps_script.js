/**
 * GOOGLE APPS SCRIPT FOR AI ENTERPRISE CRM SYNC
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. In row 1, set these column headers:
 *    A1: Timestamp | B1: Event | C1: Lead ID | D1: Name | E1: Company | F1: Title | G1: Email | H1: Revenue | I1: Deal Value | J1: Tech Stack | K1: Score | L1: Tier | M1: Status | N1: Notes
 * 3. Click Extensions > Apps Script
 * 4. Paste this code and click "Deploy" > "New Deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: "Me", Who has access: "Anyone"
 * 7. Copy the Web app URL and paste it as GOOGLE_SHEETS_WEBHOOK_URL in your backend/.env
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.event || "CRM_UPDATE",
      data.lead_id || "",
      data.name || "",
      data.company || "",
      data.title || "",
      data.email || "",
      data.annual_revenue || "",
      data.deal_value || 0,
      data.tech_stack || "",
      data.qualification_score || 0,
      data.qualification_tier || "",
      data.status || "",
      data.qualification_notes || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      lead_id: data.lead_id,
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Synthetix AI Google Sheets CRM Gateway"
  })).setMimeType(ContentService.MimeType.JSON);
}
