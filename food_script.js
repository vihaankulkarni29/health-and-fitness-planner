// Google Apps Script for Food Tracker
// Deploy this to: https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById('1vdFqzoVsv3wb8M--91F4u-DqJnu_xPqd1MHxQ0IX414');
    const sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Type',
        'Food Item',
        'Quantity (g/ml)',
        'Calories',
        'Recipe Name',
        'Serving Size (g)',
        'Protein (g)',
        'Carbs (g)',
        'Fat (g)',
        'Fiber (g)',
        'Ingredients',
        'Details',
        'Raw Data'
      ];
      sheet.appendRow(headers);
    }

    // Format timestamp
    const timestamp = new Date(data.timestamp).toLocaleString();

    // Prepare row data based on entry type
    let rowData;
    if (data.metricType === 'recipe') {
      rowData = [
        timestamp,
        'Recipe',
        '',
        '',
        data.nutrition?.calories || '',
        data.recipeName || '',
        data.servingSize || '',
        data.nutrition?.protein || '',
        data.nutrition?.carbs || '',
        data.nutrition?.fat || '',
        data.nutrition?.fiber || '',
        JSON.stringify(data.ingredients || []),
        data.details || '',
        JSON.stringify(data)
      ];
    } else if (data.metricType === 'saved-recipe') {
      rowData = [
        timestamp,
        'Saved Recipe',
        '',
        '',
        data.nutrition?.calories || '',
        data.recipeName || '',
        data.servingSize || '',
        data.nutrition?.protein || '',
        data.nutrition?.carbs || '',
        data.nutrition?.fat || '',
        data.nutrition?.fiber || '',
        '',
        data.details || '',
        JSON.stringify(data)
      ];
    } else {
      // Simple food entry
      rowData = [
        timestamp,
        'Simple',
        data.foodItem || '',
        data.quantity || '',
        data.calories || '',
        '',
        '',
        '',
        '',
        '',
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
    console.error('Food Tracker Error:', error);
    return ContentService
      .createTextOutput('Error: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}