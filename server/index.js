const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());


const languageMap = {
    "python": 71,
    "cpp": 54,      
    "java": 62,
    "javascript": 63,
    "csharp": 51,
    "ruby": 72,
    "go": 60,
    "php": 68
};


app.post("/compile", async (req, res) => {
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    
    if (language.value) {
        language = language.value.toLowerCase(); 
    }

    const languageId = languageMap[language];

    if (!languageId) {
        return res.status(400).send({ error: "Unsupported language" });
    }

    const data = {
        "source_code": code,
        "language_id": languageId,
        "stdin": input
    };

    console.log("Request Data:", data);

    const config = {
        method: 'post',
        url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': '' 
        },
        data: data
    };

    try {
        const response = await Axios(config);
        res.send(response.data);
    } catch (error) {
        console.error("Error Response:", error.response ? error.response.data : error.message);
        res.status(500).send({ error: "Error compiling code" });
    }
});


app.get("*", (req, res) => {
    res.status(404).send("Invalid endpoint");
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
