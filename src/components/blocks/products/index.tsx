import ProductFilterSidebar from './product-filter-list'

const ProductPage: React.FC = () => {
  return (
    <main className="flex gap-6">
      <aside className="p-6">
        <ProductFilterSidebar />
      </aside>
      <div>Product list</div>
    </main>
  )
}

export default ProductPage
