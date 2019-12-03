const exp = require('express');
const path = require('path');
const pinyin = require('pinyinlite');

const app = exp();



app.use(exp.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000);