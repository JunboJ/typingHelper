export const get_el = character => {
    const el = {
        a: ['α','ά'],
        A: ['Α'],
        b: ['β'],
        // B: ['Β'],
        c: ['ψ'],
        C: ['Ψ'],
        d: ['δ'],
        D: ['Δ'],
        e: ['ε', 'έ'],
        E: ['Ε'],
        f: ['φ'],
        F: ['Φ'],
        g: ['γ'],
        G: ['Γ'],
        h: ['η', 'ή'],
        // H: ['Η'],
        i: ['ι','ί','ϊ','ΐ'],
        // I: ['Ι'],
        j: ['ξ'],
        J: ['Ξ'],
        k: ['κ'],
        // K: ['Κ'],
        l: ['λ'],
        L: ['Λ'],
        m: ['μ'],
        // M: ['Μ'],
        n: ['ν'],
        // N: ['Ν'],
        o: ['ο','ό'],
        // O: ['Ο'],
        p: ['π'],
        P: ['Π'],
        r: ['ρ'],
        R: ['Ρ'],
        s: ['σ'],
        S: ['Σ'],
        t: ['τ'],
        // T: ['Τ']
        u: ['θ'],
        U: ['Θ'],
        v: ['ω','ώ'],
        V: ['Ω'],
        // w: [''],
        // W: [''],
        x: ['χ'],
        // X: ['Χ'],
        y: ['υ','ύ','ϋ','ΰ'],
        Y: ['Υ'],
        z: ['ζ'],
        Z: ['Ζ']
    }

    const letterSet = character => {
        switch (character) {
            case 'a':
                return el.a;
            case 'A':
                return el.A;
            case 'b':
                return el.b;
            // case 'B':
            //     return el.B
            case 'c':
                return el.c;
            case 'C':
                return el.C;
            case 'd':
                return el.d;
            case 'D':
                return el.D;
            case 'e':
                return el.e;
            case 'E':
                return el.E;
            case 'f':
                return el.f;
            case 'F':
                return el.F;
            case 'g':
                return el.g;
            case 'G':
                return el.G;
            case 'h':
                return el.h;
            // case 'H':
            //     return el.H;
            case 'i':
                return el.i;
            case 'I':
                return el.I;
            case 'j':
                return el.j;
            case 'J':
                return el.J;
            case 'k':
                return el.k;
            // case 'K':
            //     return el.K;
            case 'l':
                return el.l;
            case 'L':
                return el.L;
            case 'm':
                return el.m;
            // case 'M':
            //     return el.M;
            case 'n':
                return el.n;
            // case 'N':
            //     return el.N;
            case 'o':
                return el.o;
            // case 'O':
            //     return el.O;
            case 'p':
                return el.p;
            case 'P':
                return el.P;
            case 'r':
                return el.r;
            case 'R':
                return el.R;
            case 's':
                return el.s;
            case 'S':
                return el.S;
            case 't':
                return el.t;
            // case 'T':
            //     return el.T;
            case 'u':
                return el.u;
            case 'U':
                return el.U;
            case 'v':
                return el.v;
            case 'V':
                return el.V;
            // case 'w':
            //     return el.w;
            // case 'W':
            //     return el.W;
            case 'x':
                return el.x;
            // case 'X':
            //     return el.X;
            case 'y':
                return el.y;
            case 'Y':
                return el.Y;
            case 'z':
                return el.z;
            case 'Z':
                return el.Z;
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