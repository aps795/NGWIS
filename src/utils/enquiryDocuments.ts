import type { AdmissionEnquiry } from '../types/school';

const SCHOOL_NAME = 'New Global Wisdom International School';
const SCHOOL_ADDRESS = 'Bhujehuan, Sauna, Saidpur, Ghazipur, Uttar Pradesh – 233307';
const SCHOOL_CONTACT = 'Phone: +91 9616861239, +91 7081081119 | Email: info@newglobalwisdom.edu.in';

/**
 * Generates and prints an official single Enquiry Slip as PDF
 */
export function printEnquiryPDF(enquiry: AdmissionEnquiry, customSchoolName?: string) {
  const schoolTitle = customSchoolName || SCHOOL_NAME;
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert('Please allow popups for this site to print or save the PDF.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enquiry_${enquiry.id}_${enquiry.studentName}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.5;
    }
    .slip-container {
      border: 2px solid #0f172a;
      border-radius: 8px;
      padding: 24px;
      position: relative;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #b45309;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .header .tagline {
      margin: 4px 0 0;
      font-size: 11px;
      color: #b45309;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .header .address {
      margin: 4px 0 0;
      font-size: 11px;
      color: #475569;
    }
    .header .contact {
      margin: 3px 0 0;
      font-size: 10.5px;
      color: #64748b;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 20px;
    }
    .badge-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-ref {
      font-family: monospace;
      font-weight: 700;
      font-size: 13px;
      background: #0f172a;
      color: #fef08a;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .status-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .details-table th, .details-table td {
      border: 1px solid #cbd5e1;
      padding: 9px 12px;
      text-align: left;
    }
    .details-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 600;
      width: 25%;
      font-size: 12px;
    }
    .details-table td {
      color: #0f172a;
      font-size: 13px;
    }
    .query-box {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-left: 4px solid #b45309;
      border-radius: 6px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .query-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #b45309;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .query-text {
      font-size: 13px;
      color: #1c1917;
      line-height: 1.6;
      white-space: pre-wrap;
      margin: 0;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      padding-top: 15px;
    }
    .signature-block {
      text-align: center;
      width: 200px;
    }
    .signature-line {
      border-top: 1px solid #64748b;
      margin-bottom: 6px;
    }
    .signature-label {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }
    .print-actions {
      margin-bottom: 16px;
      text-align: right;
    }
    .btn-print {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 12px;
    }
    @media print {
      .print-actions {
        display: none !important;
      }
      .slip-container {
        border: 1.5px solid #000000;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="slip-container">
    <div class="header">
      <h1>${schoolTitle}</h1>
      <div class="tagline">Official Admissions &amp; Administrative Desk</div>
      <div class="address">${SCHOOL_ADDRESS}</div>
      <div class="contact">${SCHOOL_CONTACT}</div>
    </div>

    <div class="badge-bar">
      <div class="badge-title">Official Admission Enquiry Form</div>
      <div>
        <span class="badge-ref">Ref: ${enquiry.id}</span>
        <span class="status-badge" style="margin-left: 8px;">${enquiry.status}</span>
      </div>
    </div>

    <table class="details-table">
      <tr>
        <th>Student Full Name</th>
        <td><strong>${enquiry.studentName}</strong></td>
        <th>Class Applying</th>
        <td><strong>${enquiry.classApplying}</strong></td>
      </tr>
      <tr>
        <th>Parent / Guardian</th>
        <td>${enquiry.parentName}</td>
        <th>Contact Mobile</th>
        <td><strong>${enquiry.mobile}</strong></td>
      </tr>
      <tr>
        <th>Email Address</th>
        <td>${enquiry.email || 'Not provided'}</td>
        <th>Submitted Date/Time</th>
        <td>${enquiry.submittedAt}</td>
      </tr>
      <tr>
        <th>Village / Address</th>
        <td colspan="3">${enquiry.address || 'Not provided'}</td>
      </tr>
      ${enquiry.adminNotes ? `
      <tr>
        <th>Administrative Notes</th>
        <td colspan="3" style="color: #475569; font-style: italic;">${enquiry.adminNotes}</td>
      </tr>` : ''}
    </table>

    <div class="query-box">
      <div class="query-title">Parent / Guardian Message &amp; Query Details:</div>
      <p class="query-text">${enquiry.message ? enquiry.message : 'General Admission Enquiry (No additional query message specified by parent).'}</p>
    </div>

    <div class="footer-signatures">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">Parent / Guardian Signature</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">Admissions Officer / Verified By</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `.trim();

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Downloads an official single Enquiry Slip as a Microsoft Word Document (.doc)
 */
export function downloadEnquiryDoc(enquiry: AdmissionEnquiry, customSchoolName?: string) {
  const schoolTitle = customSchoolName || SCHOOL_NAME;

  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>NGWIS_Enquiry_${enquiry.id}</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 30px;
      color: #0f172a;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #b45309;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 20pt;
      color: #0f172a;
      text-transform: uppercase;
    }
    .header p {
      margin: 3px 0 0;
      font-size: 9.5pt;
      color: #475569;
    }
    .title-strip {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 12px;
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    th, td {
      border: 1px solid #94a3b8;
      padding: 8px 10px;
      font-size: 10pt;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      width: 25%;
    }
    .query-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 12px 14px;
      margin-bottom: 25px;
    }
    .query-heading {
      font-weight: bold;
      color: #b45309;
      font-size: 10pt;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .signatures {
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${schoolTitle}</h1>
    <p><strong>Official Admissions &amp; Administrative Desk</strong></p>
    <p>${SCHOOL_ADDRESS}</p>
    <p>${SCHOOL_CONTACT}</p>
  </div>

  <div class="title-strip">
    ADMISSION ENQUIRY RECORD — Ref ID: ${enquiry.id} [Status: ${enquiry.status}]
  </div>

  <table>
    <tr>
      <th>Student Full Name</th>
      <td><strong>${enquiry.studentName}</strong></td>
      <th>Class Applying</th>
      <td><strong>${enquiry.classApplying}</strong></td>
    </tr>
    <tr>
      <th>Parent / Guardian</th>
      <td>${enquiry.parentName}</td>
      <th>Contact Mobile</th>
      <td><strong>${enquiry.mobile}</strong></td>
    </tr>
    <tr>
      <th>Email Address</th>
      <td>${enquiry.email || 'Not provided'}</td>
      <th>Submitted At</th>
      <td>${enquiry.submittedAt}</td>
    </tr>
    <tr>
      <th>Locality / Address</th>
      <td colspan="3">${enquiry.address || 'Not provided'}</td>
    </tr>
    ${enquiry.adminNotes ? `
    <tr>
      <th>Administrative Notes</th>
      <td colspan="3">${enquiry.adminNotes}</td>
    </tr>` : ''}
  </table>

  <div class="query-card">
    <div class="query-heading">Parent Query &amp; Specific Remarks:</div>
    <p style="margin: 0; font-size: 10.5pt; line-height: 1.5;">${enquiry.message ? enquiry.message : 'General Admission Enquiry (No additional query message specified by parent).'}</p>
  </div>

  <table class="signatures" style="border: none;">
    <tr style="border: none;">
      <td style="border: none; width: 50%; text-align: left; padding-top: 40px;">
        __________________________________<br>
        <strong>Parent / Guardian Signature</strong>
      </td>
      <td style="border: none; width: 50%; text-align: right; padding-top: 40px;">
        __________________________________<br>
        <strong>Authorized Admissions Officer</strong>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${enquiry.id}_${enquiry.studentName.replace(/\s+/g, '_')}_Enquiry.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and prints an official multi-record Admissions Enquiries Report as PDF
 */
export function printEnquiriesReportPDF(enquiries: AdmissionEnquiry[], filterStatus = 'All', customSchoolName?: string) {
  const schoolTitle = customSchoolName || SCHOOL_NAME;
  const printWindow = window.open('', '_blank', 'width=1050,height=950');
  if (!printWindow) {
    alert('Please allow popups for this site to print or save the PDF.');
    return;
  }

  const rows = enquiries.map((e, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-family: monospace; font-weight: bold;">${e.id}</td>
      <td><strong>${e.studentName}</strong></td>
      <td>${e.parentName}</td>
      <td><span style="font-weight: 600;">${e.classApplying}</span></td>
      <td>${e.mobile}</td>
      <td style="font-size: 10px; color: #475569;">${e.submittedAt}</td>
      <td><span class="status-tag">${e.status}</span></td>
      <td style="font-size: 11px; max-width: 220px; word-break: break-word;">${e.message || '<em style="color:#94a3b8">None</em>'}</td>
    </tr>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NGWIS_Admissions_Enquiries_Report</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #b45309;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header h1 {
      margin: 0;
      font-size: 18px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .header p {
      margin: 3px 0 0;
      font-size: 10px;
      color: #64748b;
    }
    .summary-strip {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 11px;
      background: #f8fafc;
      padding: 6px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 10.5px;
      text-transform: uppercase;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .status-tag {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9.5px;
      font-weight: 700;
      background: #e2e8f0;
    }
    .btn-print {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 11px;
      margin-bottom: 10px;
    }
    @media print {
      .btn-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">Print / Save Report as PDF</button>

  <div class="header">
    <h1>${schoolTitle}</h1>
    <p>Admissions Enquiries Master Ledger &bull; ${SCHOOL_ADDRESS}</p>
  </div>

  <div class="summary-strip">
    <span><strong>Filter:</strong> ${filterStatus} Enquiries</span>
    <span><strong>Total Records:</strong> ${enquiries.length}</span>
    <span><strong>Generated Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px; text-align: center;">#</th>
        <th style="width: 75px;">Ref ID</th>
        <th>Student Name</th>
        <th>Parent Name</th>
        <th>Class</th>
        <th>Mobile</th>
        <th>Date</th>
        <th>Status</th>
        <th>Query / Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `.trim();

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Downloads a multi-record Admissions Enquiries Report as a Microsoft Word Document (.doc)
 */
export function downloadEnquiriesReportDoc(enquiries: AdmissionEnquiry[], filterStatus = 'All', customSchoolName?: string) {
  const schoolTitle = customSchoolName || SCHOOL_NAME;

  const rows = enquiries.map((e, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-family: monospace;"><b>${e.id}</b></td>
      <td><b>${e.studentName}</b></td>
      <td>${e.parentName}</td>
      <td>${e.classApplying}</td>
      <td>${e.mobile}</td>
      <td>${e.email || '-'}</td>
      <td>${e.submittedAt}</td>
      <td><b>${e.status}</b></td>
      <td>${e.message || '-'}</td>
    </tr>
  `).join('');

  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>NGWIS_Admissions_Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #0f172a; }
    .header { text-align: center; margin-bottom: 15px; }
    .header h1 { margin: 0; font-size: 16pt; color: #0f172a; }
    .header p { margin: 2px 0; font-size: 9pt; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #94a3b8; padding: 6px 8px; font-size: 9pt; text-align: left; }
    th { background: #0f172a; color: #ffffff; font-weight: bold; }
    tr:nth-child(even) { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${schoolTitle}</h1>
    <p>Admissions Enquiries Master Report &bull; ${SCHOOL_ADDRESS}</p>
    <p>Filter: <b>${filterStatus}</b> | Total Enquiries: <b>${enquiries.length}</b> | Date: <b>${new Date().toLocaleDateString('en-IN')}</b></p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">#</th>
        <th>Ref ID</th>
        <th>Student Name</th>
        <th>Parent Name</th>
        <th>Class</th>
        <th>Mobile</th>
        <th>Email</th>
        <th>Submitted Date</th>
        <th>Status</th>
        <th>Query / Questions</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>
  `.trim();

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `NGWIS_Admissions_Report_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
