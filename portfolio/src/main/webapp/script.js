 
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
 
function initialize() {
    loadComments();
    createMap();
    fetchBlobstoreUrlAndShowForm();
}
 
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
  fetch('/blobstore-upload')
      .then((response) => response.text())
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('my-form');
        messageForm.action = imageUploadUrl;
      });
} 
 
function createImageElement(imageUploadUrl) {
    const liElement = document.createElement('li');
 
    const imgElement = document.createElement('img');
    imgElement.src = imageUploadUrl;
 
    const messageElement = document.createElement('span');
    messageElement.innerText = imageUploadUrl.message;
 
    liElement.appendChild(imgElement);
    liElement.appendChild(messageElement);
    return commentElement;
}
 
function createMap() {
  
  const map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat:  25.784, lng: -80.2267}, zoom: 16});
 
  const trexMarker = new google.maps.Marker({
    position: {lat: 25.803979, lng: -80.199256},
    map: map,
    title: 'Wynwood'
  });
 
  const trexInfoWindow =
      new google.maps.InfoWindow({content: 'This is Wynwood one of Miami hottest art district.'});
  trexInfoWindow.open(map, trexMarker);
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