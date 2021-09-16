The game is composed of a canvas element which will have window width and height. On that canvas we will draw using sprites, animated ravens that fly from right to left between the height of the viewport. Colliding with the top or bottom will make the ravens fly in the opposite vertical direction.


The ravens will be damaged/killed by clicking on them, so we add a click event listener, and we will perform collision detection based on color using getImageData() method which is already implemented in Vanilla JS (method called on the created canvas context). To do this type of collision detection we will need 2 canvas elements, a main one and a collision one. So we will create 2 canvas with appropriate id tags.


Ravens will be sorted by size and make the small ones appear more in depth on the canvas, while the bigger ones will be made to appear in less depth on the screen.


When killing ravens there will be an image explosion effect and sound explosion effect taking place! Game over screen will appear only when a raven reaches the left side of the screen!


Arts and Sounds:  https://opengameart.org/
Art:    https://bevouliin.com/
Raven Image:    https://frankslaboratory.co.uk/downloads/raven.png
Boom Image:    https://frankslaboratory.co.uk/downloads/boom.png

Game Art:   https://www.gamedeveloperstudio.com/

