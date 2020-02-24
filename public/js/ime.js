import { get_fr } from "./lang/frLib.js";
import { get_zh } from "./lang/zhLib.js";
import { get_de } from "./lang/deLib.js";
import { get_es } from "./lang/esLib.js";
import { get_it } from "./lang/itLib.js";
import { get_el } from "./lang/elLib.js";
import { get_ja } from "./lang/jaLib.js";
import { get_pinyin } from "./lang/pinyinLib.js";

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
let prevPage = null;
let nextPage = null;
let closeBtn = null;
let firstRowWrapper = null;
let options = null;
let settingMenuWrapper = null;
let settingMenu = null;
let settingMenuContent = null;
let settingMenuContentText = null;

let stringStart = null;
let cursorStart = null;
let cursorEnd = null;

// assign space key's function as entering a blank space by language
const SPACE_KEY_SPACE_LANGUAGE_LIST = ["de", "es", "fr", "it", "pinyin"];

// assign space key's function as selecting a option by language
const SPACE_KEY_SELECT_LANGUAGE_LIST = ["el", "zh", "ja"];

// language list that take multiple input
const MULTIPLE_LETTER_LANGUAGE_LIST = ["zh", "ja"];

export const writingHelper = (input, lang, isTyping = false) => {
    language = lang;
    input_Jq = input;
    input_Html = input[0];
    inputParent_Jq = input.parent()
    inputParent_Html = inputParent_Jq[0];
    inputValue = getInputValue();
    helperContent = $(".helperContent")[0] || null;

    helperDiv = $(".helperDiv")[0] ? $(".helperDiv")[0] : null;

    resetVariables();
    isTyping ? null : resetCaretStart();
    console.log('stringStart/cursorStart/cursorEnd', stringStart, cursorStart, cursorEnd);

    MULTIPLE_LETTER_LANGUAGE_LIST.includes(language) ? getCurrentCharacter = () => getInputML() : getCurrentCharacter = () => getInputSL();

    inputValue ? currentCharacter = getCurrentCharacter() : null;

    if (currentCharacter !== null) {
        console.log('currentCharacter: ', currentCharacter);

        getOptions(currentCharacter, result => {
            options = result;
            console.log('options: ', options);
            if (options !== null && options.result !== null) {
                // console.log('options.result.length: ', options.result.length);
                updatePageList(options.result.length);
                const copyStyle = getComputedStyle(input_Html);
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
                const {
                    offsetLeft: spanX,
                    offsetTop: spanY,
                    offsetWidth: spanWidth,
                    offsetHeight: spanHeight
                } = caretMarkSpan;
                const spany = $(caretMarkSpan).offset().top;

                // get position of clone div
                const {
                    offsetLeft: cloneFieldX,
                    offsetTop: cloneFieldY,
                    offsetWidth: cloneFieldWidth,
                    offsetHeight: cloneFieldHeight
                } = cloneField;

                // get position of input_Jq fields
                const {
                    offsetLeft: inputX,
                    offsetTop: inputY,
                    offsetWidth: inputWidth,
                    offsetHeight: inputHeight
                } = input_Html;

                // get position of the parent element of input_Jq fields
                const {
                    offsetLeft: ipX,
                    offsetTop: ipY,
                    offsetWidth: ipWidth,
                    offsetHeight: ipHeight
                } = inputParent_Html;

                const ipy = $(inputParent_Html).offset().top;

                // remove clone
                cloneField.remove();

                // if helperDiv does not exist
                if (helperDiv === null) {
                    createUIElements();
                    togglePageControllers();
                    basicKeyEventListener();
                    createOptions();
                } else {
                    togglePageControllers();
                    createOptions();
                }

                const {
                    offsetWidth: helperWidth,
                    offsetHeight: helperHeight
                } = helperDiv;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                // styling and positioning
                let leftPosition = spanX + 16;
                let spanW = ipX + spanX + helperWidth;
                let topPosition = cloneFieldHeight - helperHeight - spanHeight - 10;
                let topToWindow = Math.abs(spany);
                if (caretMarkSpan.textContent !== ".") {
                    topToWindow = Math.abs(spany);
                }
                optionStyling(topToWindow, helperHeight);

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

                if (input_Html.tagName === "div") {
                    // full width text area
                    if (spanW >= windowWidth) {
                        leftPosition = windowWidth - helperWidth - ipX;
                    }
                }

                helperDiv.style.left = `${leftPosition}px`;
                helperDiv.style.top = `${topPosition + 8}px`;
            } else {
                // resetVariables();
                if (helperDiv !== null) {
                    removeHelper();
                }
            }
        });
    } else {
        // resetVariables();
        if (helperDiv !== null) {
            removeHelper();
        }
    }
};

export const resetCaretStart = () => {
    console.log('reset string start');

    const { cursorStart: start } = getCaretPosition();
    stringStart = start;
};

const resetVariables = () => {
    currentCharacter = null;
    pages = [];
    pageNum = 0;
    highlightOption = 49;
};

const createUIElements = () => {
    helperDiv = document.createElement("div");
    helperDiv.className = "helperDiv";
    helperContent = document.createElement("div");
    helperContent.className = "helperContent";
    // button set container
    btnSet = document.createElement("div");
    btnSet.className = "btnSet";
    // page controller container
    pageCtrl = document.createElement("div");
    pageCtrl.className = "pageCtrl";
    // first row wrapper
    firstRowWrapper = document.createElement("div");
    $(firstRowWrapper).css({
        margin: "0",
        padding: "0",
        border: "none",
        display: "inline-flex",
        "justify-content": "space-between"
    });
    // page up button
    prevPage = document.createElement("button");
    prevPage.className = "pageCtrl";
    prevPage.id = "prevPageCtrl";
    prevPage.innerHTML = '<i class="fas fa-caret-left"></i>';
    $(prevPage).on("mousedown", event => {
        event.stopPropagation();
        input_Jq.off("blur");
    });
    $(prevPage).on("mouseup", event => {
        prevPageEventHandler(event, () => {
            setFocus(input_Jq);
            createOptions("pageChange");
            optionStyling();
        });
    });
    // page down button
    nextPage = document.createElement("button");
    nextPage.className = "pageCtrl";
    nextPage.id = "nextPageCtrl";
    nextPage.innerHTML = '<i class="fas fa-caret-right"></i>';
    $(nextPage).on("mousedown", event => {
        event.stopPropagation();
        input.off("blur");
    });
    $(nextPage).on("mouseup", event => {
        console.log("next");
        nextPageEventHandler(event, () => {
            setFocus(input_Jq);
            createOptions("pageChange");
            optionStyling();
        });
    });

    // closeBtn
    closeBtn = document.createElement("button");
    closeBtn.className = "helperCloseBtn";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    btnSet.appendChild(closeBtn);
    closeBtn.addEventListener("mousedown", event => {
        closeBtnMouseDownHandler(event);
    });
    closeBtn.addEventListener("mouseup", event => {
        closeBtnClickedHandler(event);
    });

    // setting menu container
    settingMenuWrapper = document.createElement("div");
    settingMenuWrapper.className = "settingMenuWrapper";
    settingMenu = document.createElement("div");
    settingMenu.className = "dropdown-menu";
    settingMenuContent = document.createElement("span");
    settingMenuContentText = document.createTextNode("More coming");

    // append elements
    firstRowWrapper.append(helperContent);
    firstRowWrapper.append(pageCtrl);
    firstRowWrapper.append(btnSet);
    pageCtrl.append(prevPage);
    pageCtrl.append(nextPage);
    helperDiv.append(firstRowWrapper);
    settingMenuContent.appendChild(settingMenuContentText);
    settingMenu.appendChild(settingMenuContent);
    settingMenuWrapper.appendChild(settingMenu);
    helperDiv.append(settingMenuWrapper);
    inputParent_Jq.append(helperDiv);
};

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
    } else {
        pageCtrl.style.display = "inline-flex";
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
    console.log('SL cursor pos: ', { cursorStart, cursorEnd });

    // get the character under caret
    if (cursorStart == cursorEnd)
        cursorStart = cursorEnd == 0 ? 0 : cursorStart - 1;
    const inputString = getInputValue(input_Html);
    const currentCharacter = inputString.slice(cursorStart, cursorEnd);
    return currentCharacter;
};

const getInputML = () => {
    let currentCharacter;
    const patt = /([a-zA-Z.,!?$;:\\()\'\"<>]+)/gi;
    // const kanaPatt = /([\u3040-\u30ff]*)/g;
    let temp;
    let charArray = [];
    let start, end;

    ({ cursorStart, cursorEnd } = getCaretPosition());
    console.log('ML cursor pos: ', { cursorStart, cursorEnd });

    if (cursorStart == cursorEnd) {
        start = stringStart;
        end = cursorEnd;
    } else {
        start = cursorStart;
        end = cursorEnd;
    }

    let inputValue = getInputValue(input_Html);
    const inputString = inputValue.slice(start, end);
    do {
        temp = patt.exec(inputString);
        if (temp) {
            const infoObj = {
                string: temp[0],
                index: patt.lastIndex
            };
            charArray.push(infoObj);
        }
    } while (temp);

    if (charArray.length > 0) {
        if (charArray[charArray.length - 1].index !== inputString.length) {
            currentCharacter = null;
        } else {
            currentCharacter = charArray[charArray.length - 1].string;
        }
    } else {
        currentCharacter = null;
    }

    return currentCharacter;
};

const getCaretPosition = () => {
    var caretStartPos = 0,
        caretEndPos = 0,
        selection,
        range;
    if (input_Html.tagName == "DIV") {
        if (window.getSelection) {
            selection = window.getSelection();
            // console.log('selection: ', selection);
            if (selection.rangeCount) {
                range = selection.getRangeAt(0);
                // console.log('range: ', range);

                if (range.commonAncestorContainer.parentNode == input_Html) {
                    caretStartPos = range.endOffset;
                    if (range.startOffset) caretStartPos = range.startOffset;
                    caretEndPos = range.endOffset;
                }
            }
        }
    } else {
        ({ caretStartPos, caretEndPos } = {
            caretStartPos: input_Html.selectionStart,
            caretEndPos: input_Html.selectionEnd
        });
    }
    return { cursorStart: caretStartPos, cursorEnd: caretEndPos };
};

// focus on element function
const setFocus = () => {
    console.log('set focus!');

    let element = input_Html;
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
        element.focus();
    } else {
        let stringNode = element.childNodes[0];
        let stringLength = stringNode.length;
        // console.log('set focus element: ', element);
        let range = document.createRange();
        let selection = window.getSelection();
        range.setStart(stringNode, stringLength);
        range.collapse(true);
        console.log("range: ", stringNode);
        selection.removeAllRanges();
        selection.addRange(range);
        element.focus();
    }
};

// get options from library
const getOptions = (str, callback) => {
    // console.log('str in getOptions: ', str);
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
                get_ja(str)
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
        if (i != 0) a = 1;
        if (i % 6 == 0) {
            if (pageStart + 6 + a <= resLength - 1) {
                pages[index] = [pageStart + a, pageStart + 6 + a];
                pageStart = pageStart + 6 + a;
                index++;
            } else {
                if (pageStart == resLength - 1) {
                    pages[index] = [pageStart + a, resLength - 1];
                } else {
                    pages[index] = [pageStart + a, resLength - 1];
                }
            }
        }
    }
    return;
};

const createOptions = (mode = "new") => {
    $(helperContent).empty();
    highlightOption = 49;
    if (mode == "new") pageNum = 0;
    // if (mode == "pageChange") {}
    if (options.result !== null) {
        mapOptionToBtn();
    }
};

const mapOptionToBtn = () => {
    const start = pages[pageNum][0];
    const end = pages[pageNum][1] + 1;
    console.log(pageNum + "/" + start + "/" + end);

    if (helperContent) {
        options.result.slice(start, end).map((char, index) => {
            let key = index + 49;
            // console.log(index);

            // create options as buttons
            let helperOptions = document.createElement("button");
            helperOptions.className = 'helperOptions';
            helperOptions.id = key;
            helperOptions.style.fontSize = "1rem";

            let text = document.createTextNode(char);
            helperOptions.appendChild(text);
            helperContent.appendChild(helperOptions);

            // create tip spans
            let tip = document.createElement("small");
            tip.className = "tips_windows";
            tip.innerHTML = index + 1;

            helperOptions.prepend(tip);

            $(helperOptions).on("mousedown", () => {
                mouseDownHandler(event);
            });
            $(helperOptions).on("mouseup", event => {
                event.muAssets = {
                    char: char
                };
                // console.log('event.muAssets: ', event.muAssets);

                mouseUpHandler(event);
            });

            // default option highlight
            setHighlight();
        });
    }
};

// pagination event handlers
const prevPageEventHandler = (event, callback) => {
    event.stopPropagation();
    input_Jq.off("blur");
    if (pages.length > 1) {
        if (pageNum - 1 >= 0) {
            pageNum = pageNum - 1;
            callback();
        }
    }
};

const nextPageEventHandler = (event, callback) => {
    event.stopPropagation();
    input_Jq.off("blur");
    if (pages.length > 1) {
        if (pageNum + 1 <= pages.length - 1) {
            pageNum = pageNum + 1;
            callback();
        }
    }
};

// closeBtn event handler
const closeBtnMouseDownHandler = event => {
    event.stopPropagation();
    input_Jq.off("blur");
};

const closeBtnClickedHandler = event => {
    if (helperDiv) helperDiv.remove();
    input_Jq.off(".basicKeyEvents");
};

const basicKeyEventListener = () => {
    console.log('event handler has pages: ', pages);

    input_Jq.on("keyup.basicKeyEvents", event => {
        keyupEventHandler(event);
    });
    input_Jq.on("keydown.basicKeyEvents", event => {
        keydownEventHandler(event);
    });
    if (mode !== "test") {
        input_Jq.one("blur", event => {
            closeBtnClickedHandler(event);
        });
    }
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
        event.preventDefault();
        $("#prevPageCtrl").mouseup();
    }

    if (keycode == 187) {
        event.preventDefault();
        $("#nextPageCtrl").mouseup();
    }

    // space key and enter key pressed
    if (keycode == 32 || keycode == 13) {
        console.log(language);
        if (SPACE_KEY_SPACE_LANGUAGE_LIST.includes(language) &&
            highlightOption == 49
        ) {
            console.log("add a space!!!");
            return;
        } else {
            event.preventDefault();
            $("#" + highlightOption).css({ "background-color": "rgb(78, 161, 216)" });
        }
    }

    if (keycode == 38) {
        event.preventDefault();
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
        // console.log(pages[pageNum][1], pages[pageNum][0], highlightOption);
        console.log(pageNum);
        if ((highlightOption - 49) < (pages[pageNum][1] - pages[pageNum][0])) {
            // event.preventDefault();
            highlightOption = highlightOption + 1;
            setHighlight(highlightOption);
            // console.log('nextable');
        } else {
            // event.preventDefault();
            $("#nextPageCtrl").mouseup();
            console.log('end');
        }
        // console.log("highlight option: ", highlightOption);
        // console.log(event.pages + '/' + pageNum + '/' + event.pages[pageNum][1] + '/' + highlightOption);
        return;
    }

    // other key check
    const valid = keyValidityCheck(keycode);
    if (valid) $("#49").mouseup();
};

// add key press event handler
const keyupEventHandler = event => {
    let keycode = event.which || event.keyCode;
    if (event.shiftKey === false) {
        if (document.getElementById(keycode)) {
            event.preventDefault();
            // console.log(`#${keycode}`);
            $(`#${keycode}`).mouseup();
            $("body").off(".basicKeyEvents");
            input_Jq.off(".basicKeyEvents");
            helperDiv.remove();
            if (language == "zh") {
                writingHelper(input_Jq, language, true);
            }
        }
    }
    if (keycode == 32 || keycode == 13) {
        console.log("highlight option: ", highlightOption);
        if (SPACE_KEY_SELECT_LANGUAGE_LIST.includes(language)) {
            // event.preventDefault();
            $("#" + highlightOption).mouseup();
            writingHelper(input_Jq, language, true);
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
    helperDiv.remove();
    input_Jq.off(".basicKeyEvents");
};

const keyValidityCheck = keycode => {
    // console.log(keycode);
    const inputKeys = [192, 219, 221, 220, 186, 222, 188, 190, 191];
    if (
        autoSelect &&
        !(keycode >= 48 && keycode <= 57) &&
        !(keycode >= 65 && keycode <= 90)
    ) {
        const valid = inputKeys.includes(keycode);
        return valid;
    }
    if (autoSelect && (keycode >= 65 && keycode <= 90)) {
        return true;
    }
    return false;
};

// cog onclick handler
const settingBtnClickedHandler = event => {
    event.stopPropagation();
    event.elements.input.off("blur");
    let display = $(".settingMenuWrapper").css("display");
    const position = $(".helperDiv")[0].classList.contains("helperDiv-bottom");

    if (display == "none") {
        const menuHeight = $(".settingMenuWrapper").outerHeight();
        let helperY = $(".helperDiv").css("top").slice(0, -2);
        helperY = parseInt(helperY);
        $(".settingMenuWrapper").css({ display: "flex" });
        const currentY = position ? helperY : helperY - menuHeight;
        $(".helperDiv").css({ top: currentY });
    }
    if (display == "flex") {
        const menuHeight = $(".settingMenuWrapper").outerHeight();
        let helperY = $(".helperDiv").css("top").slice(0, -2);
        helperY = parseInt(helperY);
        const currentY = position ? helperY : helperY + menuHeight;
        $(".helperDiv").css({ top: currentY });
        $(".settingMenuWrapper").css({ display: "none" });
    }
};

// selection highlight
const setHighlight = (option = 49) => {
    $(".helperOptions").css({ "background-color": "white" });
    $("#" + option).css({ "background-color": "rgb(78, 161, 216)" });
};

// add click event listener
const mouseDownHandler = event => {
    input_Jq.off("blur");
    event.stopPropagation();
};

const mouseUpHandler = event => {
    input_Jq.off("blur");
    event.stopPropagation();
    let wordStart, wordEnd, newString;
    console.log('cursorStart', cursorStart, 'cursorEnd', cursorEnd);
    if (cursorStart == cursorEnd) {
        // only japanese and Chinese have strL
        let strLength = options.strL || 0;
        wordStart = cursorStart - strLength;
        wordEnd = wordStart + options.partEnd;
        console.log('wordStart', wordStart, 'wordEnd', wordEnd);

        newString =
            inputValue.slice(0, wordStart) +
            event.muAssets.char +
            inputValue.slice(wordEnd);
    } else {
        let selectedString = inputValue.slice(
            cursorStart,
            cursorEnd
        );
        let modifiedSelectedString = selectedString.replace(
            options.resultString,
            event.muAssets.char
        );
        newString =
            inputValue.slice(0, cursorStart) +
            modifiedSelectedString +
            inputValue.slice(cursorEnd);
    }
    setInputValue(newString);
    removeHelper(helperDiv, input_Jq);
    setFocus(input_Jq);
};

// set input value
const setInputValue = (val) => {
    if (input_Html.tagName === "DIV") {
        input_Html.innerText = val;
    } else {
        if (input_Html.tagName === "INPUT" || input_Html.tagName === "TEXTAREA") {
            input_Html.value = val;
        } else {
            console.log("the element is invalid");
            return false;
        }
    }
};