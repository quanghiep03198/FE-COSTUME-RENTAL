import ProductFilters from './filters'
import ProductList from './product-list'

const ProductPage: React.FC = () => {
  return (
    <main className="flex">
      <aside className="p-6 hidden lg:block">
        <ProductFilters />
      </aside>
      <section className="flex-1 py-6 lg:pr-6 lg:pl-0 px-6">
        <ProductList />
      </section>
    </main>
  )
}

export default ProductPage
