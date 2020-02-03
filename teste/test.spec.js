const path = require('path');
const nock = require('nock');
const expect = require('chai').expect;
const request = require('supertest');

const SOAP_API_HOST = 'https://ws.cdyne.com';
const SOAP_API_PATH = '/creditcardverify/luhnchecker.asmx?wsdl';

const setupWsdlNock = () => {
  return nock(SOAP_API_HOST)
    .get(SOAP_API_PATH)
    .replyWithFile(200, path.join(__dirname, './luhnchecker.xml'));
};

const setupGetCardNock = (status, filename) => {
  return nock(SOAP_API_HOST, {
    reqHeaders: {
      soapaction: `"${SOAP_API_HOST}/creditcardverify/CheckCC"`
    }
  })
    .post('/creditcardverify/luhnchecker.asmx')
    .replyWithFile(status, path.join(__dirname, filename));
};

describe('Credit Card Checker', () => {  
  setupWsdlNock();
  const server = require('./app');
  it('VISA', async () => {
    setupGetCardNock(200, './resVisa.xml');
    const result = await request(server)
      .get('/main/check')
      .expect(200);
    expect(result.body.CardType).equal('VISA');
    expect(result.body.CardValid).to.be.true;
  });
  it("MASTER CARD", async () => {
    setupGetCardNock(200, './resMaster.xml');
    const result = await request(server)
      .get('/main/check')
      .expect(200);
    expect(result.body.CardType).equal('MASTERCARD');
    expect(result.body.CardValid).to.be.true;
  });
  it("INVALID", async () => {
    setupGetCardNock(200, './resInvalid.xml');
    const result = await request(server)
      .get('/main/check')
      .expect(200);
    expect(result.body.CardType).equal('NONE');
    expect(result.body.CardValid).to.be.false;
  });
});