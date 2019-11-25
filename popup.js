'use strict';

let main_btn = document.getElementById('main-btn');
let options_btn = document.getElementById('options-btn');
let connected = false;

let port = chrome.runtime.connect({name: 'popup'});

port.onMessage.addListener(function(msg) {
  connected = (msg.status == 'open')
  main_btn.textContent = connected ? '💚' : '💔'
})

main_btn.addEventListener('click',function() {
  port.postMessage(connected ? 'close' : 'open'  );
});
/*
options_btn.addEventListener('click',function() {
  chrome.runtime.openOptionsPage();
});
*/
