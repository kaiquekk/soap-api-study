const express = require('express');
const app = express();
const soap = require('soap');

app.all('/main/check', function (req, res) {
  const wsdlUrl = 'https://ws.cdyne.com/creditcardverify/luhnchecker.asmx?wsdl';
  const number = { CardNumber: '123' };
  soap.createClient(wsdlUrl, function (err, client) {
      if (err) return res.status(500).json(err);
      client.CheckCC(number, function (err, result) {
          if (err) return res.status(500).json(err);
          res.status(200).json(result.CheckCCResult)
      });
  });
});
module.exports = app;