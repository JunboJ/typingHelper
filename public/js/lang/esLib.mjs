export const get_es = character => {
    const es = {
        a: ['á'],
        A: ['Á'],
        e: ['é'],
        E: ['É'],
        i: ['í'],
        I: ['Í'],
        n: ['ñ'],
        N: ['Ñ'],
        o: ['ó'],
        O: ['Ó'],
        u: ['ü', 'ú'],
        U: ['Ü', 'Ú'],
        _q: ['¿'],
        _e: ['¡'],
        _do: ['€'],
        _bml: ['«'],
        _bmr: ['»']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return es.a;
            case 'A':
                return es.A;
            case 'e':
                return es.e;
            case 'E':
                return es.E;
            case 'i':
                return es.i;
            case 'n':
                return es.n;
            case 'N':
                return es.N;
            case 'o':
                return es.o;
            case 'O':
                return es.O;
            case 'u':
                return es.u;
            case 'U':
                return es.U;
            case '!':
                return es._e;
            case '?':
                return es._q;
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