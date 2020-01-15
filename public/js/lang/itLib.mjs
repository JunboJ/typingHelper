export const get_it = character => {
    const it = {
        a: ['à'],
        e: ['è', 'é'],
        i: ['ì', 'í'],
        o: ['ò', 'ó'],
        u: ['ù', 'ú'],
        _og: ['ò'],
        _ag: ['à'],
        _eg: ['è'],
        _ea: ['é'],
        _ug: ['ù'],
        _ig: ['ì'],
        _do: ['€'],
        _bml: ['«'],
        _bmr: ['»']

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
            case ';':
                return it._og;
            case '\'':
                return it._ag;
            case '[':
                return it._eg;
            case '{':
                return it._ea;
            case '\\':
                return it._ug;
            case '=':
                return it._ig;
            case '$':
                return it._do;
            case '<':
                return it._bml;
            case '>':
                return it._bmr;
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