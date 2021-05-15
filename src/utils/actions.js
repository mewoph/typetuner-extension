export const CONSOLE_PRINT = 'console_print';
export const CHANGE_BG_COLOR = 'change_bg_color';
export const CHANGE_FONT = 'change_font';

export const sendMessagePromise = (msg) => {
  return new Promise((resolve) => {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      browser.tabs.sendMessage(tabs[0].id, { msg }).then(resolve);
    });
  })
};
