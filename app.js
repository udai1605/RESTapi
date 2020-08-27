//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model('Article', articleSchema);



app.route('/articles')
    .get(function (req, res) {               //THis method is called CHAINED-ROUTE
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Succesfully Added ");
            } else {
                console.log(err)
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Succesfully deleted")

            } else {
                res.send(err)
            }
        })
    });

//////////////////////////////// To Tarhet a specific Article////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        
        Article.findOne({title : req.params.articleTitle},function (err, foundArticle) {
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No such article found!");
            }
        });
    })
    .put(function(req,res){
        Aricle.updste(
            {title:req.params.articleTitle},
            {title:req.params.title, content:req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Sucessfully Updated");
                }else{
                    res.send(err);
                }
            }
        );

    })
    .patch(function (req, res){
        Article.update(
            {title:req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Sucessfully Updated");
                }else{
                    res.send(err);
                }
            }
        );
    })
    .delete(function(err,res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Sucessfully Deleted");
                }else{
                    res.send(err);
                }
            }
        );
    });





















// app.get("/articles",function(req,res){
//     Article.find({}, function(err,foundArticles){
//         if(!err){
//             res.send(foundArticles);
//         }else{
//             res.send(err);
//         }
//     })
// })

// app.post("/articles",function(req,res){

//     const newArticle= new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function(err){
//         if(!err){
//             res.send("Succesfully Added ");
//         }else{
//             console.log(err)
//         }
//     });
// })

// app.delete('/articles',function(req, res){
//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("Succesfully deleted")

//         }else{
//             res.send(err)
//         }
//     })
// })
app.listen(3000, function () {
    console.log("Server started on port 3000");
});