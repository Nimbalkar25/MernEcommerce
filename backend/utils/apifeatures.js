class ApiFeatures {
  constructor(query, queryStr) {
    // here query is like in prodcutController Product.find() in getallproduct details for our case
    // but actual query is the this after ? in api url or and query str will be keyword use
    // `query` is the Mongoose query object (e.g., Product.find())
    // `queryStr` is the query parameters from the URL (e.g., { keyword: "shoes" })
    this.query = query;
    this.queryStr = queryStr;
  }

  // search feautre is here
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            // regex is mongodb operator which help to follow pattern
            // and option i to make case insesitive
            $regex: this.queryStr.keyword, // Use this.queryStr.keyword, not this.query.keyword
            $options: "i", // Case insensitive
          },
        }
      : {};
    // keyword is a object and in javascript if we give only keyword
    // it will give reference and also change the value if we change it
    // so for actual value we have use spread operator
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // This is for Category so will mention it in frontend so no need to make it case insensitive
  // filter() {
  //   // we are taking copy of querystr to modify but same like keyword if will
  //   //take directly the querystr the change will happen in og value too
  //   // now using spread we get the actual copy not the reference
  //   const queryCopy = { ...this.queryStr };

  //   //remove fileds for category like skip the keyword , page =1 so we can get the str which is category
  //   const removeFields = ["keyword", "page", "limit"];

  //   removeFields.forEach((key) => delete queryCopy[key]);

    
  // // Handle category filter case-insensitively
  // if (queryCopy.category) {
  //   queryCopy.category = { $regex: queryCopy.category, $options: "i" };
  // }




  //   //Filter for price and rating
  //   let queryStr = JSON.stringify(queryCopy);
  //   queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

  //   // now we use querycopy coz its has no nested obj like keyword and this.query is Product.find()
  //   //  only after adding price filter we parse it to obj coz it was parse to string
  //   this.query = this.query.find(JSON.parse(queryStr));
  //   return this;
  // }
  

  filter() {
  const queryCopy = { ...this.queryStr };

  // Remove fields that are not filters
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((key) => delete queryCopy[key]);

  // Handle category filter (case-insensitive)
  if (queryCopy.category) {
    queryCopy.category = {
      $regex: queryCopy.category,
      $options: "i",
    };
  }

  // Handle price filtering
  if (queryCopy.price) {
    const priceFilter = {};

   if (queryCopy.price.gte) priceFilter.$gte = Number(queryCopy.price.gte);
    if (queryCopy.price.lte) priceFilter.$lte = Number(queryCopy.price.lte);
    if (queryCopy.price.gt) priceFilter.$gte = Number(queryCopy.price.gt);
    if (queryCopy.price.lt) priceFilter.$lte = Number(queryCopy.price.lt);

    queryCopy.price = priceFilter;
  }

    // ✅ Handle ratings
  if (queryCopy.ratings) {
    const ratingFilter = {};
    if (queryCopy.ratings.gte) ratingFilter.$gte = Number(queryCopy.ratings.gte);
    if (queryCopy.ratings.lte) ratingFilter.$lte = Number(queryCopy.ratings.lte);
    if (queryCopy.ratings.gt)  ratingFilter.$gt  = Number(queryCopy.ratings.gt);
    if (queryCopy.ratings.lt)  ratingFilter.$lt  = Number(queryCopy.ratings.lt);

    queryCopy.ratings = ratingFilter;
  }

  // Apply all filters
  this.query = this.query.find(queryCopy);
  return this;
}


  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
