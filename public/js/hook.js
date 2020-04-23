import { writingHelper, resetCaretStart, setFocus } from "./ime.js";

let language = null;
let buttonPosLeft;
let buttonPosTop;
let buttonWidth;
let buttonHeight;
let langList;
const listWrapper = document.createElement("div");
const ARROWKEY_CODES = [37, 38, 39, 40];
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

const addLanguageCheckingList = textInput => {
    // const listWrapper = document.createElement("div");
    listWrapper.className = "listWrapper";
    Object.keys(languages).map(code => {
        const x = document.createElement("IMG");
        x.className = "flagIcon";
        x.setAttribute("src", "public/images/icons/" + code + '.png');
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
        $(langSwitch).on("click", () => {
            setTimeout(() => {
                // $(listWrapper).toggleClass("listWrapper_off");
                // $(listWrapper).toggleClass("listWrapper_on");
                $('#changeLanguage_btn')[0].innerText = '';
                $('#changeLanguage_btn')[0].innerHtml = '';
                let code = $(".langSwitch:checked + .langCode").val();
                const x = document.createElement("IMG");
                x.className = "flagIcon";
                x.style.pointerEvents = "none";
                x.setAttribute("src", "public/images/icons/" + code + '.png');
                x.setAttribute("alt", code);
                $('#changeLanguage_btn')[0].innerText = languages[code].toUpperCase() + ' ';
                $('#changeLanguage_btn').append(x);
            }, 50);
        });

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

$(window).resize(function() {
    reposition(langList);
});

$(window).click(e => {
    // console.log(e);
    if (!e.target.matches('#changeLanguage_btn')) {
        $(langList).addClass("listWrapper_off");
        $(langList).removeClass("listWrapper_on");
        $(".LanguageSwitchArrow").addClass("LanguageSwitchArrow_off");
        $(".LanguageSwitchArrow").removeClass("LanguageSwitchArrow_on");
    }
});

$(document).ready(function() {
    langList = addLanguageCheckingList();
    $(langList).addClass("listWrapper_off");
    document.body.appendChild(langList);

    $("#changeLanguage_btn").on("click", event => {
        // const classCheck = $(langList).hasClass('listWrapper_off');
        $(langList).toggleClass("listWrapper_off");
        $(langList).toggleClass("listWrapper_on");
        $(".LanguageSwitchArrow").toggleClass("LanguageSwitchArrow_off");
        $(".LanguageSwitchArrow").toggleClass("LanguageSwitchArrow_on");
        reposition(langList);
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
            // console.log("input event", isTyping);
            // event.preventDefault();
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
        };

        element.on("click", eventHandler);
        element.on("keydown", event => {
            // console.log('key down event keycode', event.code);
            // console.log(element[0].tagName);

            const helperdiv = getHelperDiv();
            if (event.which == 8 || event.which == 46) {
                if (helperdiv) {
                    // console.log("helperdiv on backspace");
                    setTimeout(() => {
                        eventHandler(event, true);
                    }, 50);
                } else {
                    setTimeout(() => {
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
                    // console.log('space!!!!!');
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
            }
        });
        element.on("keyup", event => {
            if (ARROWKEY_CODES.includes(event.which)) {
                arrowKeyEventHandler(event);
            }
        });
        element.on("input", () => {
            // console.log('input event');

            eventHandler(event, true);
        });
    });

    $(".langSwitch").on("change", event => {
        language = $(".langSwitch:checked + .langCode").val();
    });
});