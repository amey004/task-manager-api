//CRUD create read update delete

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL,{useNewUrlParser: true},(error,client)=>{
  if (error) {
    return console.log("Unable to connect to database!");
  }

  const db = client.db("task-manager");

  // db.collection('users').findOne({_id :new ObjectID("5fbc93d699076e4fd41335e8")},(error,user)=>{
  //     if (error) {
  //         return console.log(error)
  //     }

  //     console.log(user)
  // })

  // db.collection('users').find({age:18}).toArray((error,users)=>{
  //     console.log(users)
  // })

  // db.collection('users').find({age:18}).count((erroe,count)=>{
  //     console.log(count)
  // })

  // db.collection('tasks').findOne({_id:new ObjectID('5fbc95c7af4ca80204559ece')},(error,users)=>{
  //     console.log(users)
  // })

  // db.collection('tasks').find({completed:false}).toArray((error,users)=>{
  //     console.log(users)
  // })

//     db.collection("users").updateOne(
//     { _id: ObjectID("5fbe9116626a613da4b9764b") },
//     {
//         $inc:{
//             age:-1
//         }
//     }
//   ).then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
  //update returns Promise if no callback passed

//   db.collection('tasks').updateMany({completed:false},{
//       $set:{
//           completed:true
//       }
//   }).then((result)=>{
//       console.log(result)
//   }).catch((error)=>{
//       console.log(error)
//   })


// db.collection('users').deleteMany({ 
//     age:18
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })

db.collection('tasks').deleteOne({
    task:'Fuck'
}).then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})

}) 