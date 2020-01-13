export const get_it = character => {
    const it = {
        a: ['à'],
        e: ['è', 'é'],
        i: ['ì', 'í', 'î'],
        o: ['ò', 'ó'],
        u: ['ù', 'ú']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return it.a;
            case 'e':
                return it.e;
            case 'i':
                return it.i;
            case 'o':
                return it.o;
            case 'u':
                return it.u;
            default:
                return null;
        }
    };

    return {
        resultString: character,
        partEnd: 1,
        result: letterSet(character) ? Array.from(letterSet(character)) : null
    }
};