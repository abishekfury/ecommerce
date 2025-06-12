class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryObj = { ...this.queryStr };

    // Remove unwanted fields
    ["keyword", "limit", "page"].forEach((field) => delete queryObj[field]);

    const mongoQuery = {};

    for (let key in queryObj) {
      if (key.includes("[")) {
        // Example: price[lt] => price and lt
        const field = key.split("[")[0];
        const operator = key.match(/\[(.*)\]/)[1];

        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][`$${operator}`] = Number(queryObj[key]);
      } else {
        mongoQuery[key] = queryObj[key];
      }
    }

    console.log(JSON.stringify(mongoQuery)); // Output clean query object

    this.query.find(mongoQuery);
    return this;
  }

  paginate(restPerPage){
    const currentPage = Number (this.queryStr.page) || 1;
    const skip = restPerPage * (currentPage - 1)
    this.query.limit(restPerPage).skip(skip);
    console.log(currentPage);
    console.log(skip);
    return this;
  }
}

module.exports = Apifeatures;
