$(function() {
    let textNode = document.querySelector('.styleTest span');
    const spellingModeStyle = node => {
        let text = $(node).text();
        let patt = /(\S+|)/g;
        let zhPatt = /(\p{L}+|\p{Script=Han}+|[\u002e\u002c\u0021\u005c\u003f\u0024\u002d\u003b\u003a\u005c\u005c\u0028\u0029\u005c\u0027\u005c\u0022\u003c\u003e\u00ab\u00bb\u20ac\u0384\u00a8\u00a1\u00bf\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19\u2019\u2018\u300c\u300d\uff0c\u3002\u2018\u2019\u201c\u201d\uff01\uff1f\u300a\u300b\u3001\uffe5\uff1a\uff1b]+|\s+)/ug;
        let result = text.match(zhPatt);
        let htmlString = "";
        console.log('result', result);
        for (let i = 0; i < result.length; i++) {
            let checkSpace = /^[\s\u002e\u002c\u0021\u005c\u003f\u0024\u003b\u003a\u005c\u002d\u005c\u0028\u0029\u005c\u0027\u005c\u0022\u003c\u003e\u00ab\u00bb\u20ac\u0384\u00a8\u00a1\u00bf\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19\u2019\u2018\u300c\u300d\uff0c\u3002\u2018\u2019\u201c\u201d\uff01\uff1f\u300a\u300b\u3001\uffe5\uff1a\uff1b]*$/g;
            let checkPunc = /[\u002e\u002c\u0021\u005c\u003f\u0024\u003b\u003a\u005c\u002d\u005c\u0028\u0029\u005c\u0027\u005c\u0022\u003c\u003e\u00ab\u00bb\u20ac\u0384\u00a8\u00a1\u00bf\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19\u2019\u2018\u300c\u300d\uff0c\u3002\u2018\u2019\u201c\u201d\uff01\uff1f\u300a\u300b\u3001\uffe5\uff1a\uff1b]*/g;
            let openTextSpan = "<span class='text-only'>"
            let openBorderSpan = "<span class='border'>";
            let openSpan = "<span class='non-border'>";
            let closeSpan = "</span>";
            if (!checkSpace.test(result[i])) {
                htmlString += openBorderSpan + openTextSpan + result[i] + closeSpan + closeSpan;
            } else if (checkPunc.test(result[i])) {
                console.log('punc check');
                htmlString += openSpan + result[i] + closeSpan;
            } else {
                htmlString += openSpan + result[i] + closeSpan;
            }
        }
        $(node).html(htmlString);
    }
    spellingModeStyle(textNode);
});