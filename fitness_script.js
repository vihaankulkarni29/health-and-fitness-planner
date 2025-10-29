// Google Apps Script for Fitness Tracker
// Deploy this to: https://script.google.com/macros/s/AKfycbzYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY/exec

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Skip test data
    if (data.test) {
      return ContentService
        .createTextOutput('Connection Test Successful')
        .setMimeType(ContentService.MimeType.TEXT);
    }

    const ss = SpreadsheetApp.openById('1cF6KlQ76s9K9PPlsRDUYJR3FKJZ_N7b5Ik0hSJ2vjps');
    const sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Exercise Name',
        'Type',
        'Sets',
        'Reps',
        'Weight (kg)',
        'Volume (kg)',
        'Duration (s)',
        'Load (kg)',
        'Details',
        'Raw Data'
      ];
      sheet.appendRow(headers);
    }

    // Format timestamp
    const timestamp = new Date(data.timestamp).toLocaleString();

    // Prepare row data based on exercise type
    let rowData;
    if (data.type === 'time-load') {
      rowData = [
        timestamp,
        data.name || '',
        'Time & Load',
        '',
        '',
        '',
        '', // Volume
        data.duration || '',
        data.load || '',
        data.details || '',
        JSON.stringify(data)
      ];
    } else {
      // Weight & Reps
      rowData = [
        timestamp,
        data.name || '',
        'Weight & Reps',
        data.sets || '',
        data.reps || '',
        data.weight || '',
        data.volume || '',
        '',
        '',
        data.details || '',
        JSON.stringify(data)
      ];
    }

    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput('Success')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    console.error('Fitness Tracker Error:', error);
    return ContentService
      .createTextOutput('Error: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}