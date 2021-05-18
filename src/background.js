browser.runtime.onMessage.addListener(function (request) {
  if (request.content === 'response_needed') {
    return Promise.resolve({ value: 'response from bg' });
  }
});
