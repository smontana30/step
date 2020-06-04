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

// async function getFetchRequest() {
//     const response = await fetch('/data');
//     const text = await response.text();
//     document.getElementById('fetch-text').innerText = text;
// }


function loadComments() {
    fetch('/data').then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    console.log(comments);
    comments.forEach((comment) => { 
        console.log(comment);
        commentListElement.appendChild(createListElement(comment));
    })
    });
}

function createListElement(comment) {
        const commentElement = document.createElement('li');
        commentElement.className = 'comment';

        const titleElement = document.createElement('span');
        titleElement.innerText = comment.title;
        
        commentElement.appendChild(titleElement);
        return commentElement;
}