import { get_fr } from './lang/frLib.mjs';

export const getCursorXY = (input) => {
  const inputHtml = input[0];
  const inputParent = input.parent();

  const caretPosition = {
    cursorStart: inputHtml.selectionStart,
    cursorEnd: inputHtml.selectionEnd
  }
  // initiate the selectionpoint
  let cursorStart = caretPosition.cursorStart;
  let cursorEnd = caretPosition.cursorEnd;
  let selectionPoint = cursorStart == cursorEnd ? cursorStart : Math.ceil((cursorStart + cursorEnd) / 2);

  // get the character under caret
  if (cursorStart == cursorEnd) cursorStart = cursorEnd == 0 ? 0 : (cursorStart - 1);
  const inputString = inputHtml.value;
  const currentCharacter = inputString.slice(cursorStart, cursorEnd);

  // get options from library
  const options = currentCharacter.length == 1 ? get_fr(currentCharacter) : null;

  let helperDiv = $('.helperDiv')[0] ? $('.helperDiv')[0] : null;

  // closeBtn event handler
  const closeBtnMouseDownHandler = event => {
    event.stopPropagation();
    input.off('blur');
  }
  const closeBtnClickedHandler = helperDiv => {
    helperDiv.remove();
    input.off('keyup', keyupEventHandler);
    input.off('keydown', keydownEventHandler);
  };

  // onblur event handler
  const onBlurHandler = helperDiv => {
    closeBtnClickedHandler(helperDiv);
    console.log('blur');
  };

  // add key press event handler
  const keyupEventHandler = event => {
    if (document.getElementById(event.which)) {
      event.preventDefault();
      console.log($(event.which));
      console.log(`#${event.which}`);
      $(`#${event.which}`).mouseup();
    }
  };

  const keydownEventHandler = event => {
    if (document.getElementById(event.which)) {
      event.preventDefault();
      document.getElementById(event.which).style.backgroundColor = 'rgb(78, 161, 216)';
    }
  };

  // cog onclick handler
  const settingBtnClickedHandler = event => {
    event.stopPropagation();
    input.off('blur');
    let display = $('.settingMenuWrapper').css('display');
    const position = $('.helperDiv')[0].classList.contains('helperDiv-bottom');
    console.log(position);
    if (display == 'none') {
      const menuHeight = $('.settingMenuWrapper').outerHeight();
      let helperY = $('.helperDiv').css('top').slice(0, -2);
      helperY = parseInt(helperY);
      $('.settingMenuWrapper').css({ 'display': 'flex' });
      const currentY = position ? helperY : helperY - menuHeight;
      $('.helperDiv').css({'top': currentY});
    }
    if (display == 'flex') {
      const menuHeight = $('.settingMenuWrapper').outerHeight();
      let helperY = $('.helperDiv').css('top').slice(0, -2);
      helperY = parseInt(helperY);
      const currentY = position ? helperY : helperY + menuHeight;
      $('.helperDiv').css({'top': currentY});
      $('.settingMenuWrapper').css({ 'display': 'none' });
    };
  }

  // remove helperDiv function
  const removeHelper = (helperDiv) => {
    helperDiv.remove();
    input.off('keyup', keyupEventHandler);
    input.off('keydown', keydownEventHandler);
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
  }

  // helper content creating function
  const createOptions = (helperDiv, helperContent) => {
    $(helperContent).empty();

    let className = 'helperOptions';
    // map options to buttons
    options.map((char, index) => {
      let key = (index + 49);

      // create options as buttons
      let helperOptions = document.createElement('button');
      helperOptions.className = className;
      helperOptions.id = key;
      helperOptions.style.fontSize = '1rem';

      // helperOptions.style.fontWeight = 'bold';
      let text = document.createTextNode(char);
      helperOptions.appendChild(text);
      helperContent.appendChild(helperOptions);

      // create tip spans
      let tip = document.createElement('small');
      tip.className = 'tips_windows';
      tip.innerHTML = (index + 1);

      helperOptions.prepend(tip);

      // add click event listener
      const mouseDownHandler = event => {
        event.stopPropagation();
        input.off('blur');
      };

      const mouseUpHandler = event => {
        let newString = inputString.slice(0, cursorStart) + char + inputString.slice(cursorEnd);
        inputHtml.value = newString;
        removeHelper(helperDiv);
        inputHtml.focus();
      }

      $(helperOptions).on('mousedown', mouseDownHandler);
      $(helperOptions).on('mouseup', mouseUpHandler);

    });
  };

  // display writing helper

  if (options !== null) {
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
    const textContent = inputValue.substr(0, selectionPoint).slice(0, -1);

    // assign content
    span.textContent = inputValue.substr(selectionPoint) + '.' || '.';
    cloneField.textContent = textContent;

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

    const {
      offsetLeft: ipX,
      offsetTop: ipY,
      offsetWidth: ipWidth,
      offsetHeight: ipHeight
    } = inputParent[0];

    cloneField.remove();

    // create helper box
    let helperContent = $('.helperContent')[0] || null;
    if (helperDiv === null) {
      helperDiv = document.createElement('div');
      helperDiv.className = 'helperDiv';
      inputParent.append(helperDiv);

      // option container
      helperContent = document.createElement('div');
      helperContent.className = 'helperContent';
      helperDiv.append(helperContent);

      // button set container
      const btnSet = document.createElement('div');
      btnSet.className = 'btnSet';
      helperDiv.append(btnSet);

      // setting menu container
      const settingMenuWrapper = document.createElement('div');
      settingMenuWrapper.className = 'settingMenuWrapper';
      const menuContent = createDropdown();
      settingMenuWrapper.appendChild(menuContent);
      helperDiv.append(settingMenuWrapper);

      // setting button
      const settingBtn = document.createElement('button');
      settingBtn.className = 'setttingBtn';
      settingBtn.innerHTML = '<i class="fas fa-cog"></i>';
      btnSet.appendChild(settingBtn);
      $(settingBtn).on('mousedown', settingBtnClickedHandler);


      // closeBtn 
      const closeBtn = document.createElement('button');
      closeBtn.className = 'helperCloseBtn';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      btnSet.appendChild(closeBtn);
      closeBtn.addEventListener('mousedown', closeBtnMouseDownHandler);
      closeBtn.addEventListener('mouseup', () => closeBtnClickedHandler(helperDiv));

    }
    createOptions(helperDiv, helperContent);

    const {
      offsetWidth: helperWidth,
      offsetHeight: helperHeight
    } = helperDiv;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // styling
    let leftPosition = ipX + spanX - 16;
    let spanW = ipX + spanX + helperWidth;
    let topPosition = (cloneFieldHeight - helperHeight - spanHeight - 10);
    let topToWindow = Math.abs(spanY - inputHeight - ipY);
    if (span.textContent !== '.') {
      topToWindow = Math.abs(spanHeight - ipY);
    }
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

    if (inputHtml.tagName === 'INPUT') {
      if ((spanW - helperWidth) >= inputWidth && (inputWidth + helperWidth) < windowWidth) {
        leftPosition = ipX + inputWidth;
      }
      if (spanW >= windowWidth && (inputWidth + helperWidth) > windowWidth) {
        leftPosition = windowWidth - helperWidth - ipX;
      }
    }

    if (inputHtml.tagName === 'TEXTAREA') {
      if (spanW >= windowWidth) {
        leftPosition = windowWidth - helperWidth - ipX;
      }
    }

    helperDiv.style.left = `${leftPosition}px`;
    helperDiv.style.top = `${topPosition}px`;

    // add key press event listener
    input.on('keyup', keyupEventHandler);
    input.on('keydown', keydownEventHandler);
    // input.one("blur", () => onBlurHandler(helperDiv));
  } else {
    if (helperDiv !== null) {
      removeHelper(helperDiv);
    }
  };
};