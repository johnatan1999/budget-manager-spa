const fs = require('fs');
const dir = '.next';
if(fs.existsSync(dir)) {
    fs.rmdir(dir, { recursive: true }, err => {
        if (err) {
          throw err
        }
        console.log(`${dir} is deleted!`);
    })
}
//mongodb+srv://joh:<password>@cluster0.wqqnt.mongodb.net/test