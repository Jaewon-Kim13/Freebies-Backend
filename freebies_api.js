import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
//allows front end to connect to backend
app.use(cors());
//sends data as json
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'cs4347project',
})

//Test response
app.get("/", (req, res) => {
    res.json("FREEBIES TEST");
})

//Gets all listings
app.get("/listings", (req, res) =>{
    const q =  "SELECT * FROM listings INNER JOIN user_listings ON listings.ListingID=user_listings.ListingID"+ 
    " INNER JOIN categorized ON categorized.ListingID=user_listings.ListingID"
    db.query(q, (err, data)=>{
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})


//handles filtering request
app.get("/filtered/:category/:name/:low/:high", (req, res) =>{
    let selectListings = "SELECT * FROM listings";
    let joinUserListingsAndCatagories = " INNER JOIN user_listings ON listings.ListingID=user_listings.ListingID"+ 
                        " INNER JOIN categorized ON categorized.ListingID=user_listings.ListingID";
    const {category, name, low, high} = req.params;
    let whereListings = " WHERE";

    let hasPrev = false;
    if(category != "NONE"){
        whereListings+=" CItemId = "+category;
        hasPrev = true;
    }
    if(name != "NONE"){
        if (hasPrev) whereListings+= " AND"
        whereListings+=" TitemID = "+name;
        hasPrev = true;
    }
    if(low != 'z'){
        if (hasPrev) whereListings+= " AND"
        whereListings+=" Price > "+low;
        hasPrev = true;
    }
    if(high != 'z'){
        if (hasPrev) whereListings+= " AND"
        whereListings+=" Price <"+high;
    }

    let query=selectListings+joinUserListingsAndCatagories;
    query += whereListings;

    db.query(query, (err, data)=>{
        if(err){
            return res.json(err)
        }
        return res.json(data);
    })

    
})

//Gets catagories
app.get("/listing-categories", (req, res) =>{
    const catagories =  "SELECT * FROM categories"
    db.query(catagories, (err, data)=>{
        if(err){
            return res.json(err)
        }
        return res.json(data);
    })
})

//startMySql();
app.listen(8800, () => {
	console.log("Backend Connection Established");
});