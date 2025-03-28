const filters = require('../../static/forbidden.json')

const validateInapropiateContent = (text) => {
    const textToLower = text.toLowerCase();
    
    const forbiddenWords = filters['forbiddenWords'];
    const forbiddenPhrases = filters['forbiddenPhrases'];
    const forbiddenContext = filters['forbiddenContext'];

    return (
        forbiddenWords.some(word => textToLower.includes(word)) ||
        forbiddenPhrases.some(phrase => textToLower.includes(phrase)) ||
        forbiddenContext.some(expresion => textToLower.includes(expresion))
    );
};

module.exports = validateInapropiateContent;