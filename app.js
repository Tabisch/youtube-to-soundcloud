//required packages
const express = require("express");
const fetch = require("node-fetch")
const { exec } = require('child_process');
const { stdout, stderr } = require("process");
require("dotenv").config();

//express server
const app = express();

const port = process.env.Port || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({
    extended:true
}))

app.use(express.json());

app.get("/",(req, res) => {
    res.render("index")
})

app.get('/download', function(req, res){
    const videoID = req.query.videoID;
    console.log(`requested download for ${videoID}`)
    const file = `${__dirname}\\public\\downloads\\${videoID}.mp4`;
    res.download(file); // Set disposition and send it.
  });

app.post("/convert-mp3", async (req, res) => {
    const videoID = req.body.videoID;
    if(videoID === "undefined" ||
    videoID === "" ||
    videoID === null)
    {
        return res.render("index", {success : false, message: "please enter a video ID"})
    }
    else{
        console.log(`download started ${videoID}`)
        exec(`youtube-dl.exe https://www.youtube.com/watch?v=${videoID} -f mp4 -o ${__dirname}\\public\\downloads\\${videoID}.mp4`,(err,stdout,stderr) => {
            if(err)
            {
                console.log(err)
            }
            else
            {
                exec(`youtube-dl.exe https://www.youtube.com/watch?v=${videoID} --write-info-json -o ${__dirname}\\public\\downloads\\${videoID}`,(err,stdout,stderr) => {})
                console.log(`download finished ${videoID}`)
                return res.render("index", {success : true, song_link: `/download?videoID=${videoID}`, song_title: videoID})
            }
        })
    }
})

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});