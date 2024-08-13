import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productInfoObj: {},
    apiStatus: apiStatusConstants.initial,
    cartCount: 1,
  }

  componentDidMount() {
    this.getProductInfo()
  }

  getProductInfo = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        id: data.id,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        productInfoObj: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickMinus = () => {
    const {cartCount} = this.state
    if (cartCount > 1) {
      this.setState(prevState => ({cartCount: prevState.cartCount - 1}))
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({cartCount: prevState.cartCount + 1}))
  }

  renderSuccess = () => {
    const {productInfoObj, cartCount} = this.state
    const {
      brand,
      description,
      availability,
      imageUrl,
      totalReviews,
      price,
      rating,
      title,
      similarProducts,
    } = productInfoObj
    const formattedSimilarProducts = similarProducts.map(each => ({
      availability: each.availability,
      brand: each.brand,
      description: each.description,
      id: each.id,
      imageUrl: each.image_url,
      price: each.price,
      rating: each.rating,
      style: each.style,
      title: each.title,
      totalReviews: each.total_reviews,
    }))
    return (
      <div className="product-item-details-main-container">
        <div className="product-info-container">
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="rating-and-reviews-container">
              <div className="rating-star-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              <span className="span-ele">Available: </span>
              {availability}
            </p>
            <p>
              <span className="span-ele">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="plus-minus-btn-container">
              <button
                data-testid="minus"
                type="button"
                className="plus-minus-btn-container-btn"
                onClick={this.onClickMinus}
                aria-label="Add item"
              >
                <BsDashSquare />
              </button>

              <p>{cartCount}</p>

              <button
                data-testid="plus"
                type="button"
                className="plus-minus-btn-container-btn"
                onClick={this.onClickPlus}
                aria-label="Add item"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul className="similar-products-ul-container">
            {formattedSimilarProducts.map(each => (
              <SimilarProductItem key={each.id} obj={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderProductInfo = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />

        {this.renderProductInfo()}
      </>
    )
  }
}

export default ProductItemDetails
