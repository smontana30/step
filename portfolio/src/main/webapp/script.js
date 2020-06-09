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

function changeColor() { 
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    let rgb = "rgb(" + x + "," + y + "," + z + ")";
    document.getElementById('box').style.backgroundColor = rgb;
    document.getElementById('color').innerHTML = rgb;
}

function loadComments() {
    fetch('/data').then(response => response.json()).then((comments) => {
        const commentListElement = document.getElementById('comment-list');
        comments.forEach((comment) => { 
            commentListElement.appendChild(createListElement(comment));
        });
    });
}


function fetchBlobstoreUrlAndShowForm() {
  fetch('/blobstore-upload-url')
      .then((response) => {
         return response.text();
        // const messageArea = document.getElementById('comment-list');
        // const liMessage = 
      })
      .then((imageUploadUrl) => {
        // const messageForm = document.getElementById('my-form');
        // messageForm.action = imageUploadUrl;
        // messageForm.classList.remove('hidden');
        // messageForm.style.remove('hidden');
        const commentList = document.getElementById('comment-list');
        commentList.appendChild(createImageElement(imageUploadUrl));
      });
    // fetch('/form-blob').then(response => response.json()).then((blobs) => {
    //     const commentList = document.getElementById('comment-list');
    //     blobs.forEach((blob) => { 
    //         commentList.appendChild(createImageElement(blob));
    //     });
    // });

}

function createImageElement(imageUploadUrl) {
    const liElement = document.createElement('li');

    // const messageElement = document.createElement('span');
    // messageElement.innerText = blob.message;

    const imageElement = document.createElement('img');
    imageElement.src = "imageUploadUrl";

    liElement.appendChild(imageElement);
    return liElement;
}

function createListElement(comment) {
    const commentElement = document.createElement('li');
    commentElement.className = 'comment';
    commentElement.id = comment.id;

    const nameElement = document.createElement('h3');
    nameElement.innerText = comment.name + ':';

    const titleElement = document.createElement('span');
    titleElement.innerText = comment.title;
        
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteComment(comment.id);
        commentElement.remove();
    });

    commentElement.appendChild(nameElement);
    commentElement.appendChild(titleElement);
    commentElement.appendChild(deleteButton);
    return commentElement;
}

function loadUpdatedComments() {
    const commentsId = document.getElementById('comment-list');
    commentsId.innerHTML = '';
    fetch('/data').then(response => response.json()).then((comments) => {
        const commentListElement = document.getElementById('comment-list');
        let numberComment = document.getElementById('num').value;
        for (let i = 0; i < numberComment; i++) {
            commentListElement.appendChild(createListElement(comments[i]));
        }
    });
}

function deleteAll() {
    let comments = document.querySelectorAll('.comment');
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