class Apifeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr ;
    }

    search(){
       const keyword  = this.queryStr.keyword ? {
        name: {
            $regex: this.queryStr.keyword,
            $options: 'i'
        }
       }: {}; 

       this.query.find({...keyword})
       return this;
    }


    filter(){
        const queryStrCopy = {...this.queryStr };

        // before
        console.log(queryStrCopy);

        const removeFields = ['keyword' , 'limit' , 'page'];
        removeFields.forEach ( field => delete queryStrCopy [field]);

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, math => `$${math}`)

        console.log(queryStr);

        this.query.find(JSON.parse(queryStr));
        return this;

         // after
    console.log(queryStrCopy)
    }
}


module.exports = Apifeatures