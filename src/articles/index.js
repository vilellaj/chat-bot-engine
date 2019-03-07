const loki = require('lokijs');
const db = new loki('articles.db');
const articles = db.addCollection('articles');
const fs = require('fs');

const files = fs.readdirSync('./src/articles');

for (let i = 0; i < files.length; i++) {
    console.dir(files);
    let collection = require(`./${files[i]}`);
    articles.insert(collection);
}

module.exports = articles;