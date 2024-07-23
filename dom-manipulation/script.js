// API Endpoints
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Mock API
const QUOTES_ENDPOINT = `${API_BASE_URL}/quotes`;

// Load and Save Quotes
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Sync with Server
async function syncWithServer() {
  try {
    const response = await fetch(QUOTES_ENDPOINT);
    if (response.ok) {
      const serverQuotes = await response.json();
      handleSync(serverQuotes);
    } else {
      console.error('Failed to fetch data from server.');
    }
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

// Handle Sync and Conflict Resolution
function handleSync(serverQuotes) {
  const localQuotes = quotes;
  const serverQuoteMap = new Map(serverQuotes.map(q => [q.id, q]));

  // Identify new and updated quotes
  const newQuotes = serverQuotes.filter(q => !localQuotes.some(lq => lq.id === q.id));
  const updatedQuotes = serverQuotes.filter(q => localQuotes.some(lq => lq.id === q.id && lq.updatedAt < q.updatedAt));

  if (newQuotes.length > 0 || updatedQuotes.length > 0) {
    // Update local quotes with server data
    const updatedLocalQuotes = localQuotes.filter(lq => !serverQuoteMap.has(lq.id)).concat(newQuotes).concat(updatedQuotes);
    quotes = updatedLocalQuotes;
    saveQuotes();
    alert('Quotes updated from server.');
  }
}

// Post New Quote to Server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(QUOTES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });

    if (response.ok) {
      const newQuote = await response.json();
      quotes.push(newQuote);
      saveQuotes();
      alert('Quote successfully added to the server.');
    } else {
      console.error('Failed to post data to server.');
    }
  } catch (error) {
    console.error('Error posting to server:', error);
  }
}

// Show Random Quote
function showRandomQuote() {
  const filteredQuotes = filterQuotesByCategory(currentFilter);
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available for this category.</p>';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  saveLastViewedQuote(quote);
}

// Add New Quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    updateCategoryFilter();
    alert("Quote added successfully!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote();
  } else {
    alert("Please fill out both fields.");
  }
}

// Session Storage for Last Viewed Quote
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    const quote = JSON.parse(lastViewedQuote);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  }
}

// JSON Export
function exportQuotes() {
  const dataStr = JSON.stringify(quotes);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'quotes.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    updateCategoryFilter();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate and Update Categories
function updateCategoryFilter() {
  const categories = new Set(quotes.map(quote => quote.category));
  const categoryFilter = document.getElementById('categoryFilter');

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
}

// Filter Quotes Based on Selected Category
function filterQuotes() {
  currentFilter = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', currentFilter);
  showRandomQuote();
}

// Filter Quotes by Category
function filterQuotesByCategory(category) {
  if (category === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === category);
}

// Initial setup and event listeners
let quotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
];

let currentFilter = 'all';

loadQuotes();
loadLastViewedQuote();
updateCategoryFilter();
showRandomQuote();

// Set up periodic sync
setInterval(syncWithServer, 60000); // Sync every 60 seconds

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
