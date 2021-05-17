export const CONSOLE_PRINT = 'console_print';
export const CHANGE_BG_COLOR = 'change_bg_color';
export const CHANGE_FONT = 'change_font';
export const LOAD_FONT = 'load_font';

export const sendMessagePromise = async (msg) => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const sendMessage = await browser.tabs.sendMessage(tabs[0].id, { msg });
  return sendMessage;
};
