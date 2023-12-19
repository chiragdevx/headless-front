import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { apiPimHelper } from '@/helpers/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductItem } from '@/components/product';

const Category = () => {
  const [productsData, setProductsData] = useState([]);
  const {id} = useParams()
  useEffect(async () => {
    const {data} = await apiPimHelper(`category/${id}/products`)
    console.log('data', data)
    setProductsData(data)
  }, [])

  return (
    <main className="content">
      <section className="product-list-wrapper">
        {/* {productsData.map((product) => {
          return (
            <ProductItem
              key={product.id}
              product={product}
            />
          )
        })} */}
        <AppliedFilters filteredProductsCount={productsData.length} />
        {/* <ProductList {...store}> */}
          <ProductGrid products={productsData} />
        {/*</ProductList> */}
      </section>
    </main>
  )
}

export default Category
