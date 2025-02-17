const express = require('express');
const fs = require('fs');
const app = express();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
const port = 3000;
const getAllTours = (req,res) => {
    res.status(200).json({
        status: "success",
        data: {
            tours
        }
    })
}
const getTour = (req,res) => {
    const {id} = req.params;
    console.log(id)
    const tour = tours.find(t=> t.id === +id)
    res.status(200).json({
        status: 'Success',
        data: {
            tour
        }
    })
    
}
const createTour = (req,res) => {
    const newId = tours[tours?.length-1]?.id + 1
    const newTour = Object.assign({id: newId}, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=> {
        res.status(200).json({
            status: "Success",
            data: {
                tour: newTour
            }
        })
    })
}
const updateTour = (req,res) => {
    const {id} = req.params; 
    res.status(200).json({
        status: "Success",
        data: {
            tour: 'Updated'
        }
    })
}
const deleteTour = (req,res) => {
    const {id} = req.params; 
    res.status(200).json({
        status: "Success",
        data: {
            tour: 'Deleted'
        }
    })
}
app.use(express.json())
// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.route('/api/v1/tours').get(getAllTours).post(createTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})