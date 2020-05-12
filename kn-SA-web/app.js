var express = require('express');
var app = express();
var pyshell = require('python-shell');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

app.set("view engine", "ejs");

var formidable = require('formidable');
var fs = require('fs');


//index page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/templates/" + "index.htm");
});



//text conversion page
app.get('/text_conversion', function (req, res) {
    res.render("text_conversion", {
        pos: ' ',
        neg: ' ',
        pos_count: 0,
        neg_count: 0
    });
});


app.post('/text_conversion', (req, res) => {
    var text = req.body.text;
    lexicon_process(text, res);
});


//file conversion page
app.get('/file_conversion', function (req, res) {
    res.render("file_conversion", {
        pos: 33,
        neg: 33,
        neut: 33,
        pos_count: 0,
        neg_count: 0
    });
});

app.post('/file_conversion', (req, res) => {


    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {


        var cnt_file_path = require('path').join(__dirname, '/public/uploaded_documents/count.txt');
        let count_number = count_txt_python(cnt_file_path);

        var oldpath = files.filetoupload.path;
        var oldname = files.filetoupload.name;
        var datetime = new Date();
        var newname = count_number + datetime.toISOString() + '_' + oldname;

        var file_path = require('path').join(__dirname, '/public/uploaded_documents/');

        var newpath = file_path + newname;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            var newfilepath = require('path').join(__dirname, '/public/uploaded_documents/');
            var newpath=newfilepath+newname;
            file_process(newpath, res);
        });
    });
});

//functions  
function lexicon_process(text, res) {
    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [text]
    };

    pyshell.PythonShell.run('scripts/text_conversion.py', options, function (err, results) {
        if (err)
            throw err;
        let positive_words = []; let negative_words = []; let i = 0;
        //console.log('results: %j', results);
        for (i = 0; i < results.length; i++) {
            if (results[i] == 'neg')
                break;
            else {
                positive_words[i] = results[i];
            }
        }

        let k = 0; i++;
        while (i < results.length) {
            negative_words[k] = results[i];
            i++;
            k++;
        }


        i = 0; k = 0;
        res.render("text_conversion", {
            pos: positive_words,
            neg: negative_words,
            pos_count: positive_words.length,
            neg_count: negative_words.length
        });
    });

}






function file_process(file_name, res) {

    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [file_name]
    };

    pyshell.PythonShell.run('scripts/file_conversion.py', options, function (err, results) {
        if (err)
            throw err;
        let positive_words = []; let negative_words = []; let i = 0;
        for (i = 0; i < results.length; i++) {
            if (results[i] == 'neg')
                break;
            else {
                positive_words[i] = results[i];
            }
        }

        let k = 0; i++;
        while (i < results.length) {
            negative_words[k] = results[i];
            i++;
            k++;
        }

        let neutral_count = results.length - positive_words.length - negative_words.length;
        i = 0; k = 0;
        res.render("file_conversion", {
            pos: positive_words,
            neg: negative_words,
            neut: neutral_count,
            pos_count: positive_words.length,
            neg_count: negative_words.length
        });
    });

}


function count_txt_python(text) {
    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [text]
    };

    pyshell.PythonShell.run('scripts/count.py', options, function (err, results) {
        if (err)
            throw err;
        return results[0];

    });

}


//end
app.listen(process.env.PORT || 3000, function () {
    var datetime = new Date().toISOString().replace(/T/, " - ").replace(/\..+/, "");
    console.log(datetime)
    console.log("NodeJS " + process.version);
    console.log("Starting %s server at http://127.0.0.1:%d", app.settings.env, this.address().port);
    console.log("Quit the server with CONTROL-C.");
});
