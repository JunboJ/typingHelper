let Dictionary = null;
let levelsOfLenience = 1;
let jaNum = ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９'];

export const importKanjiLib = () => {
    return new Promise((res, rej) => {
        import ('./kanji-compiled.js')
        .then((m) => {
                Dictionary = m.kanjiRaw$$module$kanji_out;
                console.log(m);
                res();
            })
            .catch(err => {
                console.log(err);
                rej('import kanji lib err')
            });
    })
};

export const get_ja = (str, type) => {
    let result = [];
    return new Promise((res, rej) => {
        if (Dictionary !== null) {
            if (str.length > 0) {
                if (type === 'romaji') {
                    convertToKana(str)
                        .then(data => {
                            result[0] = data || null;
                            res({
                                resultString: str,
                                partEnd: str.length,
                                result: result,
                                strL: str.length
                            });
                        });
                }
                if (type === 'kana') {
                    convertToKanji(str)
                        .then(data => {
                            // console.log('converted: ', data);
                            result = data || null;
                            res({
                                resultString: str,
                                partEnd: str.length,
                                result: result,
                                strL: str.length
                            });
                        });
                }
                // rej('input type error (not kana or romaji)');
            } else {
                rej(Error(err));
            }
        } else {
            rej('Library not ready');
        }
    });
};

export const convertToJaNum = num => {
    let finalNum = '';
    let stringNum = num.toString();
    for (const el of stringNum) {
        finalNum += jaNum[el];
    }
    return {
        resultString: num,
        strL: finalNum.length,
        partEnd: finalNum.length,
        result: finalNum
    };
}

const convertToKana = str => {
    return new Promise((res, rej) => {
        console.log('str', str);
        let result = [];
        let convertedResult = '';
        let patt = /([a-z]+|[A-Z]+)/g;
        let groupedStr = str.match(patt);
        let i = 0;
        while (i < groupedStr.length) {
            let lcPatt = /^[a-z]+$/g;
            let ucPatt = /^[A-Z]+$/g;
            let v = groupedStr[i];
            if (lcPatt.test(v)) {
                result.push(wanakana.toHiragana(v, { customKanaMapping: { n: 'n', nn: 'ん' } }));
                console.log('lower case');
                i++
                continue;
            }
            if (ucPatt.test(v)) {
                let partRes = wanakana.toKatakana(v);
                for (let i = 0; i < partRes.length; i++) {
                    if (wanakana.isJapanese(partRes[i])) {
                        result.push(partRes[i]);
                    } else {
                        let converted = partRes[i].toUpperCase();
                        result.push(converted);
                        console.log('converted', converted);
                    }
                }
                console.log('upper case');
                i++
                continue;
            }
        }
        result.forEach(v => {
            convertedResult += v;
        })
        console.log('convertedResult', convertedResult);
        res(convertedResult);
    })
};

const convertToKanji = str => {
    return new Promise((res, rej) => {
        getKanji(str)
            .then(kanjis => {
                // console.log('result: ', kanjis);
                // console.log('original string: ', str);
                if (kanjis.length > 0) {
                    res(kanjis);
                } else {
                    res(null);
                }
            })
            .catch(err => console.log(err));
    });
};

const getKanji = input => {
    // variables
    let results = [];
    let currentLevel;
    return new Promise((res, rej) => {
        // Check if dictonary is initialized
        if (Dictionary !== null) {
            currentLevel = Dictionary;

            // Loop through length of word 
            for (let i = 0; i < input.length; i++) {
                // Get letter and calculate level
                let letter = input[i];
                console.log('letter', letter);
                let level = input.length - i;

                // Move into currentLevel if exists otherwise break
                if (currentLevel.hasOwnProperty(letter))
                    currentLevel = currentLevel[letter];
                else
                    break;

                // Check if inside levels of lenience then add to result
                if (level <= levelsOfLenience && currentLevel.hasOwnProperty("v")) {
                    currentLevel["v"].map(array => {
                        if (Array.isArray(array) && array.length > 1) {
                            array.map(val => {
                                results = results.concat(new Array(val));
                            })
                        } else {
                            results = results.concat(array);
                        }
                        // results = results.concat(currentLevel["v"]);
                    });
                }
            }
            results.push(input);
            results.reverse()
                // Reverse the results array to have the most accurate answer first and return results
                // console.log(results);
            res(results);
        }

        // We errored return fail code
        rej(Error('dictionary error'));
    });
};