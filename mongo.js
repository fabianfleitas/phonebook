const mongoose = require('mongoose')

const params = [...process.argv];

if (params.length !== 3 && params.length !== 5 ) {
    console.log('give correct arguments')
    process.exit(1)
  }

const password = params[2];

const url =
  `mongodb+srv://admin:${password}@cluster0.kf1cy9z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(params.length === 3 ){
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close()
    })
    
}else{
/* Note.find({important: false}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  }) */

const person = new Person({
    name: params[3],
    number: params[4],
})

person.save().then(result => {
  console.log(`added ${person.name} number ${person.number} to phonebook`)
}).
catch(err => {
    console.log(err);
}).
finally(() => {
    mongoose.connection.close();
}) 

}