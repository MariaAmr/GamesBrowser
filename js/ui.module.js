'use strict'
 import { Details } from "./details.module.js";
  
 export class Home {
     gameContent = document.getElementById("content-games");
     navBar = document.querySelector(".navbar");
     
     constructor() {
         this.changeCategory();
         this.display("mmorpg");
         this.loading = document.querySelector(".overlay");
     }     
 
     changeCategory() {
         let links = document.querySelectorAll(".navbar-nav .nav-link");
         links.forEach((link) => {
             link.addEventListener("click", (e) => {
                 links.forEach((navLink) => {
                     navLink.classList.remove("active");
                 });
                 e.target.classList.add("active");
                 this.display(e.target.dataset.category);
             });
         });
     }
 
     async getData(category) {
         const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
         const options = {
             method: 'GET',
             headers: {
                 'x-rapidapi-key': 'fe3459068fmsh3929362873b8838p1f6e74jsn77319d03ca5b',
                 'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com',
                 'Accept': 'application/json'  // for CORS access
             }
         };
         
         try {
             const response = await fetch(url, options);
             
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
          
             return await response.json(); // Return parsed JSON data
         } catch (error) {
             console.error("Fetch error:", error);
             this.showError("Failed to load games. Please try again later.");
             return []; // Return empty array instead of undefined
         }
     }
 
     showError(message) {
         const errorElement = document.createElement("div");
         errorElement.className = "alert alert-danger mt-3";
         errorElement.textContent = message;
         const rowContent = document.getElementById("row-content");
         rowContent.innerHTML = "";
         rowContent.appendChild(errorElement);
     }
 
     async display(category) {
         const spinner = document.querySelector(".overlay");
         spinner.classList.remove("d-none");
         
         try {
             let data = await this.getData(category);
             let rowContent = document.getElementById("row-content");
             
             // Clear existing content
             rowContent.innerHTML = "";
             
             if (!data || data.length === 0) {
                 const noGames = document.createElement("div");
                 noGames.className = "col-12 text-center py-5";
                 noGames.textContent = "No games found for this category";
                 rowContent.appendChild(noGames);
                 return;
             }
 
             // Create document fragment for better performance
             const fragment = document.createDocumentFragment();
 
             data.forEach((game) => {
                 // Create column div
                 const colDiv = document.createElement("div");
                 colDiv.className = "col-sm-12 col-md-6 col-lg-4 col-xl-3";
 
                 // Create inner div
                 const innerDiv = document.createElement("div");
                 innerDiv.className = "inner p-3 overflow-hidden";
                 innerDiv.dataset.id = game.id;
 
                 // Create image
                 const img = document.createElement("img");
                 img.className = "w-100";
                 img.src = game.thumbnail;
                 img.alt = "";
                 img.loading = "lazy";
 
                 // Create content div
                 const contentDiv = document.createElement("div");
                 contentDiv.className = "content mt-3";
 
                 // Create header
                 const headerDiv = document.createElement("div");
                 headerDiv.className = "header d-flex justify-content-between align-items-center";
 
                 const title = document.createElement("h3");
                 title.className = "text-capitalize";
                 title.textContent = game.title;
 
                 const status = document.createElement("span");
                 status.textContent = "Free";
                 status.className = "badge bg-primary text-white px-2 py-1";
 
                 headerDiv.appendChild(title);
                 headerDiv.appendChild(status);
 
                 // Create body
                 const bodyDiv = document.createElement("div");
                 bodyDiv.className = "body mt-2";
 
                 const description = document.createElement("p");
                 description.className = "text-center opacity-50 game-description";
                 description.textContent = game.short_description.split(" ", 10).join(" ");
 
                 bodyDiv.appendChild(description);
 
                 // Create footer
                 const footerDiv = document.createElement("div");
                 footerDiv.className = "footer d-flex justify-content-between align-items-center p-2 pb-0";
 
                 const genre = document.createElement("div");
                 genre.className = "text-uppercase";
                 genre.textContent = game.genre;
 
                 const platform = document.createElement("div");
                 platform.textContent = game.platform;
 
                 footerDiv.appendChild(genre);
                 footerDiv.appendChild(platform);
 
                 // Assemble components
                 contentDiv.appendChild(headerDiv);
                 contentDiv.appendChild(bodyDiv);
                 contentDiv.appendChild(footerDiv);
 
                 innerDiv.appendChild(img);
                 innerDiv.appendChild(contentDiv);
 
                 colDiv.appendChild(innerDiv);
                 fragment.appendChild(colDiv);
             });
 
             rowContent.appendChild(fragment);
             
         } catch (error) {
             console.error("Display error:", error);
             this.showError("Error displaying games. Please refresh the page.");
         } finally {
             spinner.classList.add("d-none");  // here we remove the loader even its settled or rejected
             this.addEventListener();
         }
     }
 
     addEventListener() {
         // Remove old listeners
         const boxes = document.querySelectorAll(".inner");
         boxes.forEach(box => {
             box.replaceWith(box.cloneNode(true));
         });
 
         // Add new listeners
         document.querySelectorAll(".inner").forEach(box => {
             box.addEventListener("click", (e) => {
                 new Details(e.currentTarget.dataset.id);
             });
         });
     }
 }
 
 
