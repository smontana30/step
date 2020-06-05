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
    const deleteAllButton = document.createElement('button');
    const deleteAllArea = document.getElementById('delete-all-area');
    comments.forEach((comment) => { 
        commentListElement.appendChild(createListElement(comment));

    })
    let commentLi = document.getElementsByClassName('comment');
    deleteAllArea.appendChild(deleteAllButton);
    deleteAllButton.addEventListener('click', () => {
        comments.forEach((comment) => {
            deleteComment(comment);
            commentLi.remove();
        })
    });

    });
}

function createListElement(comment) {
        const commentElement = document.createElement('li');
        commentElement.className = 'comment';

        const titleElement = document.createElement('span');
        titleElement.innerText = comment.title;
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteComment(comment);
            commentElement.remove();
        });

        commentElement.appendChild(titleElement);
        commentElement.appendChild(deleteButton);
        return commentElement;
}
 function loadUpdatedComments() {
     fetch('/data').then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    let numberComment = document.getElementById('num').value;
    console.log("number of comments shown is " + numberComment);
    for (let i = 0; i < numberComment; i++) {
        commentListElement.appendChild(createListElement(comments[i]));
        console.log(comments[i])
    }
    });
 }

 function deleteAll() {
     let comments = document.querySelectorAll("comment");
     console.log(comments);
     console.log("before for loop");
     //loops to delete every comment
     for (let i = 0; i < comments.length; i++) {
         console.log("in for loop");
         console.log(comments[i]);
        //comments.parentNode.removeChild(comments[i]);
        deleteComment(comments[i]);
        comments[i].remove();
     }
     
 }

function deleteComment(comment) {
    const params = new URLSearchParams();
    params.append('id', comment.id);
    fetch('/delete-comment', {method: 'POST', body: params});
}