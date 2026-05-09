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

function saveMeasurements() {
    const container = document.getElementById('measurementInputsContainer');
    const inputs = container.querySelectorAll('input');
    let measurements = {};
    let allFilled = true; // Start by assuming everything is fine

    inputs.forEach(input => {
        // If the box is empty, mark it as not filled
        if (input.value.trim() === "") {
            allFilled = false;
        }
        measurements[input.name] = input.value;
    });

    // 1. First check: Did they even pick a category?
    if (inputs.length === 0) {
        alert('Please select an item and generate inputs first!');
        return;
    }

    // 2. Second check: Are any of the boxes empty?
    if (!allFilled) {
        alert('Please fill in ALL measurement fields before saving.');
        return;
    }

    // If we get here, it means everything is perfect!
    console.log('Saved Measurements:', measurements);
    localStorage.setItem('userMeasurements', JSON.stringify(measurements));
    alert('Measurements saved successfully to local storage!');


    // ... (inside saveMeasurements, after localStorage.setItem)

const jobCard = document.getElementById('jobCard');
const cardDetails = document.getElementById('cardDetails');

// Build the content for the card
let detailsHTML = `
    <p><strong>Customer:</strong> ${measurements.customerName}</p>
    <p><strong>Date:</strong> ${measurements.orderDate}</p>
    <hr>
`;

// Add each measurement to the card
for (const [key, value] of Object.entries(measurements)) {
    if (key !== 'customerName' && key !== 'orderDate') {
        detailsHTML += `<p><strong>${key.toUpperCase()}:</strong> ${value} inches</p>`;
    }
}

cardDetails.innerHTML = detailsHTML;
jobCard.style.display = 'block'; // Show the card!

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