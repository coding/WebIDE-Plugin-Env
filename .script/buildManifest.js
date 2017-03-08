const fs = require('fs');
const config = require('../package.json');
const version = config.codingIdePackage.version || config.version
const newPackage = {};

const keyValue = ['name', 'version', 'description', 'author']

newPackage.meta = keyValue.reduce((p, v) => {
    p[v] = config.codingIdePackage[v] || config[v] || ''
    return p
}, {})

newPackage.codingIdePackage = { ...config.codingIdePackage, ...newPackage.meta }
fs.writeFile(`dist/${version}/manifest.json`, JSON.stringify(newPackage, null, 4), 
function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("generate manifest json success");
});
