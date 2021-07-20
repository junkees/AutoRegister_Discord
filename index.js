const axios = require("axios");
const { send } = require("process");
var randomEmail = require('random-email');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
let apikey = "4a4b7ecce664ce0239f2f6ce65fa9fe8"
let onlinsim_api = "8bc6532baa5ee0647d10333fe5a0841d"


function discordReg(captcha_key)
{
  let randomE = randomEmail({ domain: 'gmail.com' });
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
  console.log(`abibaabsus${randomE}`)
  axios.post("https://discord.com/api/v9/auth/register", 
  {
    captcha_key: captcha_key,
    consent: true,
    date_of_birth: "2003-02-13",
    //email: `abibaabsus${randomE}`,
    email: "iphonedan11824@gmail.com",
    fingerprint: "8607783763968040.ta7B6OkNMtlXWhrpGKYM5y34Lus",
    gift_code_sku_id: null,
    invite: "https://discord.gg/hx3C7yx7",
    password: "5dc4WQJJhjQB19zmlB0o",
    username: randomName
  })
  .then(response => {
    if(response.data['token'])
    {
      console.log("Аккаунт зарегистрирован! ", response.data['token'])
      createSMS(response.data['token'])
    }
  })
  .catch(error => {
    console.log(error.response.data)
    if(error.response.data['captcha_sitekey']) {
      let sitekey = error.response.data['captcha_sitekey']
      inCaptcha(sitekey)
    }
  })
}


function sendCode(token, number, tzid) 
{
  axios({
    method: 'post',
    url: 'https://discord.com/api/v9/users/@me/phone',
    data: {
      phone: number
    },
    headers: {
      "Authorization": token
    }
  })
  /* .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  }) */
  let tzid_sim = tzid
  setTimeout(getSMS, 12000, tzid_sim)
}


function createSMS(discordtoken)
{
  let dsToken = discordtoken
  console.log(dsToken)
  axios.post(`https://onlinesim.ru/api/getNum.php?apikey=${onlinsim_api}&service=discord&number=1`).then(response => {
    let tzid = response.data['tzid']
    let number = response.data['number']

    setTimeout(sendCode, 2000, dsToken, number, tzid)
  })
}

function getSMS(tzid, token) 
{
  console.log(tzid)
  axios.get(`https://onlinesim.ru/api/getState.php?apikey=${onlinsim_api}&tzid=${tzid}&message_to_code=1`).then(response => {
    let dstoken = token
    if(response.data['0']['msg'])
    {
      let codeSMS = response.data['0']['msg']
      let codeNumber = response.data['0']['number']
      verifyPHONE(dstoken, codeSMS, codeNumber)
    }
    console.log("CODE:", response.data['0']['msg'])
  })
}

function verifyPHONE(token, smscode, codeNumber) 
{
  console.log(token)
  axios({
    method: 'post',
    url: 'https://discord.com/api/v9/phone-verifications/verify',
    data: {
      code: smscode,
      phone: codeNumber
    },
    headers: {
      "Authorization": token
    }
  })
  .then(response => {
    console.log(respose)
  })
}


function inCaptcha(sitekey) {
  axios.get(`http://rucaptcha.com/in.php?key=${apikey}&method=hcaptcha&sitekey=${sitekey}&json=1&pageurl=https://discord.com/api/v9/auth/register`).then(response => {
    let captchaid = response.data['request']
    setTimeout(resCaptcha, 20000, captchaid)
  })
}


function resCaptcha(captchaid) {
  axios.get(`http://rucaptcha.com/res.php?key=${apikey}&action=get&id=${captchaid}&json=1`).then(response => {
    //console.log(response.data['request'])
    discordReg(response.data['request'])
  })
}

function start() {
  //getSMS(39306611, "12332")
  //discordReg("test")
  verifyPHONE("1321", "123", "322")
  //createSMS()
}

start()


