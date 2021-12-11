import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import cors from "cors";  

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
// const stackOverFlow = [{"id":"10","qn":"Batch create scripts with line updated in each one based on a list","tag1":"html","tag2":"css","tag3":"javascript","answers":"I am looking to generate multiple script files with a line to a file path in each updated based on a list of file paths, with a new copy of the file generated once the file path is updated.For example, the below line (LOC_PATH) in each new script file needs to be the next in the list, which I have as a list in excel currently."},
// {"id":"11","qn":"How can I alter this computed column in SQL Server 2008?","tag1":"sql","tag2":"tsql","tag3":"sql-server","answers":"I have a computed column created with the following line: alter table tbPedidos add restricoes as (cast(case when restricaoLicenca = 1 or restricaoLote = 1 then 1 else 0 end as bit))"},
// {"id":"12","qn":"Skipping random lines when using pandas read_table","tag1":"python","tag2":"python-3x","tag3":"pandas","answers":"The pandas read_table() function enables us to read *.tab file and the parameter skiprow provides flexible ways to retrieve the data. However, I'm in trouble when I need to read *.tab file in a loop but the number of the rows need to skip is random. For example, the contents need to skip are started with /* and ended with */ , such as:/*... The number of rows need to skip is random...*/"},
// {"id":"13","qn":"how configure maven plugin repository","tag1":"maven","tag2":"plugin","tag3":"repository","answers":"I'm developing new Java project depending on third party library using maven 3.8.4 as build tool. I would add that library to my local maven repository with install:install-file option. When I execute the command, I get the error"},
// {"id":"14","qn":"WPF DataGridComboBox dynamic dropdown","tag1":"WPF","tag2":"DataGrid","tag3":"dynamic","answers":"Within a more complex DataGrid, I have a DataGridComboBoxColumn, a section of the XAML is: <DataGridComboBoxColumn x:Name=PrimaryProcessColumn"}];

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;
// here we are going to make connection between node and mongodb
 async function createConnection(){
	 const client =  new MongoClient(MONGO_URL); // this new for avoid (some time) because conection takes some time
	 await client.connect();  // it returns promise (this step takes some time to connect the database so we can do either async await or .then)
	 console.log("Mongodb Connected");
	 return client;
 }
 //call the function
 //this is for got the client
 const client = await createConnection();

app.get("/",(request,response)=>{
    response.send("hello world  (for get all stackoverflow details  -  `/stackoverflow`), (for get stackoverflow details by id - `/stackoverflow/61aed5c2fe3716b4e0b09cc9`), we can post edit details");
});

app.get("/stackoverflow", async (request,response)=>{
    const stack = await client 
    .db("b28wd")
    .collection("stack")
    .find({})
    .toArray();
    response.send(stack);
});

app.get("/stackoverflow/:id", async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const stackresult = await getStackById(id);
    console.log(stackresult);

    stackresult? response.send(stackresult) : response.status(404).send({message:"no matching movie found"});
});

app.post("/stackoverflow", async (request,response)=>{
    const data = request.body;
    const result = await client.db("b28wd").collection("stack").insertOne(data);
    response.send(result);
    });

    app.put("/stackoverflow/:id", async (request,response)=>{
        console.log(request.params);
        const {id} = request.params;
        const data = request.body;
        const result = await editStackById(id, data);
        const stackresult = await getStackById(id);
        console.log(result);
        response.send(stackresult);
    });
    async function editStackById(id, data) {
        return await client
            .db("b28wd")
            .collection("stack")
            .updateOne({ _id: ObjectId(id) }, { $set: data });
    }
    async function getStackById(id) {
        return await client
            .db("b28wd")
            .collection("stack")
            .findOne({ _id: ObjectId(id) });
    }

app.listen(PORT,()=>console.log("App is started in", PORT));