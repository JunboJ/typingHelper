import { get_fr } from "./lang/frLib.js";
import { get_zh } from "./lang/zhLib.js";
import { get_de } from "./lang/deLib.js";
import { get_es } from "./lang/esLib.js";
import { get_it } from "./lang/itLib.js";
import { get_el } from "./lang/elLib.js";
import { get_ja, convertToJaNum } from "./lang/jaLib.js";
import { get_pinyin } from "./lang/pinyinLib.js";
import { get_romaji } from "./lang/romajiLib.js";

let language = "fr";
let mode = "";
let autoSelect = false;

let helperDiv = $(".helperDiv")[0] ? $(".helperDiv")[0] : null;
let cloneField = null;
let caretMarkSpan = null;

let input_Html = null;
let input_Jq = null;
let inputParent_Html = null;
let inputParent_Jq = null;
let inputValue = null;
let getCurrentCharacter = null;

let currentCharacter = null;
let pages = [];
let pageNum = 0;
let highlightOption = 49;

let helperContent = null;
let btnSet = null;
let pageCtrl = null;
let pageCtrlState = null;
let prevPage = null;
let nextPage = null;
let moreOption = null;
let closeBtn = null;
let firstRowWrapper = null;
let options = null;
let prev_options = null;
let moreOptionMenuWrapper = null;
let settingMenu = null;
let settingMenuContent = null;
let settingMenuContentText = null;
let frHeight = 0;
let frWidth = 0;

let stringStart = 0;
let caretPos = null;
let cursorStart = null;
let cursorEnd = null;

// assign space key's function as entering a blank space by language
const SPACE_KEY_SPACE_LANGUAGE_LIST = ["de", "es", "fr", "it", "pinyin", "romaji"];

// assign space key's function as selecting a option by language
const SPACE_KEY_SELECT_LANGUAGE_LIST = ["el", "zh", "ja"];

// assign ENTER key's function as selecting a option by language
const ENTER_KEY_SELECT_LANGUAGE_LIST = ["ja", "zh", "el", "romaji"];

// Reset caret start on selecting
const RESET_CARET_ON_SELECTING_LIST = ["ja"];

// language list that take multiple input
const MULTIPLE_LETTER_LANGUAGE_LIST = ["zh", "ja"];

// character type list
const CHARACTER_TYPE_LIST = ["latin", "kana", "romaji"];

// touch screen platform
const TS_PLATFORM = ["Linux armv8l", "iPad", "iPhone"];

export const writingHelper = (input, lang, isTyping = false, event = null) => {
    console.log('//////////////////////////');
    language = lang;
    input_Jq = input;
    input_Html = input[0];
    inputParent_Jq = input.parent()
    inputParent_Html = inputParent_Jq[0];
    inputValue = getInputValue();
    helperDiv = $(".helperDiv")[0] || null;
    helperContent = $(".helperContent")[0] || null;

    resetVariables();
    // console.log('is typing ? ', isTyping);
    isTyping ? null : resetCaretStart();
    MULTIPLE_LETTER_LANGUAGE_LIST.includes(language) ? getCurrentCharacter = getInputML : getCurrentCharacter = getInputSL;

    inputValue ? currentCharacter = getCurrentCharacter() : currentCharacter = { 0: null, 1: null };
    console.log('currentCharacter', currentCharacter);
    getOptionsByType(currentCharacter);
};
export const resetCaretStart = (el = input_Html) => {
    const { cursorStart: start } = getCaretPosition(el);
    stringStart = start;
    console.log('reset string start', el);
    recordCaretPos(el);
};

export const recordCaretPos = (el = input_Html) => {
    let posObj = getCaretPosition(el);
    console.log(el.firstChild);

    caretPos = el.innerText.length - posObj.cursorStart;
    console.log('record caretPos', caretPos);
};

const getOptionsByType = currentCharacter => {
    let resultCounter = 0;
    let entry = currentCharacter;
    Object.values(currentCharacter).forEach(entry => {
        if (entry !== null) {
            resultCounter++;
        }
    });
    if (entry[0] != null) {
        if (entry[0].type === 'latin') {
            getOptions(entry[0].string, data => {
                createInterface(data);
            }, entry[0].type);
        } else if (entry[0].type === 'romaji') {
            // console.log('romaji');
            getOptions(entry[0].string, data => {
                options = data;
                console.log('data', data);
                setInputValue(data.result[0])
                    .then(() => {
                        setFocus();
                        resetVariables();
                        inputValue = getInputValue();
                        inputValue.length > 0 ? currentCharacter = getCurrentCharacter() : currentCharacter = { 0: null, 1: null };
                        console.log('currentCharacter', currentCharacter)
                        if (currentCharacter[1] !== null)
                            getOptions(currentCharacter[1].string, createInterface, 'kana');
                    });
            }, entry[0].type);
        } else if (entry[0].type === 'num') {
            options = convertToJaNum(entry[0].string);
            console.log('options', options);
            setInputValue(options.result)
                .then(() => {
                    setFocus();
                    resetCaretStart();
                });
        }
    } else if (entry[0] == null && entry[1] != null && entry[1].type === 'kana') {
        getOptions(entry[1].string, data => {
            createInterface(data);
        }, entry[1].type);
    }

    if (resultCounter === 0 && helperDiv !== null) {
        removeHelper();
    }
};

const compare = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length)
        return false;
    let _arr1 = [arr1.concat().sort()];
    let _arr2 = [arr2.concat().sort()];
    for (let i = 0; i < _arr1.length; i++) {
        if (_arr1[i] !== _arr2[i])
            return false;
    }
    return true;
};

const createInterface = result => {
    options = result;
    let sameRes = false;
    if (options !== null && options.result !== null) {
        if (!prev_options) {
            prev_options = {...options };
        } else {
            sameRes = compare(prev_options.result, options.result);
            sameRes ? null : prev_options = {...options };
        }
        const copyStyle = getComputedStyle(input_Html);
        updatePageList(options.result.length);
        createAuxElement();
        for (const prop of copyStyle) {
            cloneField.style[prop] = copyStyle[prop];
        }
        if (input_Html.tagName === "TEXTAREA")
            cloneField.style.height = "auto";
        if (input_Html.tagName === "INPUT")
            cloneField.style.width = "auto";

        // create span to mark the position of caret
        let replacedInputValue = input_Html.tagName === "INPUT" ? inputValue.replace(/ /g, '.') : inputValue;
        let textContent = replacedInputValue.substr(0, cursorEnd).slice(0, -1);
        // assign content
        cloneField.textContent = textContent;
        caretMarkSpan.textContent = inputValue.substr(cursorEnd) + "." || ".";

        cloneField.appendChild(caretMarkSpan);
        inputParent_Html.appendChild(cloneField);

        // get position of wrapper of the rest of cloned content
        const spany = $(caretMarkSpan).offset().top;
        const spanX = $(caretMarkSpan).offset().left - $(input_Html).offset().left + 40;
        console.log('$(caretMarkSpan).offset().left', $(caretMarkSpan).offset().left, '$(input_Html).offset().left', $(input_Html).offset().left);

        // get position of clone div
        const {
            offsetTop: cfOffsetTop,
            offsetHeight: cfOffsetHeight
        } = cloneField;

        // get position of input_Jq fields
        const {
            // offsetLeft: inputX,
            offsetTop: inputY,
            offsetWidth: inputWidth,
            // offsetHeight: inputHeight
        } = input_Html;

        // get position of the parent element of input_Jq fields
        const {
            offsetLeft: ipX,
            // offsetTop: ipY,
            // offsetWidth: ipWidth,
            // offsetHeight: ipHeight
        } = inputParent_Html;

        // const ipy = $(inputParent_Html).offset().top;

        // remove clone
        cloneField.remove();

        let helperHeight, topPosition;

        // if helperDiv does not exist
        if (helperDiv === null) {
            // console.log('helperDiv === null', helperDiv === null);
            createUIElements();
            // togglePageControllers();
            basicKeyEventListener();
            createOptions()
                .then(() => {
                    // helperHeight = $('.firstRowWrapper').height();
                    // console.log('inputfield top', $(input_Html).offset().top);

                    frHeight = $('.firstRowWrapper').height();
                    topPosition = $(input_Html).offset().top;
                    // let scrollTopPosition = $('html').scrollTop();
                    console.log('input_Html topPosition', topPosition);
                    console.log('clonefield cfOffsetTop', cfOffsetTop);
                    console.log('frHeight firstRowWrapper', frHeight);
                    // console.log('input_Html scrollTopPosition', scrollTopPosition);
                    $(helperDiv).css({ 'height': `${frHeight}px`, 'top': `${cfOffsetTop - frHeight - 40}px` });
                });
        } else {
            // if ($('.moreOption').is('.open')) {
            //     let moHeight = $('.moreOptionMenuWrapper').height();
            //     closeMoreOption(moHeight);
            // }
            // togglePageControllers();
            // console.log('sameRes', sameRes);
            if (!sameRes) {
                let prev_moHeight = $('.moreOptionMenuWrapper')[0].offsetHeight;
                createOptions().then(() => {
                    if ($('button.moreOption').is('.open')) {
                        let moHeight = $('.moreOptionMenuWrapper')[0].offsetHeight;
                        let divTop = $(helperDiv).css('top');
                        console.log('divTop', divTop);
                        console.log('prev_moHeight', prev_moHeight, 'moHeight', moHeight);
                        frHeight = $('.firstRowWrapper').height();
                        // console.log('prev_moHeight - moHeight', `${prev_moHeight - moHeight}px`);
                        $(helperDiv).css({ 'height': `${moHeight + frHeight}px`, 'top': `${parseInt(divTop) + (prev_moHeight - moHeight)}px` });
                    }
                });
            }
        }
        // console.log('moreOptionMenuWrapper height', $('.moreOptionMenuWrapper').height());

        // const {
        //     offsetWidth: helperWidth,
        //     offsetHeight: helperHeight
        // } = helperDiv;
        const helperWidth = $(helperDiv).width();
        const windowWidth = window.innerWidth;
        // const windowHeight = window.innerHeight;
        // styling and positioning
        // console.log('spanX', spanX);
        let leftPosition = spanX + 20;
        let spanW = ipX + spanX + helperWidth;
        let topToWindow = Math.abs(spany);
        if (caretMarkSpan.textContent !== ".") {
            topToWindow = Math.abs(spany);
        }
        optionStyling(topToWindow, frHeight);

        if (input_Html.tagName === "INPUT") {
            // input field with full length string
            if (
                spanW - helperWidth >= inputWidth &&
                inputWidth + helperWidth < windowWidth
            ) {
                leftPosition = inputWidth;
            }
            // full width input field
            if (spanW >= windowWidth && inputWidth + helperWidth > windowWidth) {
                leftPosition = windowWidth - helperWidth - ipX;
            }
        }

        if (input_Html.tagName === "TEXTAREA") {
            // full width text area
            if (spanW >= windowWidth) {
                leftPosition = windowWidth - helperWidth - ipX;
            }
        }

        if (input_Html.tagName === "DIV") {
            // full width text area
            if (spanW >= windowWidth) {
                leftPosition = windowWidth - helperWidth - ipX;
            }
        }

        helperDiv.style.left = `${leftPosition}px`;
    } else {
        // resetVariables();
        if (helperDiv !== null) {
            removeHelper();
        }
    }
}

const resetVariables = () => {
    // console.log('reset pages list');
    currentCharacter = { 0: null, 1: null };
    pages = [];
    pageNum = 0;
    highlightOption = 49;
};

const createUIElements = () => {
    // console.log('createUIElements');
    helperDiv = document.createElement("div");
    helperDiv.className = "helperDiv";
    $(helperDiv).css({ 'z-index': '9999' });
    helperContent = document.createElement("div");
    helperContent.className = "helperContent";
    // button set container
    btnSet = document.createElement("div");
    btnSet.className = "btnSet";
    // // page controller container
    // pageCtrl = document.createElement("div");
    // pageCtrl.className = "pageCtrl";
    // first row wrapper
    firstRowWrapper = document.createElement("div");
    $(firstRowWrapper).addClass('firstRowWrapper');
    // // page up button
    // prevPage = document.createElement("button");
    // prevPage.className = "pageCtrl";
    // prevPage.id = "prevPageCtrl";
    // prevPage.innerHTML = '<i class="fas fa-caret-left"></i>';

    // // page down button
    // nextPage = document.createElement("button");
    // nextPage.className = "pageCtrl";
    // nextPage.id = "nextPageCtrl";
    // nextPage.innerHTML = '<i class="fas fa-caret-right"></i>';

    // closeBtn
    closeBtn = document.createElement("button");
    closeBtn.className = "helperCloseBtn";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    $(closeBtn).children('i.fa-times').css({ 'pointer-events': 'none' });

    //setting button
    moreOption = document.createElement("button");
    $(moreOption).addClass("moreOption close");
    moreOption.innerHTML = '<i class="fas fa-chevron-down"></i>';
    btnSet.appendChild(moreOption);
    btnSet.appendChild(closeBtn);

    // setting menu container
    moreOptionMenuWrapper = document.createElement("div");
    moreOptionMenuWrapper.className = "moreOptionMenuWrapper";
    settingMenu = document.createElement("div");
    settingMenu.className = "moreOptionList";
    settingMenuContent = document.createElement("span");
    // settingMenuContentText = document.createTextNode("More coming");

    // add eventlisteners
    input_Jq.on('focusout.keepFocus', e => {
        // console.log('focusout', e.target);
        $(e.target).focus();
    })

    // append elements
    firstRowWrapper.append(helperContent);
    // firstRowWrapper.append(pageCtrl);
    firstRowWrapper.append(btnSet);
    // pageCtrl.append(prevPage);
    // pageCtrl.append(nextPage);
    helperDiv.append(firstRowWrapper);
    // settingMenuContent.appendChild(settingMenuContentText);
    settingMenu.appendChild(settingMenuContent);
    moreOptionMenuWrapper.appendChild(settingMenu);
    helperDiv.append(moreOptionMenuWrapper);
    $(helperDiv).find('i').css({ 'pointer-events': 'none' });
    inputParent_Jq.append(helperDiv);
};

export const helperDivMouseDownHandler = (e, input_el) => {
    // if (input_Jq && helperDiv) {
    //     if ($(e.target).closest('.helperDiv').length == 0) {
    //         input_Jq.off('.keepFocus');
    //         // if (!TS_PLATFORM.includes(navigator.platform)) {
    //         //     input_Jq.off("blur");
    //         // }
    //     }
    // }
    if (!$(e.target).is('.writingHelper') && $(e.target).closest('.helperDiv').length == 0) {
        console.log('2');
        if (input_Jq) input_Jq.off('.keepFocus');
        $('.writingHelper').blur();
        if (helperDiv) removeHelper();
    }
}

export const helperDivMouseUpHandler = e => {
    // console.log('helperDivMouseUpHandler', e);
    // console.log('4', !$(e.target).is('.writingHelper'), $(e.target).closest('.helperDiv').length == 0);
    if ($('.writingHelper').length && helperDiv) {
        // console.log('5');
        e.stopPropagation();
        // if ($(e.target).closest('.helperDiv').length == 0 && !$(e.target).is(input_Jq)) {
        //     removeHelper();
        //     input_Jq.blur();
        //     console.log('removing');
        // }
        // if ($(e.target).is('#prevPageCtrl')) {
        //     prevPageEventHandler(e, () => {
        //         setFocus(input_Jq);
        //         createOptions("pageChange");
        //         optionStyling();
        //     });
        // }
        // if ($(e.target).is('#nextPageCtrl')) {
        //     nextPageEventHandler(e, () => {
        //         setFocus(input_Jq);
        //         createOptions("pageChange");
        //         optionStyling();
        //     });
        // }
        if ($(e.target).is('.helperOptions')) {
            mouseUpHandler(e);
            setFocus();
            removeHelper();
            if (RESET_CARET_ON_SELECTING_LIST.includes(language)) {
                resetCaretStart();
            } else {
                // console.log('run again');
                writingHelper(input_Jq, language, true);
            }
        }
        if ($(e.target).is('.moreOption')) {
            console.log('navigator.platform', navigator.platform);
            if (navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'MacIntel') {
                e.preventDefault();
            }
            moreOptionBtnClickedHandler(e);
        }
        if ($(e.target).is('.helperCloseBtn')) {
            closeBtnClickedHandler(e);
        }
    }
}

const createAuxElement = () => {
    cloneField = document.createElement("div");
    caretMarkSpan = document.createElement("span");
};

const optionStyling = (a, b) => {
    if (a <= b) {
        // topPosition = (cloneFieldHeight);
        $(".helperDiv").addClass("helperDiv-bottom");
        $(".helperOptions").addClass("helperOptions-bottom");
        $(".helperDiv").removeClass("helperDiv-top");
        $(".helperOptions").removeClass("helperOptions-top");
    } else {
        $(".helperDiv").removeClass("helperDiv-bottom");
        $(".helperOptions").removeClass("helperOptions-bottom");
        $(".helperDiv").addClass("helperDiv-top");
        $(".helperOptions").addClass("helperOptions-top");
    }
};

const togglePageControllers = () => {
    if (pages.length <= 1) {
        pageCtrl.style.display = "none";
        pageCtrlState = false;
    } else {
        pageCtrl.style.display = "inline-flex";
        pageCtrlState = true;
    }
};

// get input_Jq value
const getInputValue = () => {
    let text;
    if (input_Html.tagName === "DIV") {
        text = input_Html.innerText;
        return text;
    } else {
        if (input_Html.tagName === "INPUT" || input_Html.tagName === "TEXTAREA") {
            text = input_Html.value;
            return text;
        } else {
            console.log("the element is invalid");
            return false;
        }
    }
};

const getInputSL = () => {
    // let cursorStart, cursorEnd;
    ({ cursorStart, cursorEnd } = getCaretPosition());
    // console.log('getInputSL', cursorStart, cursorEnd);
    // get the character under caret
    if (cursorStart == cursorEnd)
        cursorStart = cursorEnd == 0 ? 0 : cursorStart - 1;
    const currentCharacter = inputValue.slice(cursorStart, cursorEnd);
    let res = currentCharacter.length == 0 ? null : { string: currentCharacter, type: 'latin' };
    return {
        0: res,
        1: null
    };
};

const getInputML = () => {
    let start, end;
    let match_0;
    let match_1;
    let patt_num = /^\d+$/;

    ({ cursorStart, cursorEnd } = getCaretPosition());
    // console.log('getInputML', cursorStart, cursorEnd, 'string start ', stringStart);
    if (cursorStart == cursorEnd) {
        start = stringStart;
        end = cursorEnd;
    } else {
        start = cursorStart;
        end = cursorEnd;
    }

    const inputString = inputValue.slice(start, end);

    if (inputString.length > 0) {
        if (language == 'zh') {
            match_0 = findMatch('latin', inputString);
            // console.log('zh match');
            match_1 = null;
        }
        if (language == 'ja') {
            console.log('inputString', inputString);
            // console.log('554', inputString.length == 1, patt_num.test(inputString));
            if (patt_num.test(inputString)) {
                match_0 = { string: inputString, type: 'num' };
                console.log('match_0', match_0);

                match_1 = null;
            } else {
                // console.log('ja match');
                match_0 = findMatch('romaji', inputString);
                match_1 = findMatch('kana', inputString);
            }
        }
    } else {
        match_0 = match_1 = null
    }

    return {
        0: match_0,
        1: match_1
    };
};

const findMatch = (type, str) => {
    const patt = /([a-zA-Z.,!?$;:\\~\-\()\[\]{}\'\"<>\s]+)/gi;
    const kanaPatt = /([\u3040-\u30ff.,!?$;:\\~\-\()\[\]{}\'\"<>\s]+)/g;
    console.log('patt', patt.toString(), 'kanaPatt', kanaPatt.toString());

    let match;
    let charArray = [];
    let count = 0;
    if (type === 'kana') {
        while ((match = kanaPatt.exec(str)) !== null && count < 10) {
            // console.log('match: ', match);
            const infoObj = {
                string: match[0],
                index: kanaPatt.lastIndex
            };
            charArray.push(infoObj);
            count++;
        }
        // console.log('charArray: ', charArray);
        if (charArray.length > 0) {
            let res = charArray[charArray.length - 1].string;
            return { string: res, type: type }
        } else {
            return null;
        }
    } else {
        while ((match = patt.exec(str)) !== null && count < 10) {
            // console.log('match: ', match);
            const infoObj = {
                string: match[0],
                index: patt.lastIndex
            };
            charArray.push(infoObj);
            count++;
        }
        // console.log('charArray: ', charArray);
        if (charArray.length > 0) {
            if (charArray[charArray.length - 1].index !== str.length) {
                return null;
            } else {
                let res = charArray[charArray.length - 1].string;
                return { string: res, type: type }
            }
        } else {
            return null;
        }
    }
}

const getCaretPosition = (el = input_Html) => {
    var caretStartPos = 0,
        caretEndPos = 0,
        selection,
        range;
    if (el.tagName == "DIV") {
        if (window.getSelection) {
            selection = window.getSelection();
            // console.log('selection: ', selection);
            if (selection.rangeCount) {
                range = selection.getRangeAt(0);
                // console.log('range: ', range, 'input_Jq', $(el));
                // console.log('range.commonAncestorContainer.parentNode == input_Html: ', $(range.commonAncestorContainer.parentNode).children(input_Jq).length > 0);
                if ($(range.commonAncestorContainer.parentNode).is($(el)) || $(range.commonAncestorContainer.parentNode).children($(el)).length > 0) {
                    // console.log('range.endOffset: ', range.endOffset);
                    caretStartPos = range.endOffset;
                    if (range.startOffset) caretStartPos = range.startOffset;
                    // console.log('range.endOffset: ', range.endOffset);
                    caretEndPos = range.endOffset;
                }
            }
        }
    } else {
        ({ caretStartPos, caretEndPos } = {
            caretStartPos: el.selectionStart,
            caretEndPos: el.selectionEnd
        });
    }
    return { cursorStart: caretStartPos, cursorEnd: caretEndPos };
};

// focus on element function
export const setFocus = () => {
    let element = input_Html;
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {} else {
        // console.log(element, element.childNodes[0]);
        let stringNode = element.childNodes[0];
        let range = document.createRange();
        if (caretPos !== null) {
            let pos = input_Html.innerText.length - caretPos;
            range.setStart(stringNode, pos);
        } else {
            range.selectNodeContents(stringNode);
        }
        // console.log('setFocus', range, stringNode.nodeType);
        range.collapse();
        let selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
        }
        selection.addRange(range);
    }
};

// get options from library
const getOptions = (str, callback, type) => {
    const reset = () => {
        autoSelect = false;
    };
    if (str.length != 0) {
        switch (language) {
            case "de":
                reset();
                callback(get_de(str) || null);
                break;
            case "es":
                reset();
                callback(get_es(str) || null);
                break;
            case "fr":
                reset();
                callback(get_fr(str) || null);
                break;
            case "it":
                reset();
                callback(get_it(str) || null);
                break;
            case "el":
                autoSelect = true;
                callback(get_el(str) || null);
                break;
            case "zh":
                reset();
                const result = get_zh(str);
                callback(result);
                break;
            case "pinyin":
                reset();
                get_pinyin(str)
                    .then(res => callback(res))
                    .catch(err => console.log(err));
                break;
            case "ja":
                reset();
                get_ja(str, type)
                    .then(res => callback(res))
                    .catch(err => {
                        console.log(err)
                        alert('Loading Kanji input method...');
                    });
                break;
            case "romaji":
                reset();
                get_romaji(str)
                    .then(res => callback(res))
                    .catch(err => console.log(err));
                break;
            default:
                return null;
        }
    }
    return null;
};

// pagination
const updatePageList = resLength => {
    // let pages = [];
    let index = 0;
    let pageStart = 0;
    for (let i = 0; i < resLength; i++) {
        let a = 0;
        if (i > 0) a = 1;
        if (i % 7 == 0) {
            if (pageStart + a + 6 <= resLength - 1) {
                pages[index] = [pageStart + a, pageStart + a + 6];
                pageStart = pageStart + a + 6;
                index++;
            } else {
                pages[index] = [pageStart + a, resLength - 1];
            }
        }
    }
    // console.log(pages);
    return;
};

const createOptions = (mode = "new") => {
    return new Promise((res, rej) => {
        $(helperContent).empty();
        highlightOption = 49;
        if (mode == "new") pageNum = 0;
        // if (mode == "pageChange") {}
        if (options.result !== null) {
            // const start = pages[pageNum][0];
            // const end = pages[pageNum][1] + 1;
            // console.log(pageNum + "/" + start + "/" + end);
            // console.log('options', options);
            const start = 0;
            const end = 7;
            if (helperContent) {
                options.result.slice(start, end).map((char, index) => {
                    let key = index + 49;
                    // console.log(index);

                    // create options as buttons
                    let helperOptions = document.createElement("button");
                    helperOptions.className = 'helperOptions';
                    helperOptions.id = key;
                    helperOptions.setAttribute('data', char);
                    helperOptions.style.fontSize = "1rem";

                    let text = document.createTextNode(char);
                    helperOptions.appendChild(text);
                    helperContent.appendChild(helperOptions);
                    // create tip spans
                    let tip = document.createElement("small");
                    $(tip).css({ 'pointer-events': 'none' });
                    tip.className = "tips_windows";
                    tip.innerHTML = index + 1;

                    helperOptions.prepend(tip);

                    // default option highlight
                    setHighlight();
                });
            }
            if (settingMenu) {
                $(settingMenu).empty();
                console.log('options.result', options.result);
                options.result.map((char, index) => {
                    let helperOptions = document.createElement("button");
                    helperOptions.className = 'helperOptions';
                    helperOptions.setAttribute('data', char);
                    helperOptions.id = 'm' + index;
                    $(helperOptions).css({ 'font-size': '1rem', 'min-height': '2.5rem', 'min-width': '2.5rem' });

                    let text = document.createTextNode(char);
                    helperOptions.appendChild(text);
                    settingMenu.appendChild(helperOptions);
                });
                let hcWidth = $('.helperContent').width();
                let bsWidth = $('.btnSet').width();
                $('.firstRowWrapper').css({ 'width': `${hcWidth + bsWidth}px` });
            }

            res();
            // resetHeights();
        }
    });
};

const resetHeights = () => {
    frHeight = $('.firstRowWrapper').height();
    frWidth = $('.firstRowWrapper').width();
    // console.log('frWidth', frWidth);
    $(helperDiv).css({ 'height': `${frHeight}px` });
}

// pagination event handlers
const prevPageEventHandler = (event, callback) => {
    // event.stopPropagation();
    if (pages.length > 1) {
        if (pageNum - 1 >= 0) {
            pageNum = pageNum - 1;
            callback();
        }
    }
};

const nextPageEventHandler = (event, callback) => {
    // event.stopPropagation();
    if (pages.length > 1) {
        if (pageNum + 1 <= pages.length - 1) {
            pageNum = pageNum + 1;
            callback();
        }
    }
};

const closeBtnClickedHandler = event => {
    removeHelper();
};

const basicKeyEventListener = () => {
    input_Jq.on("keyup.basicKeyEvents", event => {
        keyupEventHandler(event);
    });
    input_Jq.on("keydown.basicKeyEvents", event => {
        keydownEventHandler(event);
    });
};

// key down
const keydownEventHandler = event => {
    let keycode = event.which || event.keyCode;
    // number key pressed
    if (event.shiftKey === false && keycode >= 48 && keycode <= 57) {
        if (document.getElementById(keycode)) {
            event.preventDefault();
            $("#" + keycode).css({ "background-color": "rgb(78, 161, 216)" });
        }
        return;
    }

    if (keycode == 189) {
        if (pageCtrlState) {
            event.preventDefault();
            $("#prevPageCtrl").mouseup();
            return;
        }
    }

    if (keycode == 187) {
        if (pageCtrlState) {
            event.preventDefault();
            $("#nextPageCtrl").mouseup();
            return;
        }
    }

    // space key and enter key pressed
    if (keycode == 32) {
        // console.log(language);
        if (SPACE_KEY_SPACE_LANGUAGE_LIST.includes(language) &&
            highlightOption == 49
        ) {
            // console.log("add a space!!!");
            return;
        } else {
            event.preventDefault();
            $("#" + highlightOption).css({ "background-color": "rgb(78, 161, 216)" });
            return;
        }
    }

    // ENTER key pressed
    if (keycode == 13) {
        // Disable starting a new line
        event.preventDefault();
        if (ENTER_KEY_SELECT_LANGUAGE_LIST.includes(language)) {
            event.preventDefault();
            $("#" + highlightOption).css({ "background-color": "rgb(78, 161, 216)" });
        }
    }

    if (keycode == 38) {
        event.preventDefault();
        console.log('up arrow');

        if (highlightOption - 49 > 0) {
            // event.preventDefault();
            highlightOption = highlightOption - 1;
            setHighlight(highlightOption);
        } else {
            // if (pageNum > 0) {
            // event.preventDefault();
            $("#prevPageCtrl").mouseup();
            // }
        }
        // console.log("highlight option: ", highlightOption);
        return;
    }

    if (keycode == 40) {
        event.preventDefault();
        console.log('down arrow');
        if ((highlightOption - 49) < (pages[pageNum][1] - pages[pageNum][0])) {
            // event.preventDefault();
            highlightOption = highlightOption + 1;
            setHighlight(highlightOption);
            // console.log('nextable');
        } else {
            // event.preventDefault();
            $(".moreOption.close").mouseup();
            // console.log('end');
        }
        return;
    }

    // other key check
    if (autoSelect) {
        const valid = keyValidityCheck(keycode);
        if (valid) $("#49").mouseup();
    }
};

// add key press event handler
const keyupEventHandler = event => {
    let keycode = event.which || event.keyCode;
    if (event.shiftKey === false) {
        if (document.getElementById(keycode)) {
            event.preventDefault();
            // console.log(`#${keycode}`);
            $(`#${keycode}`).mouseup();
            if (RESET_CARET_ON_SELECTING_LIST.includes(language)) {
                resetCaretStart();
            }
            $("body").off(".basicKeyEvents");
            input_Jq.off(".basicKeyEvents");
            if (helperDiv) helperDiv.remove();
            if (language == "zh") {
                writingHelper(input_Jq, language, true);
            }
        }
    }
    if (keycode == 32) {
        // console.log("highlight option: ", highlightOption);
        if (SPACE_KEY_SELECT_LANGUAGE_LIST.includes(language)) {
            // event.preventDefault();
            $("#" + highlightOption).mouseup();
            if (RESET_CARET_ON_SELECTING_LIST.includes(language)) {
                resetCaretStart();
            } else {
                console.log('run again');
                writingHelper(input_Jq, language, true);
            }
        }
        // if (SPACE_KEY_SPACE_LANGUAGE_LIST.includes(language) && highlightOption == 49) { }
        if (highlightOption != 49) {
            event.preventDefault();
            $("#" + highlightOption).mouseup();
        }
    }
    if (keycode == 13) {
        // console.log("highlight option: ", highlightOption);
        if (ENTER_KEY_SELECT_LANGUAGE_LIST.includes(language)) {
            event.preventDefault();
            $("#" + highlightOption).mouseup();
            if (RESET_CARET_ON_SELECTING_LIST.includes(language)) {
                resetCaretStart();
            } else {
                writingHelper(input_Jq, language, true);
            }
        }
        // if (SPACE_KEY_SPACE_LANGUAGE_LIST.includes(language) && highlightOption == 49) { }
        if (highlightOption != 49) {
            event.preventDefault();
            $("#" + highlightOption).mouseup();
        }
    }
};

// remove helperDiv function
const removeHelper = () => {
    if (mode != 'test') {
        if (helperDiv) helperDiv.remove();
        helperDiv = null;
        input_Jq.off(".basicKeyEvents .keepFocus");
        console.log('eventlistener removed');
    }
};

const keyValidityCheck = keycode => {
    // console.log(keycode);
    const inputKeys = [192, 219, 221, 220, 186, 222, 188, 190, 191, 111, 106, 109, 107, 110];
    if (!(keycode >= 48 && keycode <= 57) &&
        !(keycode >= 65 && keycode <= 90)
    ) {
        const valid = inputKeys.includes(keycode);
        return valid;
    }
    if ((keycode >= 65 && keycode <= 90)) {
        return true;
    }
    return false;
};

// more option onclick handler
const moreOptionBtnClickedHandler = event => {
    // let display = $(".moreOptionMenuWrapper").css("display");
    // const position = $(".helperDiv")[0].classList.contains("helperDiv-bottom");

    // if (display == "none") {
    //     const menuHeight = $(".moreOptionMenuWrapper").outerHeight();
    //     let helperY = $(".helperDiv").css("top").slice(0, -2);
    //     helperY = parseInt(helperY);
    //     $(".moreOptionMenuWrapper").css({ display: "flex" });
    //     const currentY = position ? helperY : helperY - menuHeight;
    //     $(".helperDiv").css({ top: currentY });
    // }
    // if (display == "flex") {
    //     const menuHeight = $(".moreOptionMenuWrapper").outerHeight();
    //     let helperY = $(".helperDiv").css("top").slice(0, -2);
    //     helperY = parseInt(helperY);
    //     const currentY = position ? helperY : helperY + menuHeight;
    //     $(".helperDiv").css({ top: currentY });
    //     $(".moreOptionMenuWrapper").css({ display: "none" });
    // }
    let moHeight = $('.moreOptionMenuWrapper').height();
    if ($(event.target).is('.moreOption.close')) {
        console.log('is close');
        openMoreOption(moHeight);
    } else if ($(event.target).is('.moreOption.open')) {
        console.log('is open');
        closeMoreOption(moHeight);
    }
};

const openMoreOption = (moHeight) => {
    // console.log('open frHeight', frHeight, $(".helperDiv").offset().top);
    let helperY = $(".helperDiv").css("top");
    helperY = parseInt(helperY);
    console.log('helperY', helperY);
    const position = $(".helperDiv")[0].classList.contains("helperDiv-bottom");
    const currentY = position ? helperY : helperY - moHeight;
    console.log(currentY);

    $(helperDiv).css({ 'height': `${frHeight + moHeight}px`, top: `${currentY}px` });
    // console.log('$(helperDiv).height()', $(helperDiv).css('height'));
    $('button.moreOption').toggleClass('close', false);
    $('button.moreOption').toggleClass('open', true);
}

const closeMoreOption = (moHeight) => {
    // console.log('close frHeight', frHeight);
    let helperY = $(".helperDiv").css("top").slice(0, -2);
    helperY = parseInt(helperY);
    const position = $(".helperDiv")[0].classList.contains("helperDiv-bottom");
    const currentY = position ? helperY : helperY + moHeight;
    $(helperDiv).css({ 'height': `${frHeight}px`, top: currentY });
    $('button.moreOption').toggleClass('close', true);
    $('button.moreOption').toggleClass('open', false);
}

// selection highlight
const setHighlight = (option = 49) => {
    $(".helperOptions").css({ "background-color": "white" });
    $("#" + option).css({ "background-color": "rgb(78, 161, 216)" });
};

const mouseUpHandler = event => {
    let char = $(event.target).attr('data');
    setInputValue(char);
};

// set input value
const setInputValue = val => {
    return new Promise((res, rej) => {
        let wordStart, wordEnd, newString;
        // console.log('cursorStart', cursorStart, 'cursorEnd', cursorEnd);
        if (cursorStart == cursorEnd) {
            // only japanese and Chinese have strL
            let strLength = options.strL || 0;
            wordStart = cursorStart - strLength;
            wordEnd = wordStart + options.partEnd;

            newString =
                inputValue.slice(0, wordStart) +
                val +
                inputValue.slice(wordEnd);
        } else {
            let selectedString = inputValue.slice(
                cursorStart,
                cursorEnd
            );
            let modifiedSelectedString = selectedString.replace(
                options.resultString,
                val
            );
            newString =
                inputValue.slice(0, cursorStart) +
                modifiedSelectedString +
                inputValue.slice(cursorEnd);
        }

        if (input_Html.tagName === "DIV") {
            input_Html.innerText = newString;
            res();
        } else {
            if (input_Html.tagName === "INPUT" || input_Html.tagName === "TEXTAREA") {
                input_Html.value = newString;
                res();
            } else {
                console.log("the element is invalid");
                rej(err);
            }
        }

    });
};