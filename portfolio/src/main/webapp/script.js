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

// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelector('#changeColor').onclick = function() {
//         let x = Math.floor(Math.random() * 256);
//         let y = Math.floor(Math.random() * 256);
//         let z = Math.floor(Math.random() * 256);
//         let rgb = "rgb(" + x + "," + y + "," + z + ")";
//         console.log(rgb);

//         document.body.style.background = rgb;
//     }
// });

function changeColor() { 
    // let randHexCode = Math.floor( Math.random() * 16777215).toString(16);
    // let newColor = "#" + randHexCode;
    // document.getElementById('box').style.backgroundColor = newColor;
    // document.getElementById('box').style.background = newColor;

    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    let rgb = "rgb(" + x + "," + y + "," + z + ")";
    document.getElementById('box').style.backgroundColor = rgb;
    document.getElementById('color').innerHTML = rgb;
}
