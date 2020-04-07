export const get_romaji = character => {
    const pinyin = {
        a: ['ā'],
        o: ['ō'],
        u: ['ū'],
        i: ['ī'],
        e: ['ē']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return pinyin.a;
            case 'o':
                return pinyin.o;
            case 'u':
                return pinyin.u;
            case 'i':
                return pinyin.i;
            case 'e':
                return pinyin.e;
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
        res ? resolve(res) : reject(Error('romaji ime error'));
    });
};