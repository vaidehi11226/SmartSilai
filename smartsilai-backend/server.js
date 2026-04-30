// --- DATABASE CONNECTION TEST ---

// Import our custom "Bridge" from the db.js file. 
// The './' tells Node to look in our current folder for the file named 'db'.
const pool =require('./db');
const express= require('express');
const app=express();
const PORT=5000;

// Essential: This allows Express to read the JSON you send via Thunder Client
app.use(express.json());

// We run a simple "Handshake" query. 
// We ask the database for the current time ('SELECT NOW()') to see if it's awake.
/// Asks for the database's internal time
//  to test the connection without needing any real data tables.
pool.query('SELECT NOW()', (err,res)=>{
    if(err)
    {
        console.error('Database Connection Error:',err.stack);
    }
    else{
        // We look at the first row [0] and the column named 'now'.
        //Because we ran SELECT NOW(), PostgreSQL automatically names that column "now".
        console.log('Database Connected ! Server Time:',res.rows[0].now);
    }
});


// basic route


//called as route handler
//(request,response)  users send request to server and server sends response to users
app.get('/',(req,res)=>{
    res.send('SmartSilai Backend is running');
});

//project : "SmartSilai",  is key value pair... 
// Here as /status is the endpoint and when user hits this endpoint, 
// server will send json response with project name, status and sprint number
app.get('/status',(req,res)=>{
    res.json({
        project : "SmartSilai",
        status : "Healthy",
        sprint : 1
    });
});


//--- 4. DAY 3: TAILOR REGISTRATION ROUTE ---
// Define a 'POST' route at '/register' that waits for DB tasks without freezing the app
//req.body: This is where the JSON data you typed in Thunder Client lives.
app.post('/register',async(req,res)=>{
    const{
        full_name, phone_number, shop_name, password, 
        specialization, bio, profile_pic_url, shop_address, location_url,shop_type
    }=req.body;
    //$1 tells the database to treat the data as text only, making it 100% safe.
    //RETURNING *: By default, PostgreSQL just says "OK, saved." But we want to see the result! 
    //This command tells the database to send back the row it just created, including the new ID
    try{
        const result= await pool.query(
            `INSERT INTO tailors
            (full_name, phone_number, shop_name, password, specialization, bio, profile_pic_url, shop_address, location_url,shop_type)
            VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [full_name, phone_number, shop_name, password, specialization, bio, profile_pic_url, shop_address, location_url,shop_type]
        );
        res.status(201).json({message: "Boutique Profile Live! 🧵📍",tailor:result.rows[0]});
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//--- 5. DAY 3: POST PORTFOLIO WORK ROUTE ---
app.post('/post_work',async (req,res) => {
    const{tailor_id,image_url, description} = req.body;
    try{
        const result=await pool.query(
            `INSERT INTO posts(tailor_id,image_url,description)
            VALUES ($1, $2, $3) RETURNING *`,
            [tailor_id, image_url, description]
        );
        res.status(201).json({message:"Work posted to portfolio! 📸👗", post: result.rows[0]});
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// --- DAY 4: GET ALL TAILORS (The Discovery Feed) ---
app.get('/tailors',async (req,res) =>{
    try{
        //We select everything except the password for safety!
        const allTailors = await pool.query(
            'SELECT id,full_name, shop_name, specialization, rating, profile_pic_url, shop_type FROM tailors ORDER BY rating DESC '
        );
        res.json(allTailors.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



// --- DAY 4: GET SPECIFIC TAILOR BY ID ---
app.get('/tailors/:id', async (req,res)=>{
    try{

        //Example: If you go to http://localhost:5000/tailors/7, 
        //then req.params is { id: 7 }. This line of code simply sets your variable id to equal 7.
        const { id } = req.params;//this grabs the id from the url
        const tailor = await pool.query('SELECT * FROM tailors WHERE id = $1',[id]);

        if (tailor.rows.length === 0){
            return res.status(404).json({message: "Tailor not found!"});
        }

        res.json(tailor.rows[0]);
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//-- Day 5 orders route
app.post('/orders', async (req, res) => {
    const client = await pool.connect(); // We need 'client' for Transactions
    try {
        const { 
            customer_id, tailor_id, gender, items, 
            advance_payment, total_amount 
        } = req.body;

        await client.query('BEGIN'); // Start the Transaction

        // 1. Create the Master Bill in 'orders' table
        const orderRes = await client.query(
            `INSERT INTO orders (customer_id, tailor_id, gender, advance_payment, total_amount) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [customer_id, tailor_id, gender, advance_payment, total_amount]
        );
        const orderId = orderRes.rows[0].id;

        // 2. Loop through the items array and save each item + its measurements
        for (let item of items) {
            // Save the item (Kurti, Pant, etc.)
            const itemRes = await client.query(
                `INSERT INTO order_items (order_id, category, fabric_type, pattern_desc, rough_sketch_url) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [orderId, item.category, item.fabric_type, item.pattern_desc, item.rough_sketch_url]
            );
            const itemId = itemRes.rows[0].id;

            // Save the measurements for THIS specific item
            await client.query(
                `INSERT INTO measurements (item_id, details) 
                 VALUES ($1, $2)`,
                [itemId, JSON.stringify(item.measurement_data)]
            );
        }

        await client.query('COMMIT'); // Save everything to the DB
        res.status(201).json({ message: "Bulk Order created successfully!", orderId });

    } catch (err) {
        await client.query('ROLLBACK'); // If anything fails, undo everything
        console.error(err.message);
        res.status(500).send("Server Error: Could not create bulk order.");
    } finally {
        client.release(); // Close the connection
    }
});


// Add a new customer
app.post('/customers', async (req, res) => {
    try {
        const { full_name, phone_number } = req.body;
        
        const newCustomer = await pool.query(
            "INSERT INTO customers (full_name, phone_number) VALUES($1, $2) RETURNING *",
            [full_name, phone_number]
        );

        res.status(201).json(newCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        // If the phone number already exists, Postgres will throw an error
        if (err.code === '23505') {
            return res.status(400).json({ error: "A customer with this phone number already exists." });
        }
        res.status(500).send("Server Error");
    }
});


//--DAY 6 Search route
app.get('/search_order/:name', async (req,res)=>{
    try{
        const {name}= req.params;
        const result = await pool.query(
            `SELECT
                c.full_name, c.phone_number,
                o.id AS bill_id, o.gender, o.total_amount, o.status AS bill_status,
                oi.id AS item_id, oi.category, oi.status AS item_status, oi.rough_sketch_url,
                m.details AS measurement_data
            FROM customers c
            LEFT JOIN orders o ON c.id=o.customer_id
            LEFT JOIN order_items oi ON o.id=oi.order_id
            LEFT JOIN measurements m ON oi.id=m.item_id
            WHERE c.full_name ILIKE $1`,
            [`%${name}%`]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }
        res.json(result.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Search Failed");
    }
});


// Change status of a specific item (e.g., mark a Kurti as 'Done')
app.put('/update_item_status/:item_id', async (req,res)=>{
    try{
        const {item_id}= req.params;
        const {status}=req.body; // Expecting { "status": "Completed" }

        const result= await pool.query(
            "UPDATE order_items SET status =$1 WHERE id= $2 RETURNING *",
            [status,item_id]
        );

        if(result.rows.length ===0){
            return res.status(404).json({ message: "Iteam not found"});
        }
        res.json({message: "Status updated!", item: result.rows[0]});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Day 7 Measurement
const {measurement_config, Measurement_config} =require('./constants');

// This tells the frontend EXACTLY what inputs to show
app.get('/api/config/measurements',(req,res)=>{
    res.json(Measurement_config);
});

// --- Quick Phone Search ---
app.get('/search_phone/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        const result = await pool.query(
            `SELECT c.full_name, c.phone_number, o.id AS bill_id, o.total_amount, oi.category, oi.status AS item_status
             FROM customers c
             LEFT JOIN orders o ON c.id = o.customer_id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE c.phone_number = $1`, 
            [phone]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: "Number not found" });
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Search Error");
    }
});

//The code inside the () => { ... } is a callback function.
//  It only runs once the server is successfully "attached" to the port.
//listen is mandatory to start the server and see it in specified port.
app.listen(PORT,()=>{
    console.log('Server is running on http://localhost:'+PORT);
})