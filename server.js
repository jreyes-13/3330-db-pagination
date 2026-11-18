import express from "express";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  password: "",
  host: "localhost",  
  port: 5432,
  database: "",  
});

db.connect();

app.use(express.static("public"));

let customers; // to hold customer data from DB

// test: http://localhost:3000/customers?phone=9561234074
app.get("/customers", async (req, res) => {
  console.log("Retrieving data from the CUSTOMERS table ... ")
  
  try{
    const phone = req.query.phone;
    
    const query = `SELECT * FROM customers WHERE phone = $1 `;
    
    const result = await db.query(query, [phone]);
    customers = result.rows;

    res.status(200).json({
      data: customers,
      count: customers.length
    });
    
  } catch(err){
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
