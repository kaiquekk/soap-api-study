const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const route = require('./routes/route.js');

app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/main', route);

const port = process.env.PORT || 4545;
app.listen(4545, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

module.exports = app;