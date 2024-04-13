let currentPage = 1;
const resultsPerPage = 10;

async function fetchData(query, page) {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodedQuery}&page=${page}&num_pages=3`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '596c4718f5mshe15a32519b44d54p1b9e49jsnd2295ffb7a7f',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        displayResults(data, page);
    } catch (error) {
        console.error(error);
    }
}

function displayResults(data, page) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (data && data.data && data.data.length > 0) {
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const displayedData = data.data.slice(startIndex, endIndex);

        const table = document.createElement("table");
        const headerRow = table.insertRow();
        const headers = ["Job Title", "Employer", "Location", "Apply Link", "Site"];

        // Create table headers
        headers.forEach(headerText => {
            const header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        // Add job data to the table
        displayedData.forEach(job => {
            const row = table.insertRow();
            const titleCell = row.insertCell();
            const employerCell = row.insertCell();
            const locationCell = row.insertCell();
            const applyLinkCell = row.insertCell();
            const siteCell = row.insertCell();

            titleCell.textContent = job.job_title || "N/A";
            employerCell.textContent = job.employer_name || "N/A";
            locationCell.textContent = `${job.job_city || "N/A"}, ${job.job_state || "N/A"}, ${job.job_country || "N/A"}`;
            applyLinkCell.innerHTML = `<a href="${job.job_apply_link}" target="_blank">Apply</a>` || "N/A";
            siteCell.textContent = job.job_publisher || "N/A";
        });

        resultsDiv.appendChild(table);

        // Pagination controls
        const totalPages = Math.ceil(data.data.length / resultsPerPage);
        const paginationDiv = document.createElement("div");
        paginationDiv.classList.add("pagination");

        const prevButton = document.createElement("button");
        prevButton.textContent = "<<";
        prevButton.addEventListener("click", function() {
            if (currentPage > 1) {
                currentPage--;
                fetchData(document.getElementById("searchQuery").value, currentPage);
            }
        });
        paginationDiv.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add("active"); // Add active class to current page
            }
            pageButton.addEventListener("click", function() {
                currentPage = i;
                fetchData(document.getElementById("searchQuery").value, currentPage);
                updatePageButtons(); // Update page buttons after clicking
            });
            paginationDiv.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.textContent = ">>";
        nextButton.addEventListener("click", function() {
            if (currentPage < totalPages) {
                currentPage++;
                fetchData(document.getElementById("searchQuery").value, currentPage);
            }
        });
        paginationDiv.appendChild(nextButton);

        resultsDiv.appendChild(paginationDiv);
    } else {
        resultsDiv.textContent = "No results found.";
    }
}

function updatePageButtons() {
    const paginationDiv = document.querySelector(".pagination");
    const pageButtons = paginationDiv.querySelectorAll("button");
    pageButtons.forEach(button => {
        button.classList.remove("active"); // Remove active class from all buttons
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add("active"); // Add active class to current page button
        }
    });
}

document.getElementById("searchButton").addEventListener("click", function() {
    const query = document.getElementById("searchQuery").value;
    if (query) {
        fetchData(query, currentPage);
    }
});
