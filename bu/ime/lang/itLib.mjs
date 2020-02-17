export const get_it = character => {
    const it = {
        a: ['a', 'à'],
        A: ['A', 'À'],
        e: ['e', 'è', 'é'],
        E: ['E', 'È', 'É'],
        i: ['i', 'ì', 'í'],
        I: ['I', 'Ì'],
        o: ['o', 'ò', 'ó'],
        O: ['O', 'Ò', 'Ó'],
        u: ['u', 'ù', 'ú'],
        U: ['U', 'Ù'],
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
            case 'A':
                return it.A;
            case 'e':
                return it.e;
            case 'E':
                return it.E;
            case 'i':
                return it.i;
            case 'I':
                return it.I;
            case 'o':
                return it.o;
            case 'O':
                return it.O;
            case 'u':
                return it.u;
            case 'U':
                return it.U;
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