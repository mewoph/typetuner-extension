const getTimestamp = () => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const applyToTags = (tags, fn) => {
  tags.forEach(tagName => {
    document.querySelectorAll(tagName).forEach(el => fn(el));
  });
};

const applyOriginalFont = (el) => {
  el.removeAttribute('style');
};

export const loadFont = async (fontFamily, url) => {
  const fontFace = new FontFace(fontFamily, `url(${url})`);
  let responseMsg;
  try {
    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);
    responseMsg = `Loaded ${fontFamily} at ${getTimestamp()}`;
  } catch(e) {
    console.error(e);
    responseMsg = e.message;
  }
  return { message: responseMsg };
};

export const changeFontFamily = (fontFamily, tags) => {
  // TODO: Use CSS classes?
  applyToTags(tags, el => {
    if (!el.dataset.fontOverrides) {
      el.dataset.fontOverrides = true;
    }
    el.style.fontFamily = fontFamily;
  });
  return { message: `Set font-family: ${fontFamily} for ${tags} at ${getTimestamp()}`};
};

export const changeFontVariationSettings = (fontVariationSettings, tags) => {
  applyToTags(tags, el => {
    el.style.fontVariationSettings = fontVariationSettings;
  });
  return { message: `Set font-varation-settings: ${fontVariationSettings} at ${getTimestamp()}` };
};

export const restoreOriginalStyle = (tag) => {
  const selector = tag ? tag : '[data-font-overrides]';
  const nodes = document.querySelectorAll(selector);
  nodes.forEach(node => applyOriginalFont(node));
  return { message: `Restore original font for ${tag} at ${getTimestamp()}` };
};

export const toggleInvert = (isInverted) => {
  const filterValue = isInverted ? 'invert(1)' : '';
  // If page doesn't have a background color set, invert won't work.
  if (getComputedStyle(document.documentElement).backgroundColor === 'rgba(0, 0, 0, 0)') {
    document.documentElement.style.background = 'white';
  }
  document.documentElement.style.filter = filterValue;
  // Un-invert images, TODO: background images?
  applyToTags(['img'], el => el.style.filter = filterValue);
  return { message: `Toggle invert to ${isInverted} at ${getTimestamp()}`};
};

export const toggleJustification = (isJustified, tags) => {
  applyToTags(tags, el => {
    el.style.textAlign = isJustified ? 'justify' : '';
  });
  return { message: `Toggle justification to ${isJustified} at ${getTimestamp()}`};
};

export const updateMaxWidth = (maxWidth, tags) => {
  applyToTags(tags, el => {
    el.style.maxWidth = `${maxWidth}px`;
  });
  return { message: `Set max-width: ${maxWidth} for ${tags} at ${getTimestamp()}`};
};