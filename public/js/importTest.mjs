let dic = null;

export const importDic = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            import ('./testlib.mjs')
            .then((a) => {
                    // console.log(a);
                    dic = a.kanjiRaw;
                    setTimeout(() => {
                        res(dic);
                    }, 1000);
                })
                .catch(err => {
                    console.log(err);

                });
        }, 50000)
    });
}

export const log = () => {
    console.log(typeof dic);
}