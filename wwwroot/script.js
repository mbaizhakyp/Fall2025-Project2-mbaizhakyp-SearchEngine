$(document).ready(function () {
    // --- CONFIGURATION ---
    const API_KEY = 'AIzaSyCZIq1sAwcTMHGDlj5RPj8WgPCJP82p4Ps';
    const SEARCH_ENGINE_ID = '41d028825010249aa';

    // --- BACKGROUND CHANGER ---
    const backgrounds = [
        'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80")',
        'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2071&q=80")',
        'url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2127&q=80")'
    ];
    let currentBgIndex = 0;

    $('#engine-name').on('click', function () {
        currentBgIndex = (currentBgIndex + 1) % backgrounds.length; // Cycle through images
        $('body').css('background-image', backgrounds[currentBgIndex]);
    });

    // --- TIME DIALOG ---
    $('#time-btn').on('click', function () {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        $('#time').text(`The current time is ${formattedTime}`);
        
        // Use jQueryUI to create a dialog
        $('#time').dialog({
            modal: true, // Prevents interacting with the rest of the page
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    });

    // --- SEARCH FUNCTIONALITY ---
    function performSearch(isFeelingLucky) {
        const query = $('#query').val();
        if (!query) {
            alert("Please enter a search query.");
            return;
        }

        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (isFeelingLucky) {
                    handleLuckySearch(data);
                } else {
                    displayResults(data);
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                $('#searchResults').html('<p>Sorry, something went wrong with the search.</p>').css('visibility', 'visible');
            });
    }
    
    // Attach event listeners to buttons
    $('#search-btn').on('click', () => performSearch(false));
    $('#lucky-btn').on('click', () => performSearch(true));

    // Also allow searching by pressing Enter in the text box
    $('#query').on('keypress', function(e) {
        if (e.which === 13) { // 13 is the Enter key
            performSearch(false);
        }
    });

    function displayResults(data) {
        const searchResultsDiv = $('#searchResults');
        searchResultsDiv.empty().css('visibility', 'hidden'); // Clear previous results

        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const resultItem = `
                    <div class="result-item">
                        <a href="${item.link}" target="_blank">${item.htmlTitle}</a>
                        <div class="link">${item.formattedUrl}</div>
                        <div class="snippet">${item.htmlSnippet}</div>
                    </div>
                `;
                searchResultsDiv.append(resultItem);
            });
            searchResultsDiv.css('visibility', 'visible'); // Show the results div
        } else {
            searchResultsDiv.html('<p>No results found.</p>').css('visibility', 'visible');
        }
    }

    // --- BONUS: I'M FEELING LUCKY ---
    function handleLuckySearch(data) {
        if (data.items && data.items.length > 0) {
            // Redirect to the first result
            window.location.href = data.items[0].link;
        } else {
            alert("No results found to feel lucky about!");
        }
    }
});