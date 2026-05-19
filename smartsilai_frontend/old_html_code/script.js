function generateInputs() {
    const selectedItems = document.getElementById('categorySelect').value;
    const container = document.getElementById('measurementInputsContainer');

    // Clear the container every time a new item is selected
    container.innerHTML = '';

    if (selectedItems === "") return; // No item selected, exit the function

    // Define the measurements for each item
    const measurements = {
        'Shirt': ['Neck', 'Chest', 'Waist', 'Sleeve Length'],
        'Pants': ['Waist', 'Hip', 'Inseam', 'Outseam'],
        'Dress': ['Bust', 'Waist', 'Hip', 'Length'],
        'Kurti': ['Length', 'Chest', 'Waist', 'Hip', 'Sleeves'],
        'Blouse': ['Length', 'Chest', 'Waist', 'Shoulder', 'Sleeve Length'],
        'Salwar': ['Length', 'Waist', 'Hip', 'Bottom'],
        'Mask': ['Width', 'Height'],
        'Scarf': ['Length', 'Width']
    };

    // Get the measurements for the selected item
    const fields = measurements[selectedItems];

    // Create HTML input fields for each measurement
    fields.forEach(field => {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';

        div.innerHTML = `
            <label> ${field} (inches): </label><br>
            <input type="number" name="${field.toLowerCase()}" placeholder="Enter ${field}">
        `;
        container.appendChild(div);
    });
}

async function saveMeasurements() {
    const container = document.getElementById('measurementInputsContainer');
    const inputs = container.querySelectorAll('input');
    const selectedItem = document.getElementById('categorySelect').value;
    
    const billNo = document.getElementById('billNumber').value;
    const customerName = document.getElementById('customerName').value.trim();

    // ==========================================
    // 1. VALIDATION SYSTEM (The Protection Guard)
    // ==========================================

    // Check A: Make sure a customer name is typed
    if (!customerName) {
        alert("Please enter a Customer Name before saving!");
        return; // Stops execution immediately
    }

    // Check B: Make sure they actually picked an item category
    if (!selectedItem || selectedItem === "") {
        alert("Please select an item category first!");
        return; // Stops execution immediately
    }

    // Check C: Make sure measurement input fields actually exist on the screen
    if (inputs.length === 0) {
        alert('Please select an item and ensure the measurement fields are visible!');
        return; // Stops execution immediately
    }

    let measurements = {};
    let allFilled = true;

    // Check D: Loop through each measurement field and check if it's empty
    inputs.forEach(input => {
        if (!input.value || input.value.trim() === "") {
            allFilled = false;
        }
        measurements[input.name] = input.value.trim();
    });

    // If even ONE box is blank, sound the alarm and don't touch the server!
    if (!allFilled) {
        alert('Please fill in ALL measurement fields before saving.');
        return; // Stops execution immediately
    }

    // ==========================================
    // 2. DATABASE INTEGRATION (Sending clean data)
    // ==========================================
    const dataToSend = {
        item_id: selectedItem, 
        details: measurements,
        bill_no: billNo,
        customer_name: customerName
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/measurements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            alert(`Data successfully saved under Bill #${billNo} for ${customerName}!`);
            
            // 3. Update UI (Job Card Details)
            const cardDetails = document.getElementById('cardDetails');
            let detailsHTML = `<h4>${selectedItem} (Bill: ${billNo} - ${customerName})</h4><hr>`;
            
            for (const [key, value] of Object.entries(measurements)) {
                detailsHTML += `<p><strong>${key.toUpperCase()}:</strong> ${value} inches</p>`;
            }
            
            cardDetails.innerHTML = detailsHTML;
            document.getElementById('jobCard').style.display = 'block';
            
            // Automatically refresh the bottom log history table
            loadHistory(); 
        } else {
            // If the server returns a 500 or 400 error, capture it here instead of freezing
            alert("The server received the data but failed to save it. Did you run the ALTER TABLE command in pgAdmin?");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server. Is your node server.js running in the terminal?");
    }
}

function loadStoredMeasurements() {
    const saved = localStorage.getItem('userMeasurements');
    const displayDiv = document.getElementById('savedDisplay');
    const content = document.getElementById('displayContent');

    if (saved && displayDiv) {
        const data = JSON.parse(saved);
        displayDiv.style.display = 'block';
        content.innerHTML = ""; 

        for (const [key, value] of Object.entries(data)) {
            content.innerHTML += `<strong>${key.toUpperCase()}:</strong> ${value} inches<br>`;
        }
    }
}

function clearMeasurements() {
    localStorage.removeItem('userMeasurements');
    const container = document.getElementById('measurementInputsContainer');
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    document.getElementById('savedDisplay').style.display = 'none';
    alert("Data cleared successfully!");
}

async function loadHistory() {
    try {
        const response = await fetch('http://localhost:5000/api/measurements');
        const data = await response.json();
        
        const historyBody = document.getElementById('historyBody');
        historyBody.innerHTML = ''; 

        data.forEach(row => {
            const tr = document.createElement('tr');
            const measurementDetails = Object.entries(row.details)
                .map(([key, val]) => `${key}: ${val}"`)
                .join(' | ');

            tr.innerHTML = `
                <td style="padding: 8px; text-align: center;">${row.id}</td>
                <td style="padding: 8px;">${row.item_id}</td>
                <td style="padding: 8px;">${measurementDetails}</td>
            `;
            historyBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading history:", error);
    }
}

function generateBillNumber() {
    const randomBill = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('billNumber').value = randomBill;
}

// Set up the page lifecycle cleanly
window.onload = function() {
    generateBillNumber();
    loadStoredMeasurements();
};