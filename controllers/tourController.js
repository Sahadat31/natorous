const Tour = require('../models/tourModels')
const APIFeatures = require('../utils/apiFeatures')

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
        const tourQuery = new APIFeatures(Tour.find(),req.query)
            .filter()
            .sort()
            .limit()
            .pagination()
        
        // FINAL QUERY
        const tours = await tourQuery.query;
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
const getTourStats = async (req,res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            }, 
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    averageRating: {$avg: '$ratingsAverage'},
                    averagePrice: {$avg: '$price'},
                    totalPrice: {$sum: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            }
        ])
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'Failure',
            message: err.message
        })
    }

}
const getMonthlyPlan = async(req,res) => {
    try {
        const year = req.params.year * 1
        const plans = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numOfTours: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numOfTours: -1}
            },
            {
                $limit: 6
            }
        ])
        res.status(200).json({
            status: "Success",
            data: plans
        })


    }catch(err) {
        res.status(400).json({
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
    getTourStats,
    getMonthlyPlan
    // checkId,
    // checkBody
}