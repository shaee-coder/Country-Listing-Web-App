
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");
    const tabsContainer = document.getElementById("tabsContainer");
    const sortContainer = document.getElementById("sortContainer");
    const countryContainer = document.getElementById("countryContainer");

    let countries = [];
    let regions = [];

    // Fetch countries from the API
    fetch("https://restcountries.com/v3.1/all")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch countries.");
            }
            return response.json();
        })
        .then((data) => {
            countries = data;
            regions = [...new Set(countries.map((country) => country.region).filter(Boolean))]; // Get unique regions
            createTabs(regions); // Create region tabs dynamically
            createSortOptions(); // Create sort options dynamically
            displayCountries(countries); // Initially display all countries
        })
        .catch((error) => {
            console.error("Error fetching countries:", error);
            countryContainer.innerHTML = `<p>Error loading countries. Please try again later.</p>`;
        });

    // Create tabs for regions
    function createTabs(regionList) {
        tabsContainer.innerHTML = regionList
            .map(
                (region) => `
            <button class="region-tab" data-region="${region}">${region}</button>
        `
            )
            .join("");

        // Add event listeners to tabs
        const regionTabs = document.querySelectorAll(".region-tab");
        regionTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                // Highlight the active tab
                regionTabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");

                // Filter countries by region
                const region = tab.getAttribute("data-region");
                const filteredCountries = countries.filter((country) => country.region === region);
                displayCountries(filteredCountries);
            });
        });
    }
    function createSortOptions() {
        sortContainer.innerHTML = `
            <label for="sortSelect">Filter by Population: </label>
            <select id="sortSelect">
                <option value="none">None</option>
                <option value="asc">high population</option>
                <option value="desc">low population</option>
            </select>
        `;
    
        const sortSelect = document.getElementById("sortSelect");
        sortSelect.addEventListener("change", () => {
            const sortValue = sortSelect.value;
            let sortedCountries = [...countries];
    
            // Remove any previous color classes
            sortSelect.classList.remove("asc", "desc", "none");
    
            if (sortValue === "asc") {
                sortedCountries.sort((a, b) => a.population - b.population);
                sortSelect.classList.add("asc"); // Add ascending class
            } else if (sortValue === "desc") {
                sortedCountries.sort((a, b) => b.population - a.population);
                sortSelect.classList.add("desc"); // Add descending class
            } else {
                sortSelect.classList.add("none"); // Add none class
            }
    
            displayCountries(sortedCountries);
        });
    }
    

    // Display countries
    function displayCountries(countryList) {
        countryContainer.innerHTML = countryList
            .map(
                (country) => `
                <div class="countrycard">
                    <div class="img-container" 
                         style="background-image: url('${country.flags.png}');"></div>
                    <h2>${country.name.common}</h2>
                    <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p>Population: ${country.population.toLocaleString()}</p>
                </div>`
            )
            .join("");
    }

    // Search bar functionality
    searchBar.addEventListener("input", () => {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const filteredCountries = countries.filter((country) =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries); // Display only matching countries
    });
});
