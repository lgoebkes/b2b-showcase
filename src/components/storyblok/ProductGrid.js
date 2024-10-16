import EachProduct from '../../pages/product/EachProduct'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  availabilityDataSelector,
} from '../../redux/slices/availabilityReducer'
import { getProductData } from '../../context/product-list-context'
import { storyblokEditable } from '@storyblok/react'

const ProductGrid = ({ blok }) => {
  const [products, setProducts] = useState([])
  const availability = useSelector(availabilityDataSelector)
  const stockLevel = (product) => availability['k' + product.id]?.stockLevel
  const available = (product) => stockLevel(product) > 0

  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = blok.productIds.split(',')
      getProductData(productIds, 1, 100000).then(products => {
        setProducts(products)
      })
    }
    fetchProducts()
  }, [blok])

  return <div
    className="mx-4 xl:mx-auto gap-2 max-w-screen-xl my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" {...storyblokEditable(blok)}>
    {products.map(product => (
      <div className="border border-demoGray rounded" key={product.id}>
        <EachProduct item={product} available={available(product)}
                     productCount={stockLevel(product)} rating={product.productRating} />
      </div>
    ))}
  </div>
}

export default ProductGrid
