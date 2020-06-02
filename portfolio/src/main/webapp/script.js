// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */ 

// function changeColor() { 
//     let x = Math.floor(Math.random() * 256);
//     let y = Math.floor(Math.random() * 256);
//     let z = Math.floor(Math.random() * 256);
//     let rgb = "rgb(" + x + "," + y + "," + z + ")";
//     document.getElementById('box').style.backgroundColor = rgb;
//     document.getElementById('color').innerHTML = rgb;
// }

// @Webservlet tells what '/' to put in fetch look at DataServlet.java

// async function getFetchRequest() {
//     const response = await fetch('/data');
//     const text = await response.text();
//     document.getElementById('fetch-text').innerText = text;
// }

function getArrayMessages() {
    fetch('/data').then(response => response.json()).then((messages) => {
    console.log(messages);
    const textId = document.getElementById('fetch-text');
    textId.innerHTML = '';
    textId.appendChild(
        createListElement('text1: ' + messages.text1));
    textId.appendChild(
        createListElement('text2: ' + messages.text2));
    textId.appendChild(
        createListElement('text3: ' + messages.text3));
    });
}

function createListElement(message) {
        const liElement = document.createElement('li');
        liElement.innerText = message;
        return liElement;
}