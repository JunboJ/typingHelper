export const get_pinyin = character => {
    const pinyin = {
        a: ['à', 'á', 'ā', 'ǎ'],
        e: ['è', 'é', 'ē', 'ě'],
        i: ['ì', 'í', 'ī', 'ǐ'],
        o: ['ò', 'ó', 'ō', 'ǒ'],
        u: ['ù', 'ú', 'ū', 'ǔ'],
        v: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return pinyin.a;
            case 'e':
                return pinyin.e;
            case 'i':
                return pinyin.i;
            case 'o':
                return pinyin.o;
            case 'u':
                return pinyin.u;
            case 'v':
                return pinyin.v;
            default:
                return null;
        }
    };

    const res = {
        resultString: character,
        partEnd: 1,
        result: letterSet(character) ? Array.from(letterSet(character)) : null
    }

    return new Promise((resolve, reject) => {
        res ? resolve(res) : reject(Error('pinyin ime error'));
    });
};