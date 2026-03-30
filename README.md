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
Added Nager.Date API to project to help users see upcoming holidays at-a-glance when planning their days.

**03/23/2026**
Moved all localStorage logic out of index.js and imported it to storage.js.  Started building url paremeters in bujo.html.  Discovered bug where entries didn't display properly across all parameters.  Will address.

**03/24/2026**
Moved all files out of public folder and removed folder.  Updated all links that previously directed to public folder.  Still working on bug for entry display.  Want to add feature that displays date entered for past entries.  Edited date ranges loaded for week, month, and year view in bujo.html.  Need to add feature that lets user select date when creating entries.  May need to limit it to events.

**03/30/2026**
Started building Dashboard page.  Currently able to render stats and show entries.  Need to add navigation to bujo.html and archive.html.