import {
  CONSOLE_PRINT,
  CHANGE_BG_COLOR,
  CHANGE_FONT
} from './utils/actions';

console.log('content');

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
    document.body.style.fontFamily = value;
    if (needsResponse) {
      return Promise.resolve({ msg: `Responded: ${Date.now()}`});
    }
  }

});