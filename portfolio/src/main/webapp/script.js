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

function loadComments() {
    fetch('/data').then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    comments.forEach((comment) => { 
        commentListElement.appendChild(createListElement(comment));
    })
    });
}

function createListElement(comment) {
    const commentElement = document.createElement('li');
    commentElement.className = 'comment';
    commentElement.id = comment.id;

    const titleElement = document.createElement('span');
    titleElement.innerText = comment.title;
        
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteComment(comment.id);
        commentElement.remove();
    });

    commentElement.appendChild(titleElement);
    commentElement.appendChild(deleteButton);
    return commentElement;
}
 function loadUpdatedComments() {
    const commentsId = document.getElementById('comment-list');
    commentsId.innerHTML = "";
    fetch('/data').then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    let numberComment = document.getElementById('num').value;
    for (let i = 0; i < numberComment; i++) {
        commentListElement.appendChild(createListElement(comments[i]));
    }
    });
 }

 function deleteAll() {
    let comments = document.querySelectorAll(".comment");
    //loops to delete every comment 
    for (let i = 0; i < comments.length; i++) {
        // pass comment id to delete not whole comment
        deleteComment(comments[i].id);
        comments[i].remove();
    }
 }

// use the comments id to delete it
function deleteComment(id) {
    const params = new URLSearchParams();
    params.append('id', id);
    fetch('/delete-comment', {method: 'POST', body: params});
}