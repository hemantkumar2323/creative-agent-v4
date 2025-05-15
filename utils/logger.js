=== utils/logger.js ===
```javascript
const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new DailyRotateFile({
      filename: 'logs/creative-agent-%DATE%.log', // Changed filename
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
    new winston.transports.Console({ level: 'debug' }),
  ],
});

function logToFile(file, msg) {
  logger.info({ message: msg, file: file });
}

function logJSON(file, data) {
  logger.info({ message: 'JSON data', file: file, data: data });
}

module.exports = { logToFile, logJSON, logger };
