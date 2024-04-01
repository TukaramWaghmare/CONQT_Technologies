const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Database connection
const connection = mysql.createConnection({
  host: 'nodejs-technical-test.cm30rlobuoic.ap-southeast-1.rds.amazonaws.com',
  user: 'admin',
  password: 'ZoutTemBLIA0HPXUKGXP',
  database: 'conqtvms_dev', // Replace 'your_database_name' with your actual database name
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Endpoint for fetching product details
app.get('/products', (req, res) => {
    try{
            // Parse query parameters
        const { currentPage = 1, pageSize = 20, orderBy = 'createdAt', orderDir = 'desc', searchBy = '', searchFields = [] } = req.body;


        // Build SQL query
        let sql = `SELECT * FROM Products`;

        if (searchBy && searchFields.length > 0) {
            sql += ` WHERE ${searchFields.map(field => `${field} LIKE '%${searchBy}%'`).join(' OR ')}`;
        }

        const offset = (currentPage - 1) * pageSize;
        sql += ` ORDER BY ${orderBy} ${orderDir} LIMIT ${pageSize} OFFSET ${offset}`;

        // Execute query
        connection.query(sql, (err, results) => {
            if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
            }
            res.json({
            currentPage: parseInt(currentPage),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(results.length / pageSize),
            totalCount: results.length,
            data: results
            });
        });
    }catch(err){
        req.json({error:`Error while getting the product :: ${err.message}`})
    }
 
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
