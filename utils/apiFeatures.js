class APIFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // Filtering example
        const queryObj = {...this.queryString};
        const excludeFields = ['page','sort','limit','fields']
        excludeFields.forEach(el=> delete queryObj[el]);

        // advanced filtering example using greater than less than
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`)

        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sort() {
        // SORTING
        if (this.queryString.sort) {
            // ?sort=price,ratingAverage
            // sortBy = 'price ratingAverage'
            // price primary sorting criteria ratingaverage second
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query.sort(sortBy)
        }
        return this;
    }
    limit() {
        // Limiting the fields/Projecting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }
    pagination() {
        // Pagination
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page-1)*limit
        // page=2&limit=10 page 1 1-10 page 2 11-20 page 3 21-30 
        // skip = 1*10=10 for page 2 with limit 10
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

module.exports = APIFeatures;