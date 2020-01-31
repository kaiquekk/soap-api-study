const express = require('express');
const soap = require('soap');

const main = new express.Router;
main.all('/', function (req, res) {
    res.status(200);
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
            if (result.CheckCCResult.CardValid) valid = 'Yes';
            else valid = "No";
            res.status(200);
            res.render('check', { type: type, valid: valid });
        });
    });
});

module.exports = main;
