import ProductFilterSidebar from './product-filter-list'
import ProductList from './product-list'

const ProductPage: React.FC = () => {
  return (
    <main className="flex">
      <aside className="p-6 hidden lg:block">
        <ProductFilterSidebar />
      </aside>
      <section className="flex-1 py-6 lg:pr-6 lg:pl-0 px-6">
        <ProductList />
      </section>
    </main>
  )
}

export default ProductPage
