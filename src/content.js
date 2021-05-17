import {
  CHANGE_FONT,
  LOAD_FONT,
} from './utils/actions';

browser.runtime.onMessage.addListener((request) => {
  const { msg } = request;
  if (!msg) {
    return;
  }

  const { action, value, needsResponse } = msg;
  if (action === CHANGE_FONT) {    
    const { fontFamily } = value;
    document.body.style.fontFamily = fontFamily;
    if (needsResponse) {
      return Promise.resolve({ msg: `Set ${fontFamily} at ${Date.now()}`});
    }
  
  } else if (action === LOAD_FONT) {
    const { fontFamily, url } = value;
    const fontFace = new FontFace(fontFamily, `url(${url})`);
    fontFace.load().then(loadedFont => {
        document.fonts.add(loadedFont);
    }).catch(e => {
      console.error(e);
    });
  }

});