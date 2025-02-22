const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const checkId = (req,res,next,val) => {
    console.log(`Requested tour id ${val}`)
    if (val>tours.length) {
        return res.status(404).json({
            status: "failure",
            message: "Invalid id"
        })
    }
    next();

}

const checkBody = (req,res,next) => {
    console.log(req.body)
    if (req.body && (!req.body.name || !req.body.price)) {
        return res.status(400).json({
            status: "failure",
            message: "Invalid request body"
        })
    }
    next();
}

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

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    checkId,
    checkBody
}