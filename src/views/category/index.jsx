import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { apiPimHelper } from '@/helpers/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductItem } from '@/components/product';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';

const Category = () => {
  const [productsData, setProductsData] = useState([]);
  const {id} = useParams()
  useEffect(async () => {
    const {data} = await apiPimHelper(`category/${id}/products`)
    setProductsData(data)
  }, [id])

  const store = useSelector((state) => ({
    filteredProducts: selectFilter(state.products.items, state.filter),
    products: state.products,
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading
  }), shallowEqual);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <AppliedFilters filteredProductsCount={productsData.length} />
          <ProductGrid products={productsData} />
        {/* <ProductList {...store}> */}
        {/* </ProductList> */}
      </section>
    </main>
  )
}

export default Category
