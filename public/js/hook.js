import { writingHelper, resetCaretStart, setFocus, helperDivMouseDownHandler, helperDivMouseUpHandler } from "./ime.js";

let language = null;
let buttonPosLeft;
let buttonPosTop;
let buttonWidth;
let buttonHeight;
let langList;
const listWrapper = document.createElement("div");
const ARROWKEY_CODES = [37, 38, 39, 40];
const inputKeys = [192, 219, 221, 220, 186, 222, 188, 190, 191, 111, 106, 109, 107, 110];
const languages = {
    de: "German",
    el: "Greek",
    en: "English",
    es: "Spanish",
    fr: "French",
    id: "Indonesian",
    it: "Italian",
    ja: "Japanese",
    romaji: "Romaji",
    zh: "Chinese",
    pinyin: "Chinese(Pinyin)"
};

$(window).resize(function() {
    reposition(langList);
});

$(document).ready(function() {
    console.log(navigator);
    langList = addLanguageCheckingList();
    $(langList).addClass("listWrapper_off");
    document.body.appendChild(langList);

    $(window).on("touchstart.helperMU mousedown.helperMU", e => {
        console.log('lang list', e.target);
        helperDivMouseDownHandler(e)
    });
    // $(window).on("touchend.helperMU mouseup.helperMU", e => {

    $('body').on("mouseup.helperMU touchend.helperMU ", e => {
        // e.preventDefault();
        // console.log(e);
        if (!e.target.matches('#changeLanguage_btn') && !e.target.matches('.check-container')) {
            // console.log('1');

            $(langList).addClass("listWrapper_off");
            $(langList).removeClass("listWrapper_on");
            $(".LanguageSwitchArrow").addClass("LanguageSwitchArrow_off");
            $(".LanguageSwitchArrow").removeClass("LanguageSwitchArrow_on");
        } else if (e.target.matches('.check-container')) {
            // console.log('2');
            // e.preventDefault();
            setTimeout(() => {
                $('#changeLanguage_btn')[0].innerText = '';
                $('#changeLanguage_btn')[0].innerHtml = '';
                let code = $(".langSwitch:checked + .langCode").val();
                const x = document.createElement("IMG");
                x.className = "flagIcon";
                x.style.pointerEvents = "none";
                x.setAttribute("src", "/images/icons/" + code + '.png');
                x.setAttribute("alt", code);
                $('#changeLanguage_btn')[0].innerText = languages[code].toUpperCase() + ' ';
                $('#changeLanguage_btn').append(x);
            }, 50);
        } else if (e.target.matches('#changeLanguage_btn')) {
            // console.log('3', langList);
            e.preventDefault();
            $(langList).toggleClass("listWrapper_off");
            $(langList).toggleClass("listWrapper_on");
            $(".LanguageSwitchArrow").toggleClass("LanguageSwitchArrow_off");
            $(".LanguageSwitchArrow").toggleClass("LanguageSwitchArrow_on");
            reposition(langList);
        }
        helperDivMouseUpHandler(e)
    });

    language = $(".langSwitch:checked + .langCode").val();
    // console.log(language);
    $(".writingHelper").each(function(index, object) {
        // elementsArr.forEach(element => {
        const element = $(this);

        element.parent().css({
            display: "flex",
            "flex-flow": "column",
            width: "100%",
            position: "relative"
        });

        const getHelperDiv = () => {
            return $(".helperDiv")[0] || null;
        };

        const eventHandler = (event, isTyping = false) => {
            // setFocus(element[0]);
            if (language != "en") {
                writingHelper(element, language, isTyping);
                return;
            }
        };

        const run = () => {
            // console.log(event.which);
            if (language != "en") {
                writingHelper(element, language);
            }
        };

        const arrowKeyEventHandler = event => {
            const div = getHelperDiv();
            if (div) {
                if (event.which == 37 || event.which == 39) {
                    run();
                }
            } else {
                if (ARROWKEY_CODES.includes(event.which)) {
                    run();
                }
            }
            if (event.which == 27) {
                if (div) {
                    div.remove();
                    resetCaretStart();
                }
            }
        };

        // element.on("click", e => eventHandler(e, true));
        element.on("keydown", event => {
            // console.log('key down event keycode', event.code);
            // console.log(element[0].tagName);

            const helperdiv = getHelperDiv();
            if (event.which == 8 || event.which == 46) {
                if (helperdiv) {
                    // console.log("helperdiv on backspace");
                    setTimeout(() => {
                        console.log('8 with helperDiv true');
                        eventHandler(event, true);
                    }, 50);
                } else {
                    setTimeout(() => {
                        console.log('8 with helperDiv false');
                        eventHandler(event);
                    }, 50);
                }
            }
            if (event.which == 27) {
                if (helperdiv) {
                    helperdiv.remove();
                    resetCaretStart();
                }
            }
            if (event.which == 13) {
                // Disable new line function on ENTER
                if (!helperdiv) {
                    event.preventDefault();
                }
            }
            if (language === 'ja') {
                if (event.code === 'Space') {
                    event.preventDefault();
                    if (!helperdiv) {
                        if (element[0].tagName === 'DIV') {
                            element.text(element.text() + '　');
                            setFocus();
                        } else {
                            element.val(element.val() + '　');
                        }
                    }
                }
            }
        });
        element.on("keyup", event => {
            let keycode = event.which;
            const div = getHelperDiv();
            if (ARROWKEY_CODES.includes(keycode)) {
                arrowKeyEventHandler(event);
            }
            if ((keycode >= 48 && keycode <= 57 && !div) || (keycode >= 65 && keycode <= 90)) {
                console.log('on keyup');
                eventHandler(event, true);
            }
            if (inputKeys.includes(keycode)) {
                resetCaretStart();
                if (div) div.remove();
            }
        });
        element.on("input", () => {
            console.log('on input');
        });
    });

    $(".langSwitch").on("change", event => {
        language = $(".langSwitch:checked + .langCode").val();
    });
});

const addLanguageCheckingList = textInput => {
    // const listWrapper = document.createElement("div");
    listWrapper.className = "listWrapper";
    Object.keys(languages).map(code => {
        const x = document.createElement("IMG");
        x.className = "flagIcon";
        x.setAttribute("src", "/images/icons/" + code + '.png');
        x.setAttribute("alt", code);

        const languageFullName = document.createElement("span");
        languageFullName.className = 'languageFullName';
        var t = document.createTextNode(languages[code]);
        languageFullName.appendChild(t);

        const langLabel = document.createElement("label");
        langLabel.className = "listItems";
        langLabel.classList.add("check-container");
        $(langLabel).css({ height: "auto", margin: "0.5rem" });

        const langSwitch = document.createElement("input");
        langSwitch.className = "langSwitch";
        langSwitch.name = "lang";
        langSwitch.type = "radio";
        if (code === "en") langSwitch.checked = true;

        const langCode = document.createElement("input");
        langCode.className = "langCode";
        langCode.type = "hidden";
        langCode.value = code;

        const mark = document.createElement("span");
        mark.className = "checkmark";

        langLabel.appendChild(x);
        langLabel.appendChild(languageFullName);
        langLabel.appendChild(langSwitch);
        langLabel.appendChild(langCode);
        langLabel.appendChild(mark);
        $(langLabel).children().css({ 'pointer-events': 'none' });
        listWrapper.appendChild(langLabel);
    });
    return listWrapper;
};

const reposition = langList => {
    buttonPosLeft = $("#changeLanguage_btn").offset().left;
    buttonPosTop = $("#changeLanguage_btn").offset().top;
    buttonWidth = $("#changeLanguage_btn").width();
    buttonHeight = $(langList).height();

    const buttonTop = Math.floor(buttonPosTop - buttonHeight - 15);
    $(langList).css({
        left: buttonPosLeft - 11,
        top: buttonTop
    });
};

const importKanjiLib = () => {

}