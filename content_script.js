'use strict';

let connected = false;
let port = chrome.runtime.connect({name: 'content'});
port.onMessage.addListener(function(msg) {
  connected = (msg.status == 'open');
})


let scrapper = (n) => {
  if (n.nodeType != 1)
    return

  if (n.classList && n.classList.contains('UFILastComment')) {

    var user = n.querySelector('.UFICommentActorName');
    //get user id from data-hovercard attr
    var card = user.getAttribute('data-hovercard');

	if(card==null){
		card = n.querySelector('.UFICommentAuthorWithPresence');
		card = card.getAttribute('data-hovercard');
	}

    var id = card.match(/id=(\d*)&/)[1];
    var who = user.innerHTML;
    var text = n.querySelector('.UFICommentBody').innerHTML;
    //filter html elements
    text = text.replace(/<[^>]*>/gu, '');
	console.log(text)

    port.postMessage({
      user_id: id,
      who: who,
      text: text
    })
  }

}

var getElementText = function(el) {
  var text = '';
  // Text node (3) or CDATA node (4) - return its text
  if ((el.nodeType === 3) || (el.nodeType === 4)) {
    text = el.nodeValue;
    // If node is an element (1) and an img, input[type=image], or area element, return its alt text
  } else if ((el.nodeType === 1) && (
      (el.tagName.toLowerCase() == 'img') ||
      (el.tagName.toLowerCase() == 'area') ||
      ((el.tagName.toLowerCase() == 'input') && el.getAttribute('type') && (el.getAttribute('type').toLowerCase() == 'image'))
    )) {
    text = el.getAttribute('alt') || '';
    // Traverse children unless this is a script or style element
  } else if ((el.nodeType === 1) && !el.tagName.match(/^(script|style)$/i)) {
    var children = el.childNodes;
    for (var i = 0, l = children.length; i < l; i++) {
      text += getElementText(children[i]);
    }
  }
  return text;
};


if (document.domain == 'facebook.com') {
	let observer = new MutationObserver(function(muts) {

	  if(!connected){
		return
	  }

	  muts.forEach(function(m) {
		m.addedNodes.forEach(scrapper)
	  })
	})

	observer.observe(document, {
	  subtree: true,
	  childList: true
	})

}



