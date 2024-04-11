//include required modules
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb"); //import MongoClient from mongodb so we can create a client

//DB SETTINGS
const dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);

//set up Express app and port number
const app = express();
const port = process.env.PORT || "8888";

//SET UP APP TO USE PUG AS TEMPLATE ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//SET UP STATIC FILE PATHS
app.use(express.static(path.join(__dirname, "public")));

//SET UP APP TO USE JSON FOR FORM DATA
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//SET UP PAGE ROUTES
app.get("/", async (request, response) => {
  let links = await getLinks();
  console.log(links);

  response.render("index", { pageTitle: "Home", menu: links });
});
app.get("/about", async (request, response) => {
  let links = await getLinks();

  response.render("about", { pageTitle: "About", menu: links });
})
//ADMIN PAGES
app.get("/admin/menu", async (request, response) => {
  let links = await getLinks();

  response.render("menu-admin", { pageTitle: "Administter menu links", menu: links });
})
app.get("/admin/menu/add", async (request, response) => {
  let links = await getLinks(); //we just need this because the menu-add template is using the common layout, which needs the links for displaying the main menu in the header

  response.render("menu-add", { pageTitle: "Add menu link", menu: links });
})

//FORM PROCESSING PATHS
app.post("/admin/menu/add/submit", async (request, response) => {
  //POST forms send the form field data via request.body.<field-name> because POST requests send data in the body
  //GET forms send the form field data via request.query.<field-name>
  //console.log(request.body.weight);
  let wgt = request.body.weight;
  let href = request.body.path;
  let name = request.body.name;
  let newLink = { "weight": wgt, "path": href, "name": name}
  addLink(newLink); //insert new link to menuLinks

  response.redirect("/admin/menu");
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

app.post("/admin/menu/edit/submit", async(request, response) =>{
    //Post forms send the form field data via request.body.<field-name>
    //Get form send the doem field data via request.query.<field-name>
    
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

app.get("/admin/menu/delete", async (request, response) => {
    //get linkId value
    let id = request.query.linkId;
    await deleteLink(id);
    response.redirect("/admin/menu");
});

//start server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})

//DATABASE HELPER FUNCTIONS 

//Function to select testdb as the database and return it.
async function connection() {
  db = client.db("testdb"); //select testdb
  return db;
}

//Function to return all documents from the menuLinks collection.
async function getLinks() {
  db = await connection();
  let results = db.collection("menuLinks").find({}); //select all
  resultsArray = await results.toArray(); //toArray() is an async function
  return resultsArray;
}

//Function to insert document into menuLinks collection using insertOne().
async function addLink(link) {
  db = await connection();
  let status = await db.collection("menuLinks").insertOne(link);
  console.log("link added");
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