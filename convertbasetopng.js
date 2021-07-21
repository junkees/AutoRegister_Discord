const fs = require('fs');
const path = 'xxx/'+ Date.now() +'.png';
const data = "base64-file..."
const base64 = data.replace(/^data:image\/\w+;base64,/, "");//Remove the front part of the image base64 code data:image/png;base64
    const dataBuffer = new Buffer(base64,'base64'); //Convert the base64 code into a buffer object,
    fs.writeFile(path, dataBuffer, function(err){//write file with fs
    if(err){
        console.log(err);
    }
    else{
        console.log('Write successfully!');
    }
})