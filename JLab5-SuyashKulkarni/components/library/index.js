const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var xml;
let libNS = "http://www.opengis.net/kml/2.2";

async function loadXml() {
  if (xml == undefined) {
    let response = await fetch(
      "http://localhost:8888/library-data.kml",
      {
        method: "get",
        headers: {
          "Content-Type": "application/xml"
        }
      }
    );
    //convert XML string to XML DOM document
    data = new JSDOM(await response.text(), { contentType: "application/xml" });
    //console.log(data);
    xml = data.window.document; //set the xml to the XML DOM document which we can query using DOM methods
  }
  return xml;
}
async function loadLibraries() {
  xml = await loadXml();
  return xml.querySelectorAll("Document");
}

async function getLibraryById(id) {
  xml = await loadXml();
  return xml.getElementById(id);
}

module.exports = {
  loadLibraries,
  getLibraryById
};