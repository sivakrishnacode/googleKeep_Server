const express = require('express')

const mongoose = require('mongoose')

const app = express()


// MongoDB config
const url = 'mongodb+srv://admin-siva:admin-siva@cluster0.a8xkzs5.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(url,{  useUnifiedTopology: true })
    .then(() => console.log("DataBase connected succesfully"))
    .catch((err) => console.log('error in db connection', err))

const userSchema = mongoose.Schema({
    data :{ type : String, required : true}
})

const ToDoItems = mongoose.model('ToDoItems', userSchema)

// config end


app.post('/addItem', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const data = req.query.data

    
         const  newData = new ToDoItems({data : data})
         newData.save()
         .then(() => {
            console.log('Data added Successfully');
            let tempRes = {
                status : 200,
                response: 'Data added successfully'
            }
            res.json(tempRes)
         })
   
})

app.get('/getItems', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    ToDoItems.find()

    .then((response) => {
        let temp = [] ;
      console.log('Data retrieved successfully');
      response.map((item) => {
        temp.push({
            data : item.data,
            id : item._id
        })
      })
      
      res.json(temp);
    })
    .catch((err) => {
      console.log('Error retrieving data:', err);
      let tempRes = {
        status: 500,
        response: 'Error retrieving data'
      };
      res.json(tempRes);
    });
})

app.post('/removeItem', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if( req.query.id !== '*'){

        ToDoItems.findByIdAndRemove({_id : req.query.id})
        .then((response) => {
            if(response){
                console.log('Removed successfully')
                res.status(200)
                res.send({
                    status: 200,
                    message: 'Item Removed Succesfully'
                })
            }
        })
    }else{
        ToDoItems.deleteMany({})
        .then((result) => {
          console.log('Documents removed:');
          res.status(200)
          res.send({
              status: 200,
              message: 'All Item Removed Succesfully'
          })
        })
       
    }
   
   
})



app.listen(3000, () => {
    console.log('Server Running On Port - 3000')
})
