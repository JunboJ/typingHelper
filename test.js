var autoKanji = require("autokanji");
var kanji;
var string = 'こん';

kanji = autoKanji.find(string); // Returns: ['学校']
console.log(string);
console.log(kanji);
