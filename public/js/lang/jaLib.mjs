console.log('wanakana: ', wanakana);

export const get_ja = str => {
  const res = [];
  const convertToKana = str => {
    return wanakana.toKana(str);
  };
  if (str.length > 0) {
    const converted = convertToKana(str);
    res[0] = converted ? converted : null;
    return {
      resultString: str,
      partEnd: str.length,
      result: res,
      strL: str.length
    }
  } else {
    return null;
  }
};



// const request = require('request');
// const uuidv4 = require('uuid/v4');

// // var key_var = 'TRANSLATOR_TEXT_SUBSCRIPTION_KEY';
// // if (!process.env[key_var]) {
// //     throw new Error('Please set/export the following environment variable: ' + key_var);
// // }
// var subscriptionKey = '58b60fa25e964fffaa759a72d93eaca9';
// // var endpoint_var = 'TRANSLATOR_TEXT_ENDPOINT';
// // if (!process.env[endpoint_var]) {
// //     throw new Error('Please set/export the following environment variable: ' + endpoint_var);
// // }
// var endpoint = 'https://api.cognitive.microsofttranslator.com/transliterate?api-version=3.0';

// let options = {
//     method: 'POST',
//     baseUrl: endpoint,
//     url: 'transliterate',
//     qs: {
//       'api-version': '3.0',
//       'language': 'ja',
//       'fromScript': 'latn',
//       'toScript': 'jpan'
//     },
//     headers: {
//       'Ocp-Apim-Subscription-Key': subscriptionKey,
//       'Ocp-Apim-Subscription-Region': 'australiaeast',
//       'Content-type': 'application/json',
//     //   'Content-Length': 1,
//       'X-ClientTraceId': uuidv4().toString()
//     },
//     body: [{
//           Text: "wa"
//     }],
//     json: true,
// };

// request(options, function(err, res, body){
//     console.log(JSON.stringify(body, null, 4));
// });