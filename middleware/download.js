const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const MongoClient = require('mongodb');

module.exports.getFile = (fileName, res) => {  
    
    let fileName = req.params.username;  
    
    //Connect to the MongoDB client
    MongoClient.connect(url, function(err, client){
        if(err){      
            return res.render('index', {
                title: 'Uploaded Error', 
                message: 'MongoClient Connection error', error: err.errMsg
            });    
        };   

        const db = client.db('myFirstDatabase');
        const collection = db.collection('photos.files');     
        const collectionChunks = db.collection('photos.chunks');

        collection.find({filename: fileName}).toArray(function(err, docs){        
            if(err){        
                return res.render('index', {
                title: 'File error', 
                message: 'Error finding file', 
                error: err.errMsg});      
            }

            if(!docs || docs.length === 0){        
                return res.render('index', {
                title: 'Download Error', 
                message: 'No file found'});      
            }else{
        
                //Retrieving the chunks from the db          
                collectionChunks.find({files_id : docs[0]._id})
                    .sort({n: 1}).toArray(function(err, chunks){          
                        if(err){            
                            return res.json({
                            title: 'Download Error', 
                            message: 'Error retrieving chunks', 
                            error: err.errmsg});          
                        }
                        if(!chunks || chunks.length === 0){            
                            //No data found            
                            return res.json({
                                title: 'Download Error', 
                                message: 'No data found'});          
                        }
        
                        let fileData = [];          
                        for(let i=0; i<chunks.length;i++){            
                            //This is in Binary JSON or BSON format, which is stored               
                            //in fileData array in base64 endocoded string format               
                        
                            fileData.push(chunks[i].data.toString('base64'));          
                        }
            
                        //Display the chunks using the data URI format          
                        let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');          
                        res.json({
                            title: 'Image File', 
                            message: 'Image loaded from MongoDB GridFS', 
                            imgurl: finalFile
                        });
                    });      
            }          
        });  
    });
};