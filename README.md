# BuJo.io
**Digital mindfulness via rapid logging.** A minimalist, web-based bullet journal application designed to bridge the gap between analog productivity and digital convenience.

## What is a Bullet Journal?
The Bullet Journal is a versatile analog organization system developed by New York designer Ryder Carroll. Described as a way to "track the past, organize the present, and plan for the future," it transforms any blank notebook into a custom-built tool. Whether you need a task manager, a personal diary, or a creative sketchbook, this system provides a coherent framework for everything you want to document.

## Overview
BuJo.io is a full-stack web application built to tackle the one problem with using a notebook: You can't carry a notebook everywhere. It recreates the tactile feel of a physical bullet journal while adding the power of digital persistence, automated task migration, and habit visualization.

## Updates
**03/04/2026**
Started working on the project.  Created README.md, public folder, and .gitignore.  Public folder contained css and js folders and index.html.

**03/06/2026**
Created more html files and added some code to js.  Used Canva to create logo and favicon, which have been stored in the public/img folder.  Used realfavicongenerator.net to create set of favicons for different browsers.

**03/08/2026**
Changed and removed some HTML files.  Added setup.js.  Added basic css styling while developing app.  Will change that later.

**03/17/2026**
Implemented QuillJS into the project for easier text editing for the users.  Will begin working on the implementation of URL parameters for different journal entries.

**03/22/2026**
Added Nager.Date API (https://date.nager.at/API) to project to help users see upcoming holidays at-a-glance when planning their days.

**03/23/2026**
Moved all localStorage logic out of index.js and imported it to storage.js.  Started building url paremeters in bujo.html.  Discovered bug where entries didn't display properly across all parameters.  Will address.

**03/24/2026**
Moved all files out of public folder and removed folder.  Updated all links that previously directed to public folder.  Still working on bug for entry display.  Want to add feature that displays date entered for past entries.  Edited date ranges loaded for week, month, and year view in bujo.html.  Need to add feature that lets user select date when creating entries.  May need to limit it to events.

**03/30/2026**
Started building Dashboard page.  Currently able to render stats and show entries.  Added navigation links to bujo.html and archive, as well as nav to dashboard from bujo.  Need to build archive page.

**04/02/2026**
Built Archive page.  Added function to disable date from progressing to the current date or any future events.  Set navigation bar to be uniform across all pages.  Added ability to select date when creating new entry.  Added dark and paper modes along with font selection to style.css.  

**04/03/2026** Built About page.  Added links to About to Dashboard, BuJo, and Archive pages.

**04/05/2026 (and 04/04/2026)** Edited About page.  Fixed issue with logo not loading correctly (because I uploaded the wrong kind of logo). Fixed CSS dark mode flashing issue (Thank you to Tyler Collins for helping me find that solution.)  Added logo to all pages.  Added responsive design.  Made "new entry" section into a pop-up for mobile view.  Created a new problem in that the new entry option now disappears completely on desktop view.

**04/07/2026** Debugging.  Fixed issue with new entry option disappearing on desktop view.  Fixed issue where pre-saved settings weren't being highlighted when returning to settings.  Fixed issue where new entries were appearing in duplicate.  Fixed hamburger menu not working on about page.  Added date picker for task migration.  Fixed issue where migrated entries were showing as duplicates in week/month/year views.  Removed unnecessary QuillJS from archive page.  Fixed stray closing tags in archive and dashboard pages.  Fixed dark mode logo path.

**04/08/2026** Fixed active navigation link in dashboard.html. Fixed storage.js to be fully self-contained by removing renderEntries() calls from updateEntryState() and deleteEntry(), and adding todayKey() directly to storage.js. This prevents potential ReferenceErrors on pages that load storage.js without index.js.  Fixed archive.js: entries no longer stack on repeated renders, migrate button now shows a date picker instead of always migrating to today, and URL offset parameter is now validated to prevent users from accessing current or future dates by manually editing the URL.  Fixed index.js issue where hamburger links were never being highligthed in setActiveViewLink.