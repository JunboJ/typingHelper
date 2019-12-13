const request = require('request');
const uuidv4 = require('uuid/v4');

// var key_var = '58b60fa25e964fffaa759a72d93eaca9';
// if (!process.env[key_var]) {
//     throw new Error('Please set/export the following environment variable: ' + key_var);
// }
const subscriptionKey = '4b1e5ee9ccd64105afb218470e25249e';
// var endpoint_var = 'https://australiaeast.api.cognitive.microsoft.com/';
// if (!process.env[endpoint_var]) {
//     throw new Error('Please set/export the following environment variable: ' + endpoint_var);
// }
const endpoint = 'https://api.cognitive.microsofttranslator.com/';


const test = () => {
    let options = {
        method: 'POST',
        baseUrl: endpoint,
        url: 'transliterate',
        qs: {
            'api-version': '3.0',
            'language': 'zh-Hans',
            'fromScript': 'Latn',
            'toScript': 'Hans'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        body: [{
            'Text': 'womenzaixuexizhongwen'
        }],
        json: true,
    };

    // let options = {
    //     method: 'GET',
    //     baseUrl: endpoint,
    //     url: 'languages',
    //     qs: {
    //         'api-version': '3.0',
    //     },
    //     headers: {
    //         'Content-type': 'application/json',
    //         'X-ClientTraceId': uuidv4().toString()
    //     },
    //     json: true,
    // };

    request(options, function (err, res, body) {
        console.log(JSON.stringify(body, null, 4));
    });
};

test();