const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors({origin: "*"}))

const port = 3000;

app.listen(port, () => console.log(`Running on port ${port}`));

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
    version: '2020-04-01',
    authenticator: new IamAuthenticator({
        apikey: '4Puang-ho1mzrtvJ1yJfBG4faDfBYn6v5-aUfpWwIH6o',
    }),
    url: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/31d98c71-b545-4213-8110-a7193e7978dd',
});

assistant.createSession({
    assistantId: 'dcba52b1-f09d-4350-bb71-ae11fef39ba6'
})
.then(res => {
    console.log(JSON.stringify(res.result, null, 2));
    session_id = res.result.session_id;
    
    app.post('/conversation/', (req, res) => {
        const { text, context = {} } = req.body;
        const params = {
            assistantId: 'dcba52b1-f09d-4350-bb71-ae11fef39ba6',
            sessionId: session_id,
            input: {text} ,
            context,
        }; 
        
        assistant.message(params, (err, response) => {
            if (err) {
                console.error(err);
                res.status(500).json(err);
            } else {
                res.json(response['result']['output']['generic'][0].text);
            }
        });
    })
})
.catch(err => {
    console.log(err);
});