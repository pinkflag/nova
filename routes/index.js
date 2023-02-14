const { request } = require('express');
var express = require('express');
var router = express.Router();
var axios = require('axios');
const fs = require('fs');

const client_id = '2e6e08115d35248bdc886de92ed523be3a7a4a0ea535e82a75aef8cecb7e83f3'
const secret_key = '72796a0b25849852298ee85b83ae1f9fd50cda77cf52276fbf48ef6145f8d949'
const authToken = Buffer.from(`${client_id}:${secret_key}`).toString('base64')
const publicToken = '8124f459-e36b-4166-a4e5-41dad448f6a5'

const getAccessToken = async () => {
  try {
    let result = await axios.get('https://api.novacredit.com/connect/accesstoken', {
      headers: {
        'Authorization': `Basic ${authToken}`,
        'X-ENVIRONMENT': 'sandbox'
      }
    })
    return result.data.accessToken

  } catch (err) {
    throw new Error(err)
  }
}

const getCreditPassport = async () => {
  try {
    let accessToken = await getAccessToken()
    let accessTokenHeader = Buffer.from(accessToken).toString("base64")
    let result = await axios.get('https://api.novacredit.com/connect/passport/v4/pdf', {
      headers: {
        'Authorization': `Bearer ${accessTokenHeader}`,
        'X-ENVIRONMENT': 'sandbox',
        'X-PUBLIC-TOKEN': publicToken
      },
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    })
    //console.log(result)
    return result.data

  } catch (err) {
    throw new Error(err)
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Boundless Auto Loans' });
});

router.get('/accesstoken', async (req, res) => {
  try {
    let result = await getAccessToken()
    res.send(200, result)
  }
  catch (err) {
    // Handle errors
    console.error(err);
  }
});

router.post('/creditpass', async (req, res) => {
  try {
    let result = await getCreditPassport(req.body.publicToken)

    fs.writeFile('./incoming/applicant1_credit.pdf', result, 'binary', err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });

    // res.send(200, result.accessToken)
  }
  catch (err) {
    // Handle errors
    console.error(err);
  }
});


module.exports = router;