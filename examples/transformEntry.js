// transformEntry() can be used to format the log output
// and to filter the logged message

const logger = require('../index');
const app = require('express')();

logger.transformEntry = (func, entry) => {
  // suppress info logging, but keep access logs
  if (!entry.isAccessLog && func === console.info) {
    return;
  }

  // output logs as text instead of JSON
  let result = entry.processTime + ' ' + entry.message;

  // allow some custom "suffix" o be added with a coma
  if (entry.suffix) {
    result += ` , ${entry.suffix}`;
  }
  return result;
};

app.use(logger.initAccessLog());
app.get('/', (req, res) => {
  logger.error('errors are logged');
  logger.info('info - not logged');
  res.sendStatus(204);
});
app.listen(3000);

logger.applyLogFunction(console.warn, {
  processTime: (new Date()).toISOString(),
  message: 'call: curl http://localhost:3000/',
  suffix: 'please'
});
