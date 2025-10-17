# Health & Fitness Planners

A comprehensive web-based tracking system consisting of two specialized planners: Health Tracker and Fitness Tracker. Both applications feature local storage, Google Sheets integration, and a modern, responsive design.

## Features

### Health Tracker
- **Sleep Tracking**: Log hours of sleep
- **Weight Monitoring**: Track body weight in kg
- **Blood Pressure**: Record systolic/diastolic readings
- **Heart Rate**: Monitor resting heart rate
- **Hydration**: Track water intake in ml
- **Nutrition**: Log calorie consumption
- **Mood Tracking**: Rate daily mood on a 1-10 scale

### Fitness Tracker
- **Exercise Logging**: Record various exercises with sets, reps, and weight
- **Time-based Activities**: Track duration and load for cardio/time-based exercises
- **Progress History**: View chronological workout history
- **Flexible Input**: Toggle between weight/reps and time/load modes

## Common Features
- **Local Storage**: Data persists between sessions
- **Google Sheets Integration**: Sync data to spreadsheets for analysis
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern UI with Tailwind CSS
- **Real-time Sync**: Batch sync all history to Google Sheets
- **Data Management**: Clear all data with confirmation

## Setup Instructions

### 1. Google Sheets Integration (Optional)

To enable Google Sheets syncing:

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Replace the default code with:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = ['Timestamp', 'Type', 'Details', 'Data'];
      sheet.appendRow(headers);
    }

    // Format timestamp
    const timestamp = new Date(data.timestamp).toLocaleString();

    // Prepare row data
    const rowData = [
      timestamp,
      data.metricType || data.type || 'Unknown',
      data.details || '',
      JSON.stringify(data)
    ];

    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput('Success')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService
      .createTextOutput('Error: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
```

4. Deploy the script as a web app:
   - Click "Deploy" > "New deployment"
   - Select type "Web app"
   - Execute as "Me", access "Anyone"
   - Copy the deployment URL

5. Update the `GOOGLE_SCRIPT_URL` in both HTML files with your deployment URL

### 2. Running the Applications

Simply open the HTML files in any modern web browser:
- `health/health_tracker.html` for health tracking
- `fitness/fitness_tracker.html` for fitness tracking

No server or additional setup required!

## Project Structure

```
Planner/
├── health/
│   └── health_tracker.html
├── fitness/
│   └── fitness_tracker.html
├── README.md
└── (other files)
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Tailwind CSS for styling
- **JavaScript (ES6+)**: Vanilla JS with modern features
- **Local Storage**: Client-side data persistence
- **Google Apps Script**: Serverless backend for Sheets integration
- **Fetch API**: Asynchronous data syncing

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- Local Storage API
- Fetch API
- CSS Grid/Flexbox

## Privacy & Data

- All data is stored locally in your browser
- Google Sheets integration only sends data when you explicitly sync
- No data is collected or transmitted without your consent
- You can clear all local data at any time

## Contributing

Feel free to fork and modify for your needs. The code is well-commented and modular for easy customization.

## License

This project is open source and available under the MIT License.