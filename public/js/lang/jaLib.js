console.log('wanakana: ', wanakana);

export const get_ja = str => {
    const result = [];
    const convertToKana = str => {
        return wanakana.toKana(str, { customKanaMapping: { n: 'n', nn: 'ん' } });
    };
    return new Promise((res, rej) => {
        if (str.length > 0) {
            const converted = convertToKana(str);
            result[0] = converted ? converted : null;
            res({
                resultString: str,
                partEnd: str.length,
                result: result,
                strL: str.length
            });
        } else {
            rej(Error(err));
        }
    });
};