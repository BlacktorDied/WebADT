# Lab 1 - Express Project
This project is a simple web application built using Node.js, Express, and Sass. It demonstrates the use of a CSS preprocessor (Sass) and serves static files using Express.

## Structure
```
Lab_1/
├── express/
│   ├── index.html
│   ├── js/
│   │   └── jquery.js
│   ├── styles/
│   │   └── style.css
│   └── style.scss
├── node_modules/
├── server.js
├── package.json
└── .gitignore
```

### File Descriptions
- `server.js`: The main server file that sets up the Express server and middleware for serving static files and compiling Sass.
- `package.json`: Contains the project metadata and dependencies.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `express/index.html`: The main HTML file for the web application.
- `express/js/jquery.js`: JavaScript library used in the project.
- `express/styles/style.css`: The compiled CSS file.
- `express/style.scss`: The Sass file containing styles for the application.

## Prerequisites
- Node.js
- npm (Node Package Manager)

## Installation
1. Clone the repository:
```
git clone https://github.com/BlacktorDied/WebADT.git
cd Lab_1
```

2. Install the dependencies:
```
npm install
```

## How to run
1. Start the server:
```
npm start
```

2. Open your browser and navigate to http://localhost:3000 to view the application.
