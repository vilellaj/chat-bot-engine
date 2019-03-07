const BrainJSClassifier = require('natural-brain');
const phrases = require('./phrases.json');
const classifier = new BrainJSClassifier();

(async () => {
    for (let i = 0; i < phrases.length; i++) {
        classifier.addDocument(phrases[i].text, phrases[i].tag);
    }

    classifier.train();

    classifier.save('models/classifier.json', () => {
        console.log('Model saved!');
    })
})();