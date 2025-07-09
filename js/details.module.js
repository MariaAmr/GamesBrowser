'use strict';
export class Details {
    constructor(id) {
        this.gameContent = document.getElementById("content-games");
        this.navBar = document.querySelector(".navbar");
        this.detailsContent = document.getElementById("details");
        this.closeBtn = document.querySelector("#close");
        this.rowContent = document.getElementById("game-details");
        this.id = id;
        
        this.addEventListener();
        this.hideNavBarAndContent();
        this.display(id);
    }
    
    hideNavBarAndContent() {
        this.detailsContent.classList.remove("d-none");
        this.navBar.classList.add("d-none");
        this.gameContent.classList.add("d-none");
    }

    async getDetails(id) {
        try {
            const response = await fetch(
                `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`, 
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
                        "x-rapidapi-key": "e6435cf980mshc88263093f8a35ap1f5d8cjsnb24a7ff4c86c",
                        'Accept': 'application/json'  // for CORS access
                    },
                }   
            );
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching game details:", error);
            return null;
        } 
    }

    async display(id) {
        const data = await this.getDetails(id);
        if (!data) {
            console.error("No data received");
            return;
        }

        // Clear existing content
        this.rowContent.innerHTML = '';

        // Create left column (image)
        const leftCol = document.createElement('div');
        leftCol.className = 'col-lg-4';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'inner';

        const img = document.createElement('img');
        img.src = data.thumbnail;
        img.alt = '';
        img.className = 'w-100';

        innerDiv.appendChild(img);
        leftCol.appendChild(innerDiv);

        // Create right column (content)
        const rightCol = document.createElement('div');
        rightCol.className = 'col-lg-8';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Create title
        const title = document.createElement('h2');
        title.className = 'mb-3';
        title.textContent = 'Title: ';
        
        const titleSpan = document.createElement('span');
        titleSpan.id = 'game-name';
        titleSpan.textContent = data.title;
        title.appendChild(titleSpan);

        // Create category
        const category = document.createElement('h5');
        category.className = 'pb-3';
        category.textContent = 'Category: ';
        
        const categorySpan = document.createElement('span');
        categorySpan.className = 'box-color';
        categorySpan.id = 'game-category';
        categorySpan.textContent = data.genre;
        category.appendChild(categorySpan);

        // Create platform
        const platform = document.createElement('h5');
        platform.className = 'pb-3';
        platform.textContent = 'Platform: ';
        
        const platformSpan = document.createElement('span');
        platformSpan.className = 'box-color';
        platformSpan.id = 'game-platform';
        platformSpan.textContent = data.platform;
        platform.appendChild(platformSpan);

        // Create status
        const status = document.createElement('h5');
        status.className = 'pb-3';
        status.textContent = 'Status: ';
        
        const statusSpan = document.createElement('span');
        statusSpan.className = 'box-color';
        statusSpan.id = 'game-status';
        statusSpan.textContent = data.status;
        status.appendChild(statusSpan);

        // Create description
        const description = document.createElement('p');
        description.id = 'game-description';
        description.textContent = data.description;

        // Create show game button
        const showGameBtn = document.createElement('a');
        showGameBtn.className = 'btn btn-outline-success mt-3';
        showGameBtn.href = data.game_url;
        showGameBtn.id = 'close';
        showGameBtn.target = '_blank';
        showGameBtn.textContent = 'Show Game';

        // Assemble content
        contentDiv.appendChild(title);
        contentDiv.appendChild(category);
        contentDiv.appendChild(platform);
        contentDiv.appendChild(status);
        contentDiv.appendChild(description);
        contentDiv.appendChild(showGameBtn);

        rightCol.appendChild(contentDiv);

        // Add columns to row
        this.rowContent.appendChild(leftCol);
        this.rowContent.appendChild(rightCol);
    }

    addEventListener() {
        this.closeBtn.addEventListener("click", () => {
            this.detailsContent.classList.add("d-none");
            this.navBar.classList.remove("d-none");
            this.gameContent.classList.remove("d-none");
        });
    }
}
