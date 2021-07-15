const axios = require("axios");
const onlinesim_token = "8bc6532baa5ee0647d10333fe5a0841d";
const fs = require("fs");


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword',
  },
})

function getSMS(test)
{
    return test;
}
const killer = (suspects, dead) => Object.entries(suspects).find(([key, value]) => value.filter(name => dead.includes(name)).length === dead.length)[0]
async function start(){
var emails = []
let emailsdata = await fs.reedFileSync("emails.txt").split("\n");
emailsdata.forEach(data=>{
  data = data.split(":")
  let pass = data[1],
      mail = data[0];
  let email = {
    mail: mail,
    pass: pass
  }
  emails.push(email);
})
}

start();
