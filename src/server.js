const express = require('express');
const routes = require('./routes');
var cors = require('cors')

require('./database')

const app = express();
app.use(cors())
app.use(express.json())
app.use(routes)

const port = process.env.PORT || '3333';

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});