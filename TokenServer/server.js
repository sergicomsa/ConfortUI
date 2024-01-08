const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Use the default CORS configuration
app.use(express.json());

app.post('/api/postTelemetry', (req, res) => {
    try {
        let url = 'https://iot.cserintranet.com/api/auth/login'
        let headers = {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        };
        let data = {"username":process.env.TBUSER,"password":process.env.TBPASS,}
        return axios.post(url, data, { headers }).then(response => {
            url = 'https://iot.cserintranet.com/api/plugins/telemetry/ASSET/' + req.body.spaceId + '/timeseries/ANY';
            headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'X-Authorization': 'Bearer ' + response.data.token
              };
            data = req.body.data;
            axios.post(url, data, { headers }).then(response => {
                console.log('Response:', response);
                res.send('Data correctly saved!');
            }).catch(error => {
                console.error('ErrorTELE:', error.response.data);
            });
        }).catch(error => {
            console.error('ErrorCreds:', error.response);
            res.send(error.response);
        });
      } catch (err) {
        console.error('Error reading env:', err);
        res.status(500).send('Error reading env creds');
      }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
