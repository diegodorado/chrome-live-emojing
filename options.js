// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('save');
let url = document.getElementById('url');

chrome.storage.sync.get('web_socket_url', function(data) {
  url.value = data;
  console.log(data);
});

button.addEventListener('click', function() {
  chrome.storage.sync.set({web_socket_url: url.value}, function() {
    console.log('color is ' + url);
  })
});
