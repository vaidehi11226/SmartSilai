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