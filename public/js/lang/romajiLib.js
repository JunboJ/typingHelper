export const get_romaji = character => {
    const romaji = {
        a: ['ā'],
        o: ['ō'],
        u: ['ū'],
        i: ['ī'],
        e: ['ē'],
        A: ['Ā'],
        O: ['Ō'],
        U: ['Ū'],
        I: ['Ī'],
        E: ['Ē'],
        _ap: ['\'', '’', '「', '」']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return romaji.a;
            case 'o':
                return romaji.o;
            case 'u':
                return romaji.u;
            case 'i':
                return romaji.i;
            case 'e':
                return romaji.e;
            case 'A':
                return romaji.A;
            case 'O':
                return romaji.O;
            case 'U':
                return romaji.U;
            case 'I':
                return romaji.I;
            case 'E':
                return romaji.E;
            case '’':
                return romaji._ap;
            case '\'':
                return romaji._ap;
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