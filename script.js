let history = [];
let analysisLimit = 0; // Default to 0, which means no limit

// Generate number buttons 0-36
const numbersContainer = document.querySelector('.numbers');
for (let i = 0; i <= 36; i++) {
    const button = document.createElement('div');
    button.className = 'number-button';
    button.textContent = i;
    button.style.backgroundColor = (i === 0) ? '#4B9036' : (isRed(i) ? '#B51C12' : '#000');
    button.addEventListener('click', () => addNumber(i));
    numbersContainer.appendChild(button);
}

function addNumber(number) {
    history.unshift(number); // Add number to the beginning of the history
    updateStatistics();
    displayRecentNumbers();
    displayFullHistory();
}

document.getElementById('add-history').addEventListener('click', function() {
    let inputHistory = document.getElementById('history-input').value;
    
    // Remove any spaces around commas
    inputHistory = inputHistory.replace(/\s*,\s*/g, ',');
    
    const numbers = inputHistory.split(/\s+|,/).map(Number).filter(num => num >= 0 && num <= 36);
    if (numbers.length > 0) {
        // Reverse the order of the pasted history
        history = history.concat(numbers.reverse());
        updateStatistics();
        displayRecentNumbers();
        displayFullHistory();
    } else {
        alert("Please enter valid numbers separated by space or comma.");
    }
});

document.getElementById('clear-last').addEventListener('click', function() {
    if (history.length > 0) {
        history.shift(); // Remove the last entered number (first in the array)
        updateStatistics();
        displayRecentNumbers();
        displayFullHistory();
    }
});

document.getElementById('clear-all').addEventListener('click', function() {
    history = []; // Clear all history
    updateStatistics();
    displayRecentNumbers();
    displayFullHistory();
});

// Update analysis limit
document.getElementById('analysis-limit').addEventListener('change', function() {
    analysisLimit = parseInt(this.value, 10);
    updateStatistics();
    displayRecentNumbers();
    displayFullHistory();
});

function displayRecentNumbers() {
    let recentNumbers = document.getElementById('recent-numbers');
    recentNumbers.innerHTML = '';
    const dataToDisplay = analysisLimit > 0 ? history.slice(0, analysisLimit) : history.slice(0, 12);
    dataToDisplay.forEach(num => {
        let div = document.createElement('div');
        div.textContent = num;
        div.style.backgroundColor = (num === 0) ? '#4B9036' : (isRed(num) ? '#B51C12' : '#000');
        recentNumbers.appendChild(div);
    });
}

function displayFullHistory() {
    let fullHistory = document.getElementById('full-history');
    fullHistory.innerHTML = '';
    history.forEach((num, index) => {
        let div = document.createElement('div');
        div.textContent = `${index + 1}: ${num}`;
        div.style.backgroundColor = (num === 0) ? '#4B9036' : (isRed(num) ? '#B51C12' : '#000');
        fullHistory.appendChild(div);
    });
}

function updateStatistics() {
    let stats = calculateStatistics();
    
    // Reset all column backgrounds
    let columns = document.querySelectorAll('.column');
    columns.forEach(col => col.style.backgroundColor = '#444');

    let statArrayDozens = [
        { id: 'dozen-1', value: stats.firstDozen },
        { id: 'dozen-2', value: stats.secondDozen },
        { id: 'dozen-3', value: stats.thirdDozen }
    ];
    
    let statArrayColumns = [
        { id: 'column-1', value: stats.firstColumn },
        { id: 'column-2', value: stats.secondColumn },
        { id: 'column-3', value: stats.thirdColumn }
    ];

    let statArrayOthers = [
        { id: 'low', value: stats.low },
        { id: 'high', value: stats.high },
        { id: 'even', value: stats.even },
        { id: 'odd', value: stats.odd },
        { id: 'red', value: stats.red },
        { id: 'black', value: stats.black }
    ];

    // Sort by value and determine the top in each category group
    statArrayDozens.sort((a, b) => b.value - a.value);
    statArrayColumns.sort((a, b) => b.value - a.value);
    statArrayOthers.sort((a, b) => b.value - a.value);

    // Highlight top category in each group with green
    document.getElementById(statArrayDozens[0].id).style.backgroundColor = '#4CAF50';
    document.getElementById(statArrayColumns[0].id).style.backgroundColor = '#4CAF50';
    document.getElementById(statArrayOthers[0].id).style.backgroundColor = '#4CAF50';

    // Update the text content of the stats
    document.getElementById('zero').querySelector('span').textContent = `${stats.zero}%`;
    document.getElementById('dozen-1').querySelector('span').textContent = `${stats.firstDozen}%`;
    document.getElementById('dozen-2').querySelector('span').textContent = `${stats.secondDozen}%`;
    document.getElementById('dozen-3').querySelector('span').textContent = `${stats.thirdDozen}%`;

    document.getElementById('column-1').querySelector('span').textContent = `${stats.firstColumn}%`;
    document.getElementById('column-2').querySelector('span').textContent = `${stats.secondColumn}%`;
    document.getElementById('column-3').querySelector('span').textContent = `${stats.thirdColumn}%`;

    document.getElementById('low').querySelector('span').textContent = `${stats.low}%`;
    document.getElementById('high').querySelector('span').textContent = `${stats.high}%`;

    document.getElementById('even').querySelector('span').textContent = `${stats.even}%`;
    document.getElementById('odd').querySelector('span').textContent = `${stats.odd}%`;

    document.getElementById('red').querySelector('span').textContent = `${stats.red}%`;
    document.getElementById('black').querySelector('span').textContent = `${stats.black}%`;
}

function calculateStatistics() {
    let stats = {
        zero: 0,
        firstDozen: 0,
        secondDozen: 0,
        thirdDozen: 0,
        firstColumn: 0,
        secondColumn: 0,
        thirdColumn: 0,
        low: 0,
        high: 0,
        even: 0,
        odd: 0,
        red: 0,
        black: 0
    };

    // Limit the analysis to the specified number of entries
    const dataToAnalyze = analysisLimit > 0 ? history.slice(0, analysisLimit) : history;

    dataToAnalyze.forEach(number => {
        if (number === 0) {
            stats.zero++;
        } else if (number >= 1 && number <= 12) {
            stats.firstDozen++;
        } else if (number >= 13 && number <= 24) {
            stats.secondDozen++;
        } else if (number >= 25 && number <= 36) {
            stats.thirdDozen++;
        }

        if ([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(number)) stats.firstColumn++;
        if ([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(number)) stats.secondColumn++;
        if ([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(number)) stats.thirdColumn++;

        if (number >= 1 && number <= 18) stats.low++;
        if (number >= 19 && number <= 36) stats.high++;

        if (number % 2 === 0 && number !== 0) stats.even++;
        if (number % 2 !== 0) stats.odd++;

        if (isRed(number)) stats.red++;
        if (!isRed(number) && number !== 0) stats.black++;
    });

    // Calculate percentages based on the limited history count
    let count = dataToAnalyze.length;
    if (count > 0) {
        for (let key in stats) {
            stats[key] = ((stats[key] / count) * 100).toFixed(0);
        }
    }

    return stats;
}

function isRed(number) {
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number);
}
