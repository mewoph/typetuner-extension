import {
  CONSOLE_PRINT,
  CHANGE_BG_COLOR,
  CHANGE_FONT,
  LOAD_FONT
} from './utils/actions';

browser.runtime.onMessage.addListener((request) => {
  const { msg } = request;
  if (!msg) {
    return;
  }
  console.log(msg);

  const { action, value, needsResponse } = msg;
  if (action === CONSOLE_PRINT) {
    console.log('message', value);

  } else if (action === CHANGE_BG_COLOR) {
    document.body.style.background = value;

  } else if (action === CHANGE_FONT) {
    // TODO: proper metadata
    document.body.style.fontFamily = 'testfont';
    if (needsResponse) {
      return Promise.resolve({ msg: `Responded: ${Date.now()}`});
    }
  
  } else if (action === LOAD_FONT) {
    // TODO: proper metadata
    const fontFace = new FontFace('testfont', `url(${value})`);
    fontFace.load().then(loadedFont => {
        document.fonts.add(loadedFont);
    }).catch(e => {
      console.error(e);
    });
  }

});