const axios_proxy = require("axios"); // web requests
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator') // unique nicknames
var TempMail = require('node-temp-mail'); // tempmail
const HttpsProxyAgent = require("https-proxy-agent") // https proxy
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors] }); // random nickname

/////////////////////////////SOCKET CONNECT//////////////////////////////////
const httpsAgent = new HttpsProxyAgent({host: "185.183.163.222", port: "58575", auth: "YU9yr6:ZmUELw"})
axios = axios_proxy.create() // axios_proxy.create({httpsAgent})
/////////////////////////////////////////////////////////////////////////////
let apikey = "4a4b7ecce664ce0239f2f6ce65fa9fe8"
let onlinsim_api = "8bc6532baa5ee0647d10333fe5a0841d"
let UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0" // useragent



let fingerprint = "822818675888.ta4719BBB421000"
let accountemail = `jo${randomName}@xojxe.com`
let accountpassword = "Wrt6oWh"

function getRandomInt(min, max) 
{
  return Math.floor(Math.random() * (max - min)) + min;
}

let year = getRandomInt(1995, 2005)
let month = getRandomInt(1, 10)
let day = getRandomInt(1, 9)




async function discordReg(captcha_key)
{
  //console.log(captcha_key)
  axios({
    method: "post",
    url: "https://discord.com/api/v9/auth/register",
    data: 
    {
      captcha_key: captcha_key,
      consent: true,
      date_of_birth: `${year}-0${day}-0${month}`,
      email: accountemail,
      fingerprint: fingerprint,
      gift_code_sku_id: null,
      invite: null,
      password: accountpassword,
      username: randomName
    },
    headers:
    {
      "User-Agent": UserAgent
    }
  })
  .then(response => {
    if(response.data['token'])
    {
      console.log("Аккаунт зарегистрирован! Токен:", response.data['token'])
      createSMS(response.data['token'])
    }
  })
  .catch(error => {
    console.log(error.response.data)
    if(error.response.data['captcha_sitekey']) {
      let sitekey = error.response.data['captcha_sitekey']
      inCaptcha(sitekey)
    }
    else 
    {
      if(error.response.data['message'] == 'You are being rate limited.')
      {
        console.log(`Rate-limit у дискорда. Пробуйте через ${error.response.data['retry_after']}`)
      }
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
      "Authorization": token,
      "User-Agent": UserAgent
    }
  })
  setTimeout(getSMS, 15000, tzid, token)
}


function createSMS(discordtoken)
{
  axios({
    method: "post",
    url: `https://onlinesim.ru/api/getNum.php?apikey=${onlinsim_api}&service=discord&number=1`,
    headers:
    {
      "User-Agent": UserAgent
    }
  })
  .then(response => {
    //console.log(response)
    let tzid = response.data['tzid']
    let number = response.data['number']
    console.log("Телефон создан. OnlineSIM:", number)
    setTimeout(sendCode, 2000, discordtoken, number, tzid)
  })
  .catch(error => {
    console.log(error)
  })
}

function getSMS(tzid, token) 
{
  axios.get(`https://onlinesim.ru/api/getState.php?apikey=${onlinsim_api}&tzid=${tzid}&message_to_code=1`).then(response => {
    if(response.data['0']['msg'])
    {
      let codeSMS = response.data['0']['msg']
      let codeNumber = response.data['0']['number']
      console.log("СМС получено. Code:", codeSMS)
      verifyPHONE(token, codeSMS, codeNumber, tzid)
    }
  })
}

function verifyPHONE(token, smscode, codeNumber, tzid) 
{
  axios({
    method: 'post',
    url: 'https://discord.com/api/v9/phone-verifications/verify',
    data: {
      code: smscode,
      phone: codeNumber
    },
    headers: {
      "Authorization": token,
      "User-Agent": UserAgent
    }
  })
  .then(response => {
    if(response.data['token']) 
    {
      console.log("Телефон подтвержден.")
      endVerifyPhone(token, response.data['token'], tzid)
    }
  })
}

function endVerifyPhone(token, tokenpass, tzid) {
  axios({
    method: 'POST',
    url: 'https://discord.com/api/v9/users/@me/phone',
    data: {
      password: accountpassword,
      phone_token: tokenpass
    },
    headers: {
      "Authorization": token,
      "User-Agent": UserAgent
    }
  })
  .then(response => {
    if(response) {
      removeNumber(tzid)
      mailCheck()
    }
  })
}

function removeNumber(tzid)
{
  axios.get(`https://onlinesim.ru/api/setOperationOk.php?apikey=${onlinsim_api}&tzid=${tzid}`)
  console.log("Операции с телефоном закончились.")
}

function inCaptcha(sitekey) {
  axios.get(`http://rucaptcha.com/in.php?key=${apikey}&method=hcaptcha&sitekey=${sitekey}&json=1&pageurl=https://discord.com/api/v9/auth/register`).then(response => {
    let captchaid = response.data['request']
    setTimeout(resCaptcha, 25000, captchaid, sitekey)
  })
}


function resCaptcha(captchaid, sitekey) {
  axios.get(`http://rucaptcha.com/res.php?key=${apikey}&action=get&id=${captchaid}&json=1`).then(response => {
    //console.log(response.data['request'])
    if(response.data['request'] == "CAPCHA_NOT_READY")
    {
      inCaptcha(sitekey)
    }
    else
    {
      discordReg(response.data['request'])
    }
  })
}

function emailVerify(captcha_key, token)
{
  axios({
    method: "post",
    url: "https://discord.com/api/v9/auth/verify",
    data: {
      captcha_key: captcha_key,
      token: token
    },
    headers: {
      "User-Agent": UserAgent
    }
  })
  .then(response => {
    console.log("Почта подтверждена.")
  }) 
  .catch(error => {
    //console.log(error)
    if(error.response.data['captcha_sitekey']) emailinCaptcha(error.response.data['captcha_sitekey'], token)
  })
}

function emailinCaptcha(sitekey, token) {
  axios.get(`http://rucaptcha.com/in.php?key=${apikey}&method=hcaptcha&sitekey=${sitekey}&json=1&pageurl=https://discord.com/api/v9/auth/verify`).then(response => {
    //console.log(response.data)
    let captchaid = response.data['request']
    setTimeout(emailresCaptcha, 21000, captchaid, token)
  })
}


function emailresCaptcha(captchaid, token) {
  axios.get(`http://rucaptcha.com/res.php?key=${apikey}&action=get&id=${captchaid}&json=1`).then(response => {
    captchakey = response.data['request']
    emailVerify(captchakey, token)
  })
}

async function start() {
  await discordReg()
  //await setInterval(mailCheck, 50000)
  //createSMS("test")
  //oa_ping()
}

start()




async function mailCheck() {
  var address = new TempMail(`jo${randomName}`);
  address.fetchEmails((err, body) => {
    if(err) return
    console.log("Current TempMail:", address.getAddress())
    if(body.messageCount > 0 && body.messageCount < 2)
    {
      let url = body.messages[0]['message'].match(/\bhttps?:\/\/\S+/gi)['0']
      axios.get(url).then(response => {
        let url1 = response.request.res.responseUrl
        //console.log(url1)
        let finalyurl = url1.split("=")[1]
        emailVerify(null, finalyurl)
      })
    }
  })
}





