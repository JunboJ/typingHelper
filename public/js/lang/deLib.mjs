export const get_de = character => {
    const de = {
        a: ['ä'],
        A: ['Ä'],
        o: ['ö'],
        O: ['Ö'],
        U: ['Ü'],
        u: ['ü'],
        s: ['ß'],
        S: ['ẞ'],
        _do: ['€'],
        _bml: ['«'],
        _bmr: ['»']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return de.a;
            case 'A':
                return de.A;
            case 'o':
                return de.o;
            case 'O':
                return de.O;
            case 'u':
                return de.u;
            case 'U':
                return de.U;
            case 's':
                return de.s;
            case 'S':
                return de.S;
            case '$':
                return es._do;
            case '<':
                return es._bml;
            case '>':
                return es._bmr;
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