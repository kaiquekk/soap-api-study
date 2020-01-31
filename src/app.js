const soap = require('soap');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function mainRoute() {
    const main = new express.Router();
    main.all('/', function(req, res) {
        res.render('main');
    });

    main.all('/check', function (req, res) {        
        const wsdlUrl = 'https://ws.cdyne.com/creditcardverify/luhnchecker.asmx?wsdl';
        const number = { CardNumber: req.body.number };
        soap.createClient(wsdlUrl, function (err, client) {
            if (err) return res.status(500).json(err);
            client.CheckCC(number, function (err, result) {
                if (err) return res.status(500).json(err);
                const type = result.CheckCCResult.CardType;
                let valid;
                if(result.CheckCCResult.CardValid) valid = 'Yes';
                else valid = "No";
                res.render('check', {type:type, valid:valid});                
            });
        });
    });
    return main;
}

app.use('/main', mainRoute());

const port = process.env.PORT || 4545;
app.listen(4545, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
