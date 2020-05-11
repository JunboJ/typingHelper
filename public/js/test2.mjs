import { log, importDic } from './importTest.mjs';

console.log('loading library...');

importDic().then((dic) => {
    log();
    console.log('result in test2.mjs', dic);
}).catch(err => {
    console.log(err);
})