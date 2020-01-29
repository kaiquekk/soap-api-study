const soap = require('soap');
// const url = 'http://www.dneonline.com/calculator.asmx?wsdl';
// soap.createClient(url, function(err, client) {
//     client.Add({ intA: 29, intB: 1 }, function(err, result){
//         if(err) return console.log(err);
//         console.log(result.AddResult);
//     });
// });

const url = 'http://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL';

soap.createClient(url, function(err, client) {
    if(err) throw new Error(err);
    client.NumberToWords({ ubiNum:456 }, function(err, result){
        if(err) console.log(err)
        console.log(result.NumberToWordsResult);
    });
});