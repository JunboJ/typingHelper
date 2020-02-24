// import { kanjiRaw } from './lang/AutoKanjiTrie.js';

let Dictionary = null;
let levelsOfLenience = 2;

const getKanji = input => {
    // variables
    let results = [];
    let currentLevel;

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
            if (level <= levelsOfLenience && currentLevel.hasOwnProperty("v"))
                results = results.concat(currentLevel["v"]);
        }

        // Reverse the results array to have the most accurate answer first and return results
        return results.reverse();
    }

    // We errored return fail code
    return -1;
};

import('./lang/AutoKanjiTrie.js')
    .then((m) => {
        // console.log(m.kanjiRaw);
        Dictionary = m.kanjiRaw;
        let res = getKanji('こん');
        console.log('result: ', res);

    })
    .catch(err => console.log(err));

// $(document).ready(() => {
//     console.log(kanjiRaw);
// });
