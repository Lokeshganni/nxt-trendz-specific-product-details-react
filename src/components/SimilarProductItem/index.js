import './index.css'

const SimilarProductItem = ({obj}) => {
  const {brand, imageUrl, price, rating, title} = obj
  return (
    <li className="similar-product-li-container">
      <div className="similar-product-img-container">
        <img src={imageUrl} alt={`similar product ${title}`} />
        <h1>{title}</h1>
        <p>by {brand}</p>
      </div>
      <div className="price-and-rating-container">
        <p>Rs {price}/-</p>
        <div className="rating-star-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
