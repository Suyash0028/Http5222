//include required modules
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

//DB settings
const dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);


//set up Express app and port number
const app = express();
const port = process.env.PORT || "8888";

//Set up app to ise PUG as template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "templates"));

// Set uo static file paths
app.use(express.static(path.join(__dirname, "public")));


//Set up app to use json 
app.use(express.urlencoded({ extended: true}));
app.use(express.json());


//Set up Page routes
app.get("/",async(request, response) =>{
    //response.status(200).send("Test Page");
    let links = await getLinks();
    console.log(links);
    response.render("index", {
        pageTitle: "Home", menu: links
    });
});

app.get("/about",async(request, response) =>{
    //response.status(200).send("Test Page");
    let links = await getLinks();
    console.log(links);
    response.render("about", {
        pageTitle: "About", menu: links
    });
});

//Admin pages

app.get("/admin/menu",async(request, response) =>{
    
    let links = await getLinks();

    response.render("menu-admin", {
        pageTitle: "Admin menu", menu: links
    });
})
app.get("/admin/menu/add",async(request, response) =>{
    
    let links = await getLinks();
    response.render("menu-add", {
        pageTitle: "Add Link", menu: links
    });
});

app.get("/admin/menu/edit",async(request, response) =>{
   
    if (request.query.linkId) {
        let linkToEdit = await getSingleLink(request.query.linkId);
        
        let links = await getLinks();
        response.render("menu-edit", { 
            pageTitle: "Edit menu link", menu: links, editLink: linkToEdit });
        } 
    else {
        response.redirect("/admin/menu");
    }
});

app.get("/admin/menu/delete", async (request, response) => {
    //get linkId value
    let id = request.query.linkId;
    await deleteLink(id);
    response.redirect("/admin/menu");
});


// Form processing paths
app.post("/admin/menu/add/submit", async(request, response) =>{
    //Post forms send the form field data via request.body.<field-name>
    //Get form send the doem field data via request.query.<field-name>
    //console.log(request.body);
    let wgt = request.body.weight;
    let path = request.body.path;
    let name = request.body.name;

    let doc = {
        "weight": wgt,
        "path": path,
        "name": name
    }

    addLink(doc);
    response.redirect("/admin/menu");
});

app.post("/admin/menu/edit/submit", async(request, response) =>{
    //Post forms send the form field data via request.body.<field-name>
    //Get form send the doem field data via request.query.<field-name>
    console.log(request.body._id);
    let idFilter = { _id: new ObjectId(request.body.linkId) };
    
    let wgt = request.body.weight;
    let path = request.body.path;
    let name = request.body.name;

    let doc = {
        $set:{
            "weight": wgt,
            "path": path,
            "name": name
        },
    };

    editLink(idFilter, doc); 
    response.redirect("/admin/menu");
});

//start server listening
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//Database helper functions

//Function to select testdb as the database as the database and return it

async function connection(){
    db = client.db("testdb");
    return db;
}

async function getLinks(){
    db = await connection();
    let results = db.collection("menuLinks").find({});

    resultArray = await results.toArray();
    return resultArray;
}

//Function to insert the document into the databse using inserone
async function addLink(newLink){
    db  = await connection();
    let status = db.collection("menuLinks").insertOne(newLink);

    console.log("Added");
    console.log(status);
}

async function getSingleLink(id) {
    db = await connection();
    editId = { _id: new ObjectId(id) };
    const result = await db.collection("menuLinks").findOne(editId);
    return result;
}

async function editLink(filter, link){
    db = await connection();
    
    const result = await db.collection("menuLinks").updateOne(filter, link);
    console.log("Updated");
    return result;
}

async function deleteLink(id) {
    db = await connection();
    const deleteId = { _id: new ObjectId(id) };
    const result = await db.collection("menuLinks").deleteOne(deleteId);
    if (result.deletedCount == 1)
        console.log("delete successful");
}