export const get_es = character => {
    const es = {
        a: ['a', 'á'],
        A: ['A', 'Á'],
        e: ['e', 'é'],
        E: ['E', 'É'],
        i: ['i', 'í'],
        I: ['I', 'Í'],
        n: ['n', 'ñ'],
        N: ['N', 'Ñ'],
        o: ['o', 'ó'],
        O: ['O', 'Ó'],
        u: ['u', 'ü', 'ú'],
        U: ['U', 'Ü', 'Ú'],
        _q: ['?', '¿'],
        _e: ['!', '¡'],
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