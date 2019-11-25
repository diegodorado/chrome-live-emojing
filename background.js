'use strict';

let popupPort = null
let contentPort = null
let wsc = new WebSocketClient()

console.log('live-emojingv3');

let open = () => {
  chrome.storage.sync.get({
    web_socket_url: 'ws://localhost:1337'
  }, (r) => {
    wsc.open(r.web_socket_url)
  })
}

let inform = () => {
  if(popupPort!=null){
    popupPort.postMessage({
      status: wsc.status()
    })
  }
  if(contentPort!=null){
    contentPort.postMessage({
      status: wsc.status()
    })
  }

}

wsc.onopen = inform
wsc.onclose = inform
wsc.onerror = inform


chrome.runtime.onConnect.addListener((p) => {
  if(p.name=='popup'){
    p.onMessage.addListener((msg) => {
      if (msg == 'open') {
        open()
      } else{
        wsc.close()
      }
    })
    p.onDisconnect.addListener( () => popupPort = null)
    popupPort = p
  }

  if(p.name=='content'){
    p.onMessage.addListener((msg) => {
      wsc.send(JSON.stringify(msg))
    })
    p.onDisconnect.addListener( () => contentPort = null)
    contentPort = p
  }

  inform()

})
