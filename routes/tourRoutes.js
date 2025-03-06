const express = require('express');
const {getAllTours,getTour,createTour,updateTour,deleteTour,getTourStats,getMonthlyPlan} = require('../controllers/tourController')

const tourRouter = express.Router();
// tourRouter.param('id',checkId)
tourRouter.route('/').get(getAllTours).post(createTour)
tourRouter.route('/tour-stats').get(getTourStats)
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan)
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = tourRouter;