import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGO_URL);

// connect express
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());


const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("MongoDB is connected");
    return client;
}
const client = await createConnection();


app.get("/", function (request, response) {     
    response.send("Backend Application for assign-mentor");
});

// create a student
app.post("/student", async function (request, response) {       
    const data = request.body;
    console.log(data);
    const result = await client.db("assignMentor").collection("student").insertMany(data);
    console.log(result);
    response.send(result);

});

app.get("/student", async function (request, response) {          
    console.log(request.query);
    const students = await client.db("assignMentor").collection("student").find(request.query).toArray();
    response.send(students);
});

// create a mentor
app.post("/mentor", async function (request, response) {          
    const data = request.body;
    console.log(data);
    const result = await client.db("assignMentor").collection("mentor").insertMany(data);
    console.log(result);
    response.send(result);
});
app.get("/mentor", async function (request, response) {            
    console.log(request.query);
    const mentors = await client.db("assignMentor").collection("mentor").find(request.query).toArray();
    response.send(mentors);
});


// assign students to a mentor
app.put("/mentor/:id", async function (request, response) {       
    const { id } = request.params;
    const data = request.body;
    console.log(request.params, id);
    const mentor = await client.db("assignMentor").collection("mentor").updateOne({ id: id },{$set:data});
    console.log(mentor);
    mentor? response.send(mentor) : response.send({ msg: "Mentor not found" });
});

app.put("/student/:id", async function (request, response) {       
    const { id } = request.params;
    const data = request.body;
    console.log(request.params, id);
    const student = await client.db("assignMentor").collection("student").updateOne({ id: id },{$set:data});
    console.log(student);
    student? response.send(student) : response.send({ msg: "Student not found" });
});

// to view all the students
app.get("/mentors/:id", async function (request, response) {        
    const { id } = request.params;
    console.log(request.params, id);
    const studentfind = await client.db("assignMentor").collection("mentor").findOne({id:id});
    const student= await client.db("assignMentor").collection("student").findOne({mentorid:id});
    console.log(studentfind, student);
    const result =[studentfind, student];
    response.send(result);
});


app.listen(PORT, () => console.log(`Server running in ${PORT}`));