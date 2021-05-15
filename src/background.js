browser.runtime.onMessage.addListener(function (request) {
  console.log('Hello from the background');
  if (request.content === 'response_needed') {
    return Promise.resolve({ value: 'response from bg' });
  }
});

// maybe include fontkit here and send font metadata back to the content?