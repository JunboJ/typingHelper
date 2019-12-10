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
            break;
        case 'A':
            return fr.A;
            break;
        case 'c':
            return fr.c;
            break;
        case 'C':
            return fr.C;
            break;
        case 'e':
            return fr.e;
            break;
        case 'E':
            return fr.E;
            break;
        case 'i':
            return fr.i;
            break;
        case 'I':
            return fr.I;
            break;
        case 'o':
            return fr.o;
            break;
        case 'O':
            return fr.O;
            break;
        case 'u':
            return fr.u;
            break;
        case 'U':
            return fr.U;
            break;
        case 'y':
            return fr.y;
            break;
        case 'Y':
            return fr.Y;
            break;
        default:
            return null;
            break;
    }
};