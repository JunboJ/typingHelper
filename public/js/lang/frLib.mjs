export const get_fr = character => {
    const fr = {
        a: ['à', 'â', 'æ'],
        A: ['À', 'Â', 'Æ'],
        c: ['ç'],
        C: ['Ç'],
        e: ['é', 'è', 'ê', 'ë'],
        E: ['É', 'È', 'Ê', 'Ë'],
        i: ['î', 'ï'],
        I: ['Î', 'Ï'],
        o: ['ô', 'œ'],
        O: ['Ô', 'Œ'],
        u: ['ù', 'û', 'ü'],
        U: ['Ù', 'Û', 'Ü'],
        y: ['ÿ'],
        Y: ['Ÿ']
    }

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
        default:
            return null;
    }
};