const express = require('express');
const {getAllTours,getTour,createTour,updateTour,deleteTour,getTourStats,getMonthlyPlan} = require('../controllers/tourController')
const {protectRoutes,restrict} = require('../controllers/authController');
const tourRouter = express.Router();
// tourRouter.param('id',checkId)
tourRouter.route('/').get(protectRoutes,getAllTours).post(createTour)
tourRouter.route('/tour-stats').get(getTourStats)
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan)
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(protectRoutes,restrict('admin','lead-guide'),deleteTour)

module.exports = tourRouter;