const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();



mongoose.connect("mongodb://127.0.0.1:27017/dailyblogDB",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
  console.log("Connected to MongoDB successfully");
}).catch((err)=>{
  console.log(err);
})


const postsSchema = new mongoose.Schema({
    title:String,
    img_url:String,
    content:String
});

const Post = mongoose.model("Post",postsSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

app.get("/", function(req,res)
{
    async function getData()
    {
        const foundPosts = await Post.find();
        res.render("home",{posts:foundPosts});
    }
    getData();
})

app.get("/posts/:postName",(req,res)=>{

    const requestedTitle=req.params.postName;
   // console.log(requestedTitle);
    async function getData()
    {
        const foundPosts = await Post.find();
        foundPosts.forEach(function(foundPost)
        {
            if(_.lowerCase(requestedTitle)===_.lowerCase(foundPost.title))
            {
                const storedTitle = foundPost.title;
                const url = foundPost.img_url;
                let content=foundPost.content;
                let paragraphs = content.split('\n');
                paragraphs = paragraphs.map(paragraph => `<p>${paragraph}</p>`);
                content = paragraphs.join('');

                res.render("post",{Title:storedTitle,img_url:url,content:content})
            }
            else{
                console.log("Not Found");
            }
        })
    };
    getData();
});

app.get("/compose" , function(req,res)
{
  res.render("compose");
});

app.post("/compose" ,function(req,res)
{

  title = req.body.postTitle;
  url = req.body.postImgURL;
  body = req.body.postBody;


  const post = new Post({
    title:title,
    img_url:url,
    content:body
   });
   post.save();
  //posts.push(post);
  res.redirect("/");
  
});

app.get("/about" , function(req,res)
{
  res.render("contact" , {Title:"About Us",content:aboutContent});
});

app.get("/contact" , function(req,res)
{
  res.render("contact" , {Title:"Contact",content:contactContent});
});





app.listen(5000,function(){
    console.log("Server started on port 5000 ")
});