interface SearchResult {
    title: string;
    description: string;
    pubDate: string;
    url: string;
}

let searchIndex: SearchResult[] | null = null;
let isFetching = false;

async function fetchSearchIndex() {
    if (searchIndex || isFetching) return;
    isFetching = true;
    try {
        const response = await fetch('/search.json');
        if (response.ok) {
            searchIndex = await response.json();
        }
    } catch (e) {
        console.error("Failed to fetch search index", e);
    }
    isFetching = false;
}

function initSearch() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    const searchResults = document.getElementById('search-results');
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.querySelector('.search-container');

    if (!searchInput || !searchResults) return;

    // Prefetch on focus
    searchInput.addEventListener('focus', fetchSearchIndex);

    searchInput.addEventListener('input', async (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
        
        if (!query) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }

        // Ensure we have data
        if (!searchIndex) {
            await fetchSearchIndex();
        }

        if (!searchIndex) return;

        const results = searchIndex.filter(post => {
            return (post.title && post.title.toLowerCase().includes(query)) ||
                   (post.description && post.description.toLowerCase().includes(query));
        });

        if (results.length > 0) {
            searchResults.innerHTML = results.map(post => `
                <a href="${post.url}" class="search-result-item">
                    <div class="search-result-title">${post.title}</div>
                    ${post.description ? `<div class="search-result-desc">${post.description}</div>` : ''}
                </a>
            `).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="search-result-empty">No results found</div>';
            searchResults.classList.add('active');
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target as Node;
        const clickedInsideToggle = searchToggle && searchToggle.contains(target);
        
        if (!searchInput.contains(target) && !searchResults.contains(target) && !clickedInsideToggle) {
            searchResults.classList.remove('active');
            if (searchContainer) searchContainer.classList.remove('expanded');
        }
    });

    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('expanded');
            if (searchContainer.classList.contains('expanded')) {
                searchInput.focus();
            } else {
                searchResults.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
// Handle Astro view transitions if they are used
document.addEventListener('astro:page-load', initSearch);
