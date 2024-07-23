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
  
  // Show Random Quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    saveLastViewedQuote(quote);
  }
  
  // Add New Quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      alert("Quote added successfully!");
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
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
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Initial setup and event listeners
  let quotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
    { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
  ];
  
  loadQuotes();
  loadLastViewedQuote();
  showRandomQuote();
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', addQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  