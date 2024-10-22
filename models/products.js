class Product {
  constructor(
    id,
    title,
    description,
    imageUrl,
    condition,
    categoryId,
    meetup,
    meetupDetails
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.condition = condition;
    this.categoryId = categoryId;
    this.meetup = meetup;
    this.meetupDetails = meetupDetails;
  }
}

export default Product;
