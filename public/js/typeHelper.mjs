import { get_fr } from './lang/frLib.mjs';
import { get_zh } from './lang/zhLib.mjs';
import { get_de } from './lang/deLib.mjs';
import { get_es } from './lang/esLib.mjs';
import { get_it } from './lang/itLib.mjs';
import { get_el } from './lang/elLib.mjs';

let language = 'fr';
let mode = 'test';
let autoSelect = false;
let helperDiv = $('.helperDiv')[0] ? $('.helperDiv')[0] : null;
let pageNum = 0;
let highlightOption = 49;
// get options from library
const getOptions = (str, callback) => {
  if (str.length != 0) {
    switch (language) {
      case 'de':
        autoSelect = false;
        callback(get_de(str) || null);
        break;
      case 'es':
        autoSelect = false;
        callback(get_es(str) || null);
        break;
      case 'fr':
        autoSelect = false;
        callback(get_fr(str) || null);
        break;
      case 'it':
        autoSelect = false;
        callback(get_it(str) || null);
        break;
      case 'el':
        autoSelect = true;
        callback(get_el(str) || null);
        break;
      case 'zh':
        autoSelect = false;
        if (get_zh(str)) {
          const result = get_zh(str) || null;
          callback(result);
        }
        // $.get("https://www.google.com/inputtools/request?ime=pinyin&ie=utf-8&oe=utf-8&app=translate&num=10&text=" + str, function (data, status) {
        //   if (data[0] === "SUCCESS") {
        //     console.log(data);

        //     const result = {
        //       resultString: str,
        //       partEnd: str.length,
        //       result: data[1][0][1],
        //       strL: str.length
        //     }
        //     callback(result);
        //   } else {
        //     return null;
        //   }
        // });
        break;
      default:
        return null;
    }
  }
  return null;
};

// closeBtn event handler
const closeBtnMouseDownHandler = event => {
  event.stopPropagation();
  event.elements.input.off('blur');
};

const closeBtnClickedHandler = event => {
  if (event.elements.helperDiv) event.elements.helperDiv.remove();
  event.elements.input.off('.basicKeyEvents');
};

const keyValidityCheck = keycode => {
  // console.log(keycode);
  const inputKeys = [192, 219, 221, 220, 186, 222, 188, 190, 191];
  if (autoSelect && !(keycode >= 48 && keycode <= 57) && !(keycode >= 65 && keycode <= 90)) {
    const valid = inputKeys.includes(keycode);
    return valid;
  }
  if (autoSelect && (keycode >= 65 && keycode <= 90)) {
    return true;
  }
  return false;
};

// add key press event handler
const keyupEventHandler = event => {
  let keycode = event.which || event.keyCode;
  if (event.shiftKey === false) {
    if (document.getElementById(keycode)) {
      event.preventDefault();
      // console.log(`#${keycode}`);
      $(`#${keycode}`).mouseup();
      $('body').off('.basicKeyEvents');
      event.input.off('.basicKeyEvents');
      event.helperDiv.remove();
    }
  }
  if (keycode == 32 || keycode == 13) {
    console.log(highlightOption);
    if (language == 'el') {
      event.preventDefault();
      $('#' + highlightOption).mouseup();
    }
    if ((language == 'de' || language == 'es' || language == 'fr' || language == 'it') && highlightOption == 49) { }
    if (highlightOption != 49) {
      event.preventDefault();
      $('#' + highlightOption).mouseup();
    }
  }
};

const keydownEventHandler = event => {
  let keycode = event.which || event.keyCode;
  // number key pressed
  if (event.shiftKey === false && keycode >= 48 && keycode <= 57) {
    if (document.getElementById(keycode)) {
      event.preventDefault();
      $('#' + keycode).css({ 'background-color': 'rgb(78, 161, 216)' });
    }
    return;
  }

  if (keycode == 189) {
    event.preventDefault();
    $('#prevPageCtrl').mouseup();
  }

  if (keycode == 187) {
    event.preventDefault();
    $('#nextPageCtrl').mouseup();
  }

  // space key and enter key pressed
  if (keycode == 32 || keycode == 13) {
    console.log(language);
    if ((language == 'de' || language == 'es' || language == 'fr' || language == 'it') && highlightOption == 49) {
      console.log('add a space!!!');
      return;
    } else {
      event.preventDefault();
      $('#' + highlightOption).css({ 'background-color': 'rgb(78, 161, 216)' });
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
      $('#prevPageCtrl').mouseup();
      // }
    }
    // console.log(highlightOption);
    return;
  }

  if (keycode == 40) {
    event.preventDefault();
    if (highlightOption - 49 < (event.pages[pageNum][1] - event.pages[pageNum][0])) {
      // event.preventDefault();
      highlightOption = highlightOption + 1;
      setHighlight(highlightOption);
    } else {
      // event.preventDefault();
      $('#nextPageCtrl').mouseup();
    }
    console.log(highlightOption);
    // console.log(event.pages + '/' + pageNum + '/' + event.pages[pageNum][1] + '/' + highlightOption);
    return;
  }

  // other key check
  const valid = keyValidityCheck(keycode);
  console.log(valid);
  if (valid) $('#49').mouseup();
};

// cog onclick handler
const settingBtnClickedHandler = event => {
  event.stopPropagation();
  event.elements.input.off('blur');
  let display = $('.settingMenuWrapper').css('display');
  const position = $('.helperDiv')[0].classList.contains('helperDiv-bottom');

  if (display == 'none') {
    const menuHeight = $('.settingMenuWrapper').outerHeight();
    let helperY = $('.helperDiv').css('top').slice(0, -2);
    helperY = parseInt(helperY);
    $('.settingMenuWrapper').css({ 'display': 'flex' });
    const currentY = position ? helperY : helperY - menuHeight;
    $('.helperDiv').css({ 'top': currentY });
  }
  if (display == 'flex') {
    const menuHeight = $('.settingMenuWrapper').outerHeight();
    let helperY = $('.helperDiv').css('top').slice(0, -2);
    helperY = parseInt(helperY);
    const currentY = position ? helperY : helperY + menuHeight;
    $('.helperDiv').css({ 'top': currentY });
    $('.settingMenuWrapper').css({ 'display': 'none' });
  };
};

// remove helperDiv function
const removeHelper = (helperDiv, input) => {
  helperDiv.remove();
  input.off('.basicKeyEvents');
};

// setting drop down list active function
const createDropdown = () => {
  const menu = document.createElement('div');
  const mc = document.createElement('span');
  const mctext = document.createTextNode('More coming');
  mc.appendChild(mctext);
  menu.appendChild(mc);
  menu.className = 'dropdown-menu';
  return menu;
};

// helper content creating function
const createOptions = (
  helperDiv,
  helperContent,
  options,
  input,
  cursorStart,
  cursorEnd,
  pages,
  mode = 'new'
) => {
  $(helperContent).empty();
  highlightOption = 49;
  if (mode == 'new') pageNum = 0;
  if (mode == 'pageChange') { };
  const inputHtml = input[0];
  const inputString = inputHtml.value;
  let className = 'helperOptions';
  // map options to buttons
  if (options.result !== null) {
    mapOptionToBtn(
      helperDiv,
      cursorStart,
      cursorEnd,
      pages,
      className,
      inputString,
      options,
      helperContent,
      input
    );
  }
};

const mapOptionToBtn = (
  helperDiv,
  cursorStart,
  cursorEnd,
  pages,
  className,
  inputString,
  options,
  helperContent,
  input
) => {
  const start = pages[pageNum][0];
  const end = pages[pageNum][1] + 1;
  console.log(pageNum + '/' + start + '/' + end);

  if (helperContent) {
    options.result.slice(start, end).map((char, index) => {
      let key = (index + 49);
      console.log(index);

      // create options as buttons
      let helperOptions = document.createElement('button');
      helperOptions.className = className;
      helperOptions.id = key;
      helperOptions.style.fontSize = '1rem';

      let text = document.createTextNode(char);
      helperOptions.appendChild(text);
      helperContent.appendChild(helperOptions);

      // create tip spans
      let tip = document.createElement('small');
      tip.className = 'tips_windows';
      tip.innerHTML = (index + 1);

      helperOptions.prepend(tip);

      $(helperOptions).on('mousedown', () => {
        event.muAssets = {
          input: input
        }
        mouseDownHandler(event);
      });
      $(helperOptions).on('mouseup', event => {
        event.muAssets = {
          helperDiv: helperDiv,
          cursorStart: cursorStart,
          cursorEnd: cursorEnd,
          input: input,
          options: options,
          inputString: inputString,
          char: char
        }
        mouseUpHandler(event);
      });

      // default option highlight
      setHighlight();
    });
  }
};

// selection highlight
const setHighlight = (option = 49) => {
  $('.helperOptions').css({ 'background-color': 'white' });
  $('#' + option).css({ 'background-color': 'rgb(78, 161, 216)' });
}

// pagination event handlers
const prevPageEventHandler = (event, callback) => {
  const pages = event.pages;
  const input = event.input;
  event.stopPropagation();
  input.off('blur');
  if (pages.length > 1) {
    if ((pageNum - 1) >= 0) {
      pageNum = pageNum - 1;
      callback();
    }
  }
};

const nextPageEventHandler = (event, callback) => {
  const pages = event.pages;
  const input = event.input;
  event.stopPropagation();
  input.off('blur');
  if (pages.length > 1) {
    if ((pageNum + 1) <= (pages.length - 1)) {
      pageNum = pageNum + 1;
      callback();
    }
  }
};

// add click event listener
const mouseDownHandler = event => {
  event.muAssets.input.off('blur');
  event.stopPropagation();
};

const mouseUpHandler = event => {
  event.muAssets.input.off('blur');
  event.stopPropagation();
  const inputHtml = event.muAssets.input[0];
  let wordStart, wordEnd, newString;
  if (event.muAssets.cursorStart == event.muAssets.cursorEnd) {
    wordStart = event.muAssets.cursorStart - event.muAssets.options.strL;
    wordEnd = wordStart + event.muAssets.options.partEnd;
    newString = event.muAssets.inputString.slice(0, wordStart) + event.muAssets.char + event.muAssets.inputString.slice(wordEnd);
  } else {
    let selectedString = event.muAssets.inputString.slice(event.muAssets.cursorStart, event.muAssets.cursorEnd);
    let modifiedSelectedString = selectedString.replace(event.muAssets.options.resultString, event.muAssets.char);
    newString = event.muAssets.inputString.slice(0, event.muAssets.cursorStart) + modifiedSelectedString + event.muAssets.inputString.slice(event.muAssets.cursorEnd);
  }
  inputHtml.value = newString;
  removeHelper(event.muAssets.helperDiv, event.muAssets.input);
  // event.muAssets.input.focus();
}

const getInputSL = inputHtml => {
  let { cursorStart, cursorEnd } = {
    cursorStart: inputHtml.selectionStart,
    cursorEnd: inputHtml.selectionEnd
  }
  // get the character under caret
  if (cursorStart == cursorEnd) cursorStart = cursorEnd == 0 ? 0 : (cursorStart - 1);
  const inputString = inputHtml.value;
  const currentCharacter = inputString.slice(cursorStart, cursorEnd);
  // console.log(currentCharacter);

  return {
    currentCharacter: currentCharacter,
    cursorStart: cursorStart,
    cursorEnd: cursorEnd
  };
};

const getInputML = inputHtml => {
  let { cursorStart, cursorEnd } = {
    cursorStart: inputHtml.selectionStart,
    cursorEnd: inputHtml.selectionEnd
  }
  let start, end;
  if (cursorStart == cursorEnd) {
    start = 0;
    end = cursorEnd;
  } else {
    start = cursorStart;
    end = cursorEnd;
  }
  const inputString = inputHtml.value.slice(start, end);

  // const patt = new RegExp('([a-zA-Z]*)', 'g');
  const patt = /([a-zA-Z]+)/gi;
  let temp;
  let charArray = [];
  do {
    temp = patt.exec(inputString);
    if (temp) {
      const infoObj = {
        string: temp[0],
        index: patt.lastIndex
      }
      charArray.push(infoObj);
    }
  } while (temp);

  let currentCharacter;
  if (charArray.length > 0) {
    if (charArray[charArray.length - 1].index !== inputString.length) {
      currentCharacter = null;
    } else {
      currentCharacter = charArray[charArray.length - 1].string;
    }
  } else {
    currentCharacter = null;
  }

  return {
    currentCharacter: currentCharacter,
    cursorStart: cursorStart,
    cursorEnd: cursorEnd
  };
};

// default export function
export const writingHelper = (input, lang) => {
  language = lang;

  helperDiv = $('.helperDiv')[0] ? $('.helperDiv')[0] : null;

  const inputHtml = input[0];
  const inputParent = input.parent();

  let getCurrentCharacter;

  if (language === 'zh') {
    getCurrentCharacter = () => getInputML(inputHtml);
  } else {
    getCurrentCharacter = () => getInputSL(inputHtml);
  }
  if (inputHtml.value) {
    var { currentCharacter, cursorStart, cursorEnd } = getCurrentCharacter();
  } else {
    var currentCharacter = null;
  }
  // get options from library
  let pages = [];
  if (currentCharacter !== null) {
    getOptions(currentCharacter, (options) => {
      console.log(options);
      let index = 0;
      let pageStart = 0;
      // display writing helper
      if (options !== null && options.result !== null) {
        // pagination
        for (let i = 0; i < options.result.length; i++) {
          let a = 0;
          if (i != 0) a = 1;
          if (i % 6 == 0) {
            if (pageStart + 6 + a < options.result.length) {
              pages[index] = [pageStart + a, pageStart + 6 + a];
              pageStart = pageStart + 6 + a;
              index++;
            } else {
              pages[index] = [pageStart + a, options.result.length - 1];
            }
          }
        }
        console.log(pages);


        // create the clone and configure the style
        const parent = inputHtml.parentElement;
        const cloneField = document.createElement('div');
        const copyStyle = getComputedStyle(inputHtml);
        for (const prop of copyStyle) { cloneField.style[prop] = copyStyle[prop]; }
        if (inputHtml.tagName === 'TEXTAREA') cloneField.style.height = 'auto';
        if (inputHtml.tagName === 'INPUT') cloneField.style.width = 'auto';
        // create span for locating caret on screen
        const span = document.createElement('span');

        // replace spaces in the textcontent
        const swap = '.';
        const inputValue = inputHtml.tagName === 'INPUT' ? inputHtml.value.replace(/ /g, swap) : inputHtml.value;
        const textContent = inputValue.substr(0, cursorEnd).slice(0, -1);

        // assign content
        cloneField.textContent = textContent;
        span.textContent = inputValue.substr(cursorEnd) + '.' || '.';

        cloneField.appendChild(span);
        parent.appendChild(cloneField);

        // get position of wrapper of the rest of cloned content
        const {
          offsetLeft: spanX,
          offsetTop: spanY,
          offsetWidth: spanWidth,
          offsetHeight: spanHeight
        } = span;

        // get position of clone div
        const {
          offsetLeft: cloneFieldX,
          offsetTop: cloneFieldY,
          offsetWidth: cloneFieldWidth,
          offsetHeight: cloneFieldHeight
        } = cloneField;

        // get position of input fields
        const {
          offsetLeft: inputX,
          offsetTop: inputY,
          offsetWidth: inputWidth,
          offsetHeight: inputHeight
        } = inputHtml;

        // get position of the parent element of input fields
        const {
          offsetLeft: ipX,
          offsetTop: ipY,
          offsetWidth: ipWidth,
          offsetHeight: ipHeight
        } = inputParent[0];

        // remove clone
        cloneField.remove();

        // create helper box
        let helperContent = $('.helperContent')[0] || null;

        if (helperDiv === null) {
          console.log('new helper Div');

          helperDiv = document.createElement('div');
          helperDiv.className = 'helperDiv';
          inputParent.append(helperDiv);

          // option container
          helperContent = document.createElement('div');
          helperContent.className = 'helperContent';

          // button set container
          const btnSet = document.createElement('div');
          btnSet.className = 'btnSet';

          // page controller container
          const pageCtrl = document.createElement('div');
          pageCtrl.className = 'pageCtrl';
          if (pages.length <= 1) {
            pageCtrl.style.display = 'none';
          }

          // first row wrapper
          const firstRowWrapper = document.createElement('div');
          $(firstRowWrapper).css({ 'margin': '0', 'padding': '0', 'border': 'none', 'display': 'inline-flex', 'justify-content': 'space-between' });
          firstRowWrapper.append(helperContent);
          if (pages.length > 1) firstRowWrapper.append(pageCtrl);
          firstRowWrapper.append(btnSet);
          helperDiv.append(firstRowWrapper);

          if (pages.length > 1) {
            // page up button
            const prevPage = document.createElement('button');
            prevPage.className = 'pageCtrl';
            prevPage.id = 'prevPageCtrl';
            prevPage.innerHTML = '<i class="fas fa-caret-left"></i>';
            pageCtrl.append(prevPage);
            $(prevPage).on('mousedown', (event) => {
              event.stopPropagation();
              input.off('blur');
            });
            $(prevPage).on('mouseup', event => {
              event.input = input;
              event.pages = pages;
              console.log('prev');
              prevPageEventHandler(event, () => {
                input.focus();
                createOptions(helperDiv, helperContent, options, input, cursorStart, cursorEnd, pages, 'pageChange');
                optionStyling();
              });
            });

            // page down button
            const nextPage = document.createElement('button');
            nextPage.className = 'pageCtrl';
            nextPage.id = 'nextPageCtrl';
            nextPage.innerHTML = '<i class="fas fa-caret-right"></i>';
            pageCtrl.append(nextPage);
            $(nextPage).on('mousedown', (event) => {
              event.stopPropagation();
              input.off('blur');
            });
            $(nextPage).on('mouseup', event => {
              event.input = input;
              event.pages = pages;
              console.log('next');
              nextPageEventHandler(event, () => {
                input.focus();
                createOptions(helperDiv, helperContent, options, input, cursorStart, cursorEnd, pages, 'pageChange');
                optionStyling();
              });
            });
          }

          // setting button
          const settingBtn = document.createElement('button');
          settingBtn.className = 'settingBtn';
          settingBtn.innerHTML = '<i class="fas fa-cog"></i>';
          btnSet.appendChild(settingBtn);
          $(settingBtn).on('mousedown', (event) => {
            event.elements = { input: input };
            settingBtnClickedHandler(event);
            input.focus();
          });
          $(settingBtn).on('mouseup', (event) => {
            input.focus();
          });

          // closeBtn 
          const closeBtn = document.createElement('button');
          closeBtn.className = 'helperCloseBtn';
          closeBtn.innerHTML = '<i class="fas fa-times"></i>';
          btnSet.appendChild(closeBtn);
          closeBtn.addEventListener('mousedown', (event) => {
            event.elements = { input: input };
            closeBtnMouseDownHandler(event);
          });
          closeBtn.addEventListener('mouseup', (event) => {
            event.elements = {
              input: input,
              helperDiv: helperDiv
            };
            closeBtnClickedHandler(event);
          });

          // setting menu container
          const settingMenuWrapper = document.createElement('div');
          settingMenuWrapper.className = 'settingMenuWrapper';
          const menuContent = createDropdown();
          settingMenuWrapper.appendChild(menuContent);
          helperDiv.append(settingMenuWrapper);

          // add key press event listener
          const basicKeyEventListener = () => {
            input.on('keyup.basicKeyEvents', event => {
              event.pages = pages;
              event.helperDiv = helperDiv;
              event.input = input;
              keyupEventHandler(event);
            });
            input.on('keydown.basicKeyEvents', event => {
              event.pages = pages;
              keydownEventHandler(event);
            });
            if (mode !== 'test') {
              input.one("blur", event => {
                event.elements = {
                  input: input,
                  helperDiv: helperDiv
                };
                closeBtnClickedHandler(event);
              });
            }
          };
          basicKeyEventListener();
        } else {

        }
        createOptions(helperDiv, helperContent, options, input, cursorStart, cursorEnd, pages);

        const {
          offsetWidth: helperWidth,
          offsetHeight: helperHeight
        } = helperDiv;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // styling and positioning
        let leftPosition = ipX + spanX - 16;
        let spanW = ipX + spanX + helperWidth;
        let topPosition = (cloneFieldHeight - helperHeight - spanHeight - 10);
        let topToWindow = Math.abs(spanY - inputHeight - ipY);
        if (span.textContent !== '.') {
          topToWindow = Math.abs(spanHeight - ipY);
        }

        const optionStyling = () => {
          if (topToWindow <= helperHeight) {
            topPosition = (cloneFieldHeight);
            $('.helperDiv').addClass('helperDiv-bottom');
            $('.helperOptions').addClass('helperOptions-bottom');
            $('.helperDiv').removeClass('helperDiv-top');
            $('.helperOptions').removeClass('helperOptions-top');
          } else {
            $('.helperDiv').removeClass('helperDiv-bottom');
            $('.helperOptions').removeClass('helperOptions-bottom');
            $('.helperDiv').addClass('helperDiv-top');
            $('.helperOptions').addClass('helperOptions-top');
          }
        };
        optionStyling();

        if (inputHtml.tagName === 'INPUT') {
          // input field with full length string
          if ((spanW - helperWidth) >= inputWidth && (inputWidth + helperWidth) < windowWidth) {
            leftPosition = inputWidth;
          }
          // full width input field
          if (spanW >= windowWidth && (inputWidth + helperWidth) > windowWidth) {
            leftPosition = windowWidth - helperWidth - ipX;
          }
        }

        if (inputHtml.tagName === 'TEXTAREA') {
          // full width text area
          if (spanW >= windowWidth) {
            leftPosition = windowWidth - helperWidth - ipX;
          }
        }

        helperDiv.style.left = `${leftPosition}px`;
        helperDiv.style.top = `${topPosition}px`;

      } else {
        if (helperDiv !== null) {
          removeHelper(helperDiv, input);
        }
      };
    });
  } else {
    if (helperDiv !== null) {
      removeHelper(helperDiv, input);
    }
  };
};