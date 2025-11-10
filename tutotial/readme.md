# Website - Customization Guide

## Setup Instructions

### 1. Install Required Software
VS Code Installation:
- Tutorial: https://youtu.be/3eCmc0t6aqA?si=TkV0bVEz_95FbMmi

Node.js Installation:
- Tutorial: https://youtu.be/uCgAuOYpJd0?si=2ICwr3Ih1P_ru9KA

Git Bash Installation:
- Tutorial: https://www.youtube.com/watch?v=iHlWb23yj6E

⚠️ VS Code, Node.js and Git Bash are required!

### 2. Open the Project

1. Open the "wish-4" folder in VS Code

2. Open terminal in VS Code (Terminal → New Terminal)

4. Type this command and press Enter:
   npm i

   after that, type this command: 

   npm run dev

   **If you get a script error on Windows, run this :**

   Set-ExecutionPolicy -Scope CurrentUser Unrestricted

   after that, try again the commands

5. You'll get a local view link
6. Ctrl + Click on the localhost link to view your website!


## 🎨 Customization Guide

### 📝 How to Change Main Content

Go to src folder. 
Go to components folder. 
go to each file
Use CTRL + F and find your text you want to customise.
Edit Each & Every File For You Customisation. 

## How to change Music 
Go to music folder. 
paste your new music there.
delete previous musics.
update your music names as music1.mp3, music2.mp3, music3.mp3

## 🌐 How to Share Your Website
Watch my tutorial:  https://youtu.be/bFCnDsQwNvA


## 🆘 Common Issues & Solutions

### ❌ "Cannot find module" errors
Solution: Run `npm install` to install all dependencies

### ❌ Images not loading
Solutions:
1. Make sure images are in `src/img/` folder
2. Check the import paths match your file names
3. Supported formats: `.jpg`, `.png`, `.gif`

### ❌ Music not playing
Solutions:
1. Check if `music.mp3` is in the `src/music/` folder
2. Some browsers block autoplay (user needs to click music button)
3. File size should be under 10MB

### ❌ Changes not showing
Solutions:
1. Save your files (Ctrl+S)
2. Hard refresh browser (Ctrl+Shift+R)