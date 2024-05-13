# Real Time Code Editor

[Link](https://blissful-determination-production.up.railway.app/)

## Overview

Welcome to the Real Time Code Editor! This project is designed to facilitate remote coding sessions between mentors and students. The application features a lobby page where users can choose from various code blocks and a dedicated code block page for real-time collaborative coding.

## Pages and Features

### Lobby Page

- **Title:** "Choose Challenge"
- List of 4 items representing code blocks
  - Each item named after a specific code block (e.g., "fibonacci")
  - Clicking on an item navigates the user to the corresponding code block page

### Code Block Page

- Both mentor and student users can access this page.
- The first user to open the code block page becomes the mentor; subsequent user are considered student.
- Mentor sees the chosen code block in read-only mode.
- Student can modify the code, with changes displayed in real-time using Socket.io.
- Utilizes Highlight.js for syntax highlighting - JS code only.

  
## Feature

- DataBase contain a solution for each code block.
- When the student's code matches the solution, a big smiley face is displayed.

## Deployment

The project is deployed using a microservices architecture with Railway.app

- **Client Service:** 
  - React
- **Server Service:** 
  - Node.js
- **Database Service:** 
  - MySql



