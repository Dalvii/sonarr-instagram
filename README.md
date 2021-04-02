# Instagram Sonarr Bot
Script for daily Sonarr schedule publication on Instagram stories,
It will upload a story with maximum 4 items that release the same day.

## Node install
You need Node.js to run this script: [Download](https://nodejs.org/en/download/)
Then download the repo,
and type in the directory console:
```
npm install
```

## Run
```
npm run start
// or
node main.js
```

## Configuration
You need to modify the script to match what tou desire.
Configuration is in `config.json` file
```json
{
    "instaUsername": "instaUsername",                   // Instagram account username
    "instaPass": "instaPass",                           // Instagram account Password
    "sonarrApi": "sonarrApi",                           // Sonarr API Key
    "sonarrUrl": "localhost",                           // Sonarr Url
    "sonarrPort": "8989",                               // Sonarr Port
    "background_image": "./assets/background.png",      // background image of the story (1080x1920)
    "blank_image": "./assets/blank.png",                // blank image to fix image of inexistant banner in TheTVdb
    "output": "/storyOut.jpg",                          // Output file, will be erased once a day
    "font_color": "#ffffff"                             // Font Hex color
}
```

By default, the script will run automaticaly everyday at 7:00 AM, to change that, you can edit the `main.js` file, to line `18` and change the value `* * * * *` corresponding of what time you want the script to execute. ([This Site will help you](http://corntab.com/))

## Background
You can change the background of the image by changing the file `/assets/background.png` (must be 1080x1920)

## Infos
- Made by Théo Vidal
- Discord: Dalvi#3682

## Pictures

![Example 1](https://i.imgur.com/AoZ5eAO.jpg)

![Example 2](https://i.imgur.com/zfTww6f.jpg)
