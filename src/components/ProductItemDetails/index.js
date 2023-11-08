// Write your code here
import {BsStarFill, BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

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
    productData: {},
    similarProductsData: [],
    numberOfProducts: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetailedView()
  }

  getProductItemDetailedView = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }

      const updatedSimilarProducts = updatedData.similarProducts.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
        similarProducts: each.similar_products,
      }))

      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickMinus = () => {
    const {numberOfProducts} = this.state
    if (numberOfProducts > 1) {
      this.setState(prevState => ({
        numberOfProducts: prevState.numberOfProducts - 1,
      }))
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      numberOfProducts: prevState.numberOfProducts + 1,
    }))
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-image"
      />
      <h1 className="failure-view-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-view-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {productData, similarProductsData, numberOfProducts} = this.state
    const {
      imageUrl,
      title,
      price,
      brand,
      description,
      totalReviews,
      rating,
      availability,
    } = productData
    return (
      <div className="product-item-detailed-container">
        <div className="product-item-detailed-section">
          <img
            src={imageUrl}
            alt="product"
            className="product-item-details-img"
          />
          <div>
            <h1 className="product-item-detailed-title">{title}</h1>
            <p className="product-item-detailed-price">Rs {price}/-</p>
            <div className="detailed-rating-review-container">
              <div className="detailed-rating-container">
                <p className="detailed-rating">{rating}</p>
                <BsStarFill className="detailed-star" />
              </div>
              <p className="detailed-total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="detailed-description">{description}</p>
            <p className="detailed-availability">
              <span className="detailed-available">Available:</span>{' '}
              {availability}
            </p>
            <p className="detailed-description">
              <span className="detailed-available">Brand:</span> {brand}
            </p>
            <hr className="line" />
            <div className="plus-minus-container">
              {/* eslint-disable-next-line */}
              <button
                type="button"
                onClick={this.onClickMinus}
                data-testid="minus"
              >
                <BsDashSquare className="minus" />
              </button>
              <p className="number-of-items">{numberOfProducts}</p>
              {/* eslint-disable-next-line */}
              <button
                type="button"
                onClick={this.onClickPlus}
                data-testid="plus"
              >
                <BsPlusSquare className="bs-minus" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProductsData.map(eachData => (
            <SimilarProductItem key={eachData.id} productsDetails={eachData} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
