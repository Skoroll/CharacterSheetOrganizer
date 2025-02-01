




//node generateStructure.js
//node generateStructure.js
//node generateStructure.js
//node generateStructure.js
//node generateStructure.js
//node generateStructure.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convertir __dirname en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a folder if it doesn't already exist
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
};

// Function to create a file with optional content
const createFile = (filePath, content = "") => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
};

// Base directory
const baseDir = path.join(__dirname, "project");

console.log(`Base directory: ${baseDir}`);

// Directories and files to create
const structure = {
  style: ["variables.scss", "mixins.scss", "base.scss"],
  pages: {
    Home: ["Home.tsx", "Home.scss"],
    Contact: ["Contact.tsx", "Contact.scss"],
    Legal: ["Legal.tsx", "Legal.scss"],
  },
  components: {
    Header: ["Header.tsx", "Nav.tsx", "Header.scss"],
    Footer: ["Footer.tsx", "Footer.scss"],
  },
};

// Create folders and files
createFolder(baseDir);

// Create 'style' folder and files
const styleDir = path.join(baseDir, "style");
createFolder(styleDir);
structure.style.forEach((file) => {
  createFile(path.join(styleDir, file));
});

// Create 'pages' folder and files
const pagesDir = path.join(baseDir, "pages");
createFolder(pagesDir);
Object.keys(structure.pages).forEach((page) => {
  const pageDir = path.join(pagesDir, page);
  createFolder(pageDir);
  structure.pages[page].forEach((file) => {
    createFile(path.join(pageDir, file));
  });
});

// Create 'components' folder, subfolders, and files
const componentsDir = path.join(baseDir, "components");
createFolder(componentsDir);
Object.keys(structure.components).forEach((subfolder) => {
  const subfolderPath = path.join(componentsDir, subfolder);
  createFolder(subfolderPath);
  structure.components[subfolder].forEach((file) => {
    createFile(path.join(subfolderPath, file));
  });
});

console.log("Project structure created successfully!");

