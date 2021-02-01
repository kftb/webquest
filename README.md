# WebQuest
![WebQuest logo](assets/images/webquest.png?raw=true)

A silly game to deliver gifts through five riddles, implemented as learning experience with PhaserJS

## Installation

Run the index.html within the repository. 

## Usage

The core principle of the game is simple: Pick a character, answer five riddles and get a final message provided that could be a code, link or just text. 

All the text for the riddles is in <code>dialogue.json</code>. The solutions are simple MD5 hashes (lowercase). In order to set your own solutions, run them through a MD5 hasher and insert them into the dialogue.json. 

Cookies are stored and therefore players can return at a later point. 

## Known bugs

* Unfortunately, music and fonts are not properly loaded the first time. Reload the page to get the best experience. 

## Copyright

This project was a learning experience and therefore all images, assets and music in the game do not belong to me and the copyright remains with the respective copyright owners. As this is solely for demonstration purposes, please reach out if you are the copyright owner and would like to have any of these removed. 

## License
[MIT](https://choosealicense.com/licenses/mit/)