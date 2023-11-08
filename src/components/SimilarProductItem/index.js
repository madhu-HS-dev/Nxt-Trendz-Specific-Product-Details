// Write your code here
import {BsStarFill} from 'react-icons/bs'

import './index.css'

const SimilarProductItem = props => {
  const {productsDetails} = props
  const {imageUrl, title, price, brand, rating} = productsDetails
  return (
    <li className="similar-product-container">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <BsStarFill className="similar-product-star" />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
