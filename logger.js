const jsonfile = require('jsonfile');

function writeToLogFile(userId, actions, date, action) {
  const logFilePath = './data/user_log.json';

  const logEntry = {
    userId: userId,
    action: action,
    actionCount: actions,
    date: date.toISOString()
  };

  let existingData = {};
  try {
    existingData = jsonfile.readFileSync(logFilePath);
  } catch (err) {
    console.error('Error reading log file:', err);
    console.log('Log file does not exist. Creating new file...');
  }

  const today = new Date().toISOString().split('T')[0];

  if (existingData[today]) {
    existingData[today].push(logEntry);
  } else {
    existingData[today] = [logEntry];
  }
  try {
    jsonfile.writeFileSync(logFilePath, existingData);
    console.log('Log data written to log file successfully.');
  } catch (error) {
    console.error('Error writing log data to file:', error);
  }
}

module.exports = writeToLogFile;
