function generateInputs() {
    const selectedItems=document.getElementById('categorySelect').value;
    const container=document.getElementById('measurementInputsContainer');

    // Clear the container every time a new item is selected
    container.innerHTML='';

    if(selectedItems==="") return; // No item selected, exit the function

    //define the measurements for each item
    const measurements={
        'Shirt':['Neck','Chest','Waist','Sleeve Length'],
        'Pants':['Waist','Hip','Inseam','Outseam'],
        'Dress':['Bust','Waist','Hip','Length'],
        'Kurti': ['Length', 'Chest', 'Waist', 'Hip', 'Sleeves'],
        'Blouse': ['Length', 'Chest', 'Waist', 'Shoulder', 'Sleeve Length'],
        'Salwar': ['Length', 'Waist', 'Hip', 'Bottom'],
        'Mask': ['Width', 'Height'],
        'Scarf': ['Length', 'Width']
    };

    // Get the measurements for the selected item
    const feilds=measurements[selectedItems];

    // Create HTML input fields for each measurement
    feilds.forEach(feild=>{
        const div=document.createElement('div');
        div.style.marginBottom='10px';

        div.innerHTML=`
            <label> ${feild} (inches): </label><br>
            <input type="number" name="${feild.toLowerCase()}" placeholder="Enter ${feild}">
        `;
        container.appendChild(div);
    });
}

async function saveMeasurements() {
    const container = document.getElementById('measurementInputsContainer');
    const inputs = container.querySelectorAll('input');
    const selectedItem = document.getElementById('categorySelect').value;
    
    let measurements = {};
    let allFilled = true;

    // 1. Validation Logic (Keeping your work!)
    if (inputs.length === 0) {
        alert('Please select an item first!');
        return;
    }

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            allFilled = false;
        }
        measurements[input.name] = input.value;
    });

    if (!allFilled) {
        alert('Please fill in ALL fields before saving.');
        return;
    }

    // 2. Database Integration (The Upgrade)
    const dataToSend = {
        item_id: 1, // Placeholder: In the future, this will be your Item/Order ID
        details: measurements 
    };

    try {
        const response = await fetch('http://localhost:5000/api/measurements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            alert("Data saved directly to Database!");
            
            // 3. Update Job Card (Keeping your UI work!)
            const cardDetails = document.getElementById('cardDetails');
            let detailsHTML = `<h4>${selectedItem} Details</h4><hr>`;
            
            for (const [key, value] of Object.entries(measurements)) {
                detailsHTML += `<p><strong>${key.toUpperCase()}:</strong> ${value} inches</p>`;
            }
            
            cardDetails.innerHTML = detailsHTML;
            document.getElementById('jobCard').style.display = 'block';
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server. Is your server.js running?");
    }
}


function loadStoredMeasurements() {
    const saved=localStorage.getItem('userMeasurements');
    const displaydiv=document.getElementById('savedDisplay');
    const content=document.getElementById('displayContent');


    if (saved) {
        const data = JSON.parse(saved);
        displayDiv.style.display = 'block';
        
        // Clear old text first
        content.innerHTML = ""; 

        // Loop through the data and make it look nice
        for (const [key, value] of Object.entries(data)) {
            content.innerHTML += `<strong>${key.toUpperCase()}:</strong> ${value} inches<br>`;
        }
    }
}

function clearMeasurements() {
    // 1. Wipe the browser's memory
    localStorage.removeItem('userMeasurements');

    // 2. Clear the input boxes on the screen
    const container = document.getElementById('measurementInputsContainer');
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    // 3. Hide the display box
    document.getElementById('savedDisplay').style.display = 'none';

    alert("Data cleared successfully!");
}
loadStoredMeasurements();