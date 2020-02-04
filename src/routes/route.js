const express = require('express');
// const soap = require('soap');
const soapRequest = require('easy-soap-request');

const main = new express.Router;
main.all('/', function (req, res) {
    res.status(200);
    res.render('main');
});

main.all('/check', function (req, res) {
    /* Urls for calling the real service and for mocking, respectively. Uncomment and comment according to use. */
    // const wsdlUrl = 'https://ws.cdyne.com/creditcardverify/luhnchecker.asmx?wsdl';
    const wsdlUrl = 'http://localhost:8088/'
   
    let xml = 
    `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <CheckCC xmlns="http://ws.cdyne.com/">
                <CardNumber>${req.body.CardNumber}</CardNumber>
            </CheckCC>
        </soap:Body>
    </soap:Envelope>`;

    const opt = {
        'Content-Type':'text/xml;charset=utf8'
    };
    (async () =>{
        const {response} = await soapRequest({url: wsdlUrl, headers: opt, xml: xml, timeout: 1000});
        const {headers, body, statusCode } = response;
        let typeStart = body.search('<CardType>');
        let typeEnd = body.search('</CardType>');
        let validStart = body.search('<CardValid>');
        let validEnd = body.search('</CardValid>');
        let type = body.substring(typeStart+10, typeEnd);
        let valid;
        if(body.substring(validStart+11, validEnd)) valid = 'Yes';
        else valid = 'No';
        res.status(200);
        res.render('check', { type: type, valid: valid });
    })();


    // const CardNumber = { CardNumber: req.body.CardNumber };
    // soap.createClient(wsdlUrl, function (err, client) {
    //     if (err) return res.status(500).json(err);
    //     client.CheckCC(CardNumber, function (err, result) {
    //         if (err) return res.status(500).json(err);
    //         const type = result.CheckCCResult.CardType;
    //         let valid;
    //         if (result.CheckCCResult.CardValid) valid = 'Yes';
    //         else valid = "No";
    //         res.status(200);
    //         res.render('check', { type: type, valid: valid });
    //     });
    // });
});

module.exports = main;
