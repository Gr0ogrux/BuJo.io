![BuJo.io Logo](./img/BuJoLogo.png)

# BuJo.io
**Digital mindfulness via rapid logging.** A minimalist, web-based bullet journal application designed to bridge the gap between analog productivity and digital convenience.

## What is a Bullet Journal?
The Bullet Journal is a versatile analog organization system developed by New York designer Ryder Carroll. Described as a way to "track the past, organize the present, and plan for the future," it transforms any blank notebook into a custom-built tool. Whether you need a task manager, a personal diary, or a creative sketchbook, this system provides a coherent framework for everything you want to document.

## Overview
BuJo.io is a web application built to tackle the one problem with using a notebook: you can't carry it everywhere. It recreates the feel of a physical bullet journal while adding the power of digital persistence, automated task migration, and data visualization. Users can log tasks, events, and memories across daily, weekly, monthly, and yearly views. A dashboard provides at-a-glance statistics and entry management. An archive lets users revisit and interact with past entries. The app is fully responsive, supports dark, light, and paper themes, and stores all data locally in the browser, which means no accounts or servers are required.

## Features
The following features were implemented from the Code:You course feature list:

**1. Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.**
All journal entries are stored as an array of objects in localStorage. The Dashboard page uses JavaScript's `.filter()` and `.map()` methods to analyze this data and display entry counts by type (To-Do, Event, Memory) and state (Active, Completed, Migrated). Users can click any stat card to filter and explore that group of entries.

**2. Calculate and display data based on an external factor (ex: get the current date, and display how many days remaining until some event)**
The app integrates the Nager.Date public holiday API (https://date.nager.at/api/v3/NextPublicHolidays/US) to fetch upcoming US public holidays and display how many days remain until each one. This calculation runs on page load using JavaScript's Date object to compare today's date against each holiday date. Users can add any holiday directly to their journal with one click.

**3. Persist important data to the user to local storage and make the stored data accessible in your app. (including after reload/refresh).**
All journal entries and user settings (name, timezone, visual theme, font size) are saved to the browser's localStorage. Data persists across page refreshes and browser restarts. The app checks for existing settings on every page load and applies them automatically, including theme and font size, before the page renders to prevent any visual flash.

**4. Validate user input and prevent invalid input from being stored**
The log entry form validates that both a log type and entry text are present before saving. If the Quill editor is empty, it highlights with a red outline and focuses the editor. If no log type is selected, the user is prompted to choose one. Invalid entries are never written to localStorage.

## How to Run the Project

### Requirements
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- [Live Server extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) — required to serve the project locally. Opening the HTML files directly from the file system will not work correctly due to how the browser handles local file paths.
- No Node.js or npm required
- No API key required — the Nager.Date API is free and open with no authentication

### Steps
1. Clone or download the repository
2. Open the project folder in VS Code
3. Right-click `index.html` and select **Open with Live Server**
4. The app will open in your default browser at `http://127.0.0.1:5500`
5. Complete the setup process on first launch — choose your name, timezone, visual theme, and font size
6. You will be redirected to the Dashboard automatically after setup

### Notes
- All data is stored in your browser's localStorage. Clearing your browser data will reset the app.
- The app does not require an internet connection except to load the upcoming holidays from the Nager.Date API. If offline, the holidays section will simply not display.

## AI Usage

Claude (claude.ai) was used throughout this project as a development assistant to support my workflow, problem solving, and code quality. Its role was primarily focused on ideation, debugging, and refinement rather than primary implementation.

- **Planning and architecture** I designed and structured the application, using Claude occasionally to validate ideas, break down complex problems, and suggest improvements to file organization [^1] and separation of concerns.

- **Feature development** All core features were implemented by me. Claude was used as a reference tool to troubleshoot issues, explore alternative approaches, and refine specific pieces of functionality when I encountered roadblocks.

- **Debugging and problem-solving** Claude assisted in identifying and resolving bugs in my code, including issues related to timezone handling, duplicate rendering, CSS behavior, and UI inconsistencies. I used these interactions to better understand the underlying problems and apply fixes directly.

- **Code quality and refactoring** I leveraged Claude to review portions of my code and highlight potential issues or inefficiencies. Based on this feedback, I made targeted improvements to structure, readability, and maintainability.

- **Documentation support** Claude provided light assistance in refining wording for the About page, developer bio, and parts of this README.

All code in this project was written, reviewed, and fully understood by me. AI was used as a supplemental tool to accelerate learning, improve code quality, and assist with debugging—not as a substitute for development.


## Updates
**03/04/2026**
Started working on the project. Created README.md, public folder, and .gitignore. Public folder contained css and js folders and index.html.

**03/06/2026**
Created more html files and added some code to js. Used Canva to create logo and favicon, which have been stored in the public/img folder. Used [realfavicongenerator.net] [https://realfavicongenerator.net/] to create set of favicons for different browsers.

**03/08/2026**
Changed and removed some HTML files. Added setup.js. Added basic css styling while developing app. Will change that later.

**03/17/2026**
Implemented QuillJS into the project for easier text editing for the users. Will begin working on the implementation of URL parameters for different journal entries.

**03/22/2026**
Added Nager.Date API (https://date.nager.at/API) to project to help users see upcoming holidays at-a-glance when planning their days.

**03/23/2026**
Moved all localStorage logic out of index.js and imported it to storage.js. Started building url parameters in bujo.html. Discovered bug where entries didn't display properly across all parameters. Will address.

**03/24/2026**
Moved all files out of public folder and removed folder. Updated all links that previously directed to public folder. Still working on bug for entry display. Want to add feature that displays date entered for past entries. Edited date ranges loaded for week, month, and year view in bujo.html. Need to add feature that lets user select date when creating entries. May need to limit it to events.

**03/30/2026**
Started building Dashboard page. Currently able to render stats and show entries. Added navigation links to bujo.html and archive, as well as nav to dashboard from bujo. Need to build archive page.

**04/02/2026**
Built Archive page. Added function to disable date from progressing to the current date or any future events. Set navigation bar to be uniform across all pages. Added ability to select date when creating new entry. Added dark and paper modes along with font selection to style.css.

**04/03/2026**
Built About page. Added links to About to Dashboard, BuJo, and Archive pages.

**04/05/2026 (and 04/04/2026)**
Edited About page. Fixed issue with logo not loading correctly (because I uploaded the wrong kind of logo). Fixed CSS dark mode flashing issue (Thank you to Tyler Collins for helping me find that solution.) Added logo to all pages. Added responsive design. Made "new entry" section into a pop-up for mobile view. Created a new problem in that the new entry option now disappears completely on desktop view.

**04/07/2026**
Debugging. Fixed issue with new entry option disappearing on desktop view. Fixed issue where pre-saved settings weren't being highlighted when returning to settings. Fixed issue where new entries were appearing in duplicate. Fixed hamburger menu not working on about page. Added date picker for task migration. Fixed issue where migrated entries were showing as duplicates in week/month/year views. Removed unnecessary QuillJS from archive page. Fixed stray closing tags in archive and dashboard pages. Fixed dark mode logo path.

**04/08/2026**
Fixed active navigation link in dashboard.html. Fixed storage.js to be fully self-contained by removing renderEntries() calls from updateEntryState() and deleteEntry(), and adding todayKey() directly to storage.js. This prevents potential ReferenceErrors on pages that load storage.js without index.js. Fixed archive.js: entries no longer stack on repeated renders, migrate button now shows a date picker instead of always migrating to today, and URL offset parameter is now validated to prevent users from accessing current or future dates by manually editing the URL. Fixed index.js issue where active nav links were never being highlighted in setActiveViewLink(). Fixed renderWeekEntries() not being called in dashboard.js and class name mismatches in setup.html. Fixed week view in index.js showing all upcoming events instead of being limited to the current week. Fixed event date displaying one day behind due to timezone conversion bug. Fixed edit entry pulling date text into the editable field. Added date field to event edit so users can change the event date. Fixed dashboard showing entry types as plain text instead of symbols. Added copyright footer to all pages. Added ability to edit, complete, migrate, and delete entries directly from the dashboard. Fixed incorrect dates displayed for holidays.  Left comments where AI was used.  Updated README file.

Note: Timezone preference is collected during setup and saved to localStorage for future use. Current date calculations use the browser's local system time which reflects the user's actual timezone automatically.

[^1]: index.js and style.css have many lines of code in it.  I gave these files to Claude to review and then asked it to organize the code by section so that it could easily be referenced and edited later on.  
