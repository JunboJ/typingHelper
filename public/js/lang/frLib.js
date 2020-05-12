export const get_fr = character => {
    console.log(character);

    const fr = {
        a: ['a', 'à', 'â', 'æ'],
        A: ['A', 'À', 'Â', 'Æ'],
        c: ['c', 'ç'],
        C: ['C', 'Ç'],
        e: ['e', 'é', 'è', 'ê', 'ë'],
        E: ['E', 'É', 'È', 'Ê', 'Ë'],
        i: ['i', 'î', 'ï'],
        I: ['I', 'Î', 'Ï'],
        o: ['o', 'ô', 'œ'],
        O: ['O', 'Ô', 'Œ'],
        u: ['u', 'ù', 'û', 'ü'],
        U: ['U', 'Ù', 'Û', 'Ü'],
        y: ['y', 'ÿ'],
        Y: ['Y', 'Ÿ'],
        _ap: ['\'', '’']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return fr.a;
            case 'A':
                return fr.A;
            case 'c':
                return fr.c;
            case 'C':
                return fr.C;
            case 'e':
                return fr.e;
            case 'E':
                return fr.E;
            case 'i':
                return fr.i;
            case 'I':
                return fr.I;
            case 'o':
                return fr.o;
            case 'O':
                return fr.O;
            case 'u':
                return fr.u;
            case 'U':
                return fr.U;
            case 'y':
                return fr.y;
            case 'Y':
                return fr.Y;
            case '’':
                return fr._ap;
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