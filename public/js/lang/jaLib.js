let Dictionary = null;
let levelsOfLenience = 1;

export const get_ja = (str, type) => {
    let result = [];

    return new Promise((res, rej) => {
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
    });

};

const convertToKana = str => {
    return new Promise((res, rej) => {
        // let data = ;
        res(wanakana.toKana(str, { customKanaMapping: { n: 'n', nn: 'ん' } }));
    })
};

const convertToKanji = str => {
    return new Promise((res, rej) => {
        import ('./kanji_out.js')
        .then((m) => {
                // console.log(m.kanjiRaw);
                Dictionary = m.kanjiRaw;
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
                let level = input.length - i;

                // Move into currentLevel if exists otherwise break
                if (currentLevel.hasOwnProperty(letter))
                    currentLevel = currentLevel[letter];
                else
                    break;

                // Check if inside levels of lenience then add to result
                if (level <= levelsOfLenience && currentLevel.hasOwnProperty("v")) {
                    console.log('currentLevel ', currentLevel["v"]);
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