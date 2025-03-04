const Tour = require('../models/tourModels')

// const checkId = (req,res,next,val) => {
//     console.log(`Requested tour id ${val}`)
//     if (val>tours.length) {
//         return res.status(404).json({
//             status: "failure",
//             message: "Invalid id"
//         })
//     }
//     next();

// }

// const checkBody = (req,res,next) => {
//     console.log(req.body)
//     if (req.body && (!req.body.name || !req.body.price)) {
//         return res.status(400).json({
//             status: "failure",
//             message: "Invalid request body"
//         })
//     }
//     next();
// }

const getAllTours = async (req,res) => {
    try {
        // CREATE QUERY

        // 1. Filtering example
        const queryObj = {...req.query};
        const excludeFields = ['page','sort','limit','fields']
        excludeFields.forEach(el=> delete queryObj[el]);

        // 2. advanced filtering example using greater than less than
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`)
        // console.log(JSON.parse(queryString))
        
        
        let query = Tour.find(JSON.parse(queryString))
        
        // 3. SORTING
        if (req.query.sort) {
            // ?sort=price,ratingAverage
            // sortBy = 'price ratingAverage'
            // price primary sorting criteria ratingaverage second
            const sortBy = req.query.sort.split(',').join(' ')
            query.sort(sortBy)
        }

        // 4 . Limiting the fields/Projecting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // 5 . Pagination
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skip = (page-1)*limit
        // page=2&limit=10 page 1 1-10 page 2 11-20 page 3 21-30 
        // skip = 1*10=10 for page 2 with limit 10
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const docCount = await Tour.countDocuments()
            if (skip>=docCount) {
                throw new Error('Page is empty!!')
            }
        }
        
        // FINAL QUERY
        const tours = await query;
        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'Failure',
            message: err.message
        })
    }
}
const getTour = async (req,res) => {
    try {
        const {id} = req.params;
        console.log(id)
        const tour = await Tour.findById(id)
        res.status(200).json({
            status: 'Success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure',
            message: err.message
        })
    }
    
}
const createTour = async (req,res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: "Success",
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'Failue',
            message: 'Invalid payload request!'
        })
    }
}
const updateTour = async (req,res) => {
    try {
        const {id} = req.params; 
        const body = req.body;
        const updatedTour = await Tour.findByIdAndUpdate(id,body,{
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "Success",
            data: {
                tour: updatedTour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure',
            message: err.message
        })
    }
}
const deleteTour = async (req,res) => {
    try {
        const {id} = req.params; 
        const deletedTour = await Tour.findByIdAndDelete(id)
        if (!deletedTour) {
            throw new Error(message='No tour found with this id!!')
        }
        res.status(200).json({
            status: "Success",
            data: {
                tour: deletedTour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure',
            message: err.message
        })
    }
}

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    // checkId,
    // checkBody
}