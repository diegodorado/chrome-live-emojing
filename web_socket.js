'use strict';

class WebSocketClient {
  constructor() {
    this.number = 0; // Message number
    this.autoReconnectInterval = 5 * 1000; // ms
  }

  status(){
    return (this.instance!=null && this.instance.readyState==WebSocket.OPEN) ?'open':'closed'
  }

  open(url) {
    this.url = url;
    this.instance = new WebSocket(this.url);
    this.instance.onopen = () => {
      this.onopen()
    }
    this.instance.onmessage = (data, flags) => {
      this.number++
        this.onmessage(data, flags, this.number)
    }
    this.instance.onclose = (e) => {
      switch (e.code) {
        case 1000: // CLOSE_NORMAL
          console.log("WebSocket: closed");
          break
        default: // Abnormal closure
          this.reconnect(e)
          break
      }
      this.onclose(e)
    }
    this.instance.onerror = (e) => {
      switch (e.code) {
        case 'ECONNREFUSED':
          this.reconnect(e)
          break
        default:
          this.onerror(e)
          break
      }
    }
  }

  send(data, option) {
    try {
      this.instance.send(data, option);
    } catch (e) {
      this.instance.emit('error', e);
    }
  }

  reconnect(e) {
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e)

    this.clean()

    var that = this
    setTimeout(function() {
      console.log("WebSocketClient: reconnecting...")
      that.open(that.url)
    }, this.autoReconnectInterval)
  }

  clean() {
    //remove event listeners
    delete this.instance.onopen
    delete this.instance.onmessage
    delete this.instance.onclose
    delete this.instance.onerror
    //delete websocket instance
    delete this.instance

  }

  close() {
    this.instance.close()
    this.clean()
  }

  //callbacks to be overriden
  onopen(e) {
    console.log("WebSocketClient: open", arguments)
  }

  onmessage(data, flags, number) {
    console.log("WebSocketClient: message", arguments)
  }

  onerror(e) {
    console.log("WebSocketClient: error", arguments)
  }

  onclose(e) {
    console.log("WebSocketClient: closed", arguments);
  }


}
