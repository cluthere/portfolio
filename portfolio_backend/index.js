import dbConnect from "./db/dbConnect.js";
import app from "./app.js";


dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is listening on port: ${process.env.PORT}`)
    });
})
.catch((error)=>{
    console.log(`there's some error on index.js: ${error}`)
});