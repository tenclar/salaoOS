import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductModal from './ProductModal';

function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = () => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      api.delete(`/products/${id}`)
        .then(() => {
          loadProducts();
        })
        .catch(err => {
          console.error('Error deleting product:', err);
          alert('Erro ao excluir produto.');
        });
    }
  };

  return (
    <div className="products-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Produtos e Estoque</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Gerencie produtos para venda ou uso interno e controle o estoque.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Novo Produto</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Marca</th>
              <th>Tipo</th>
              <th>Preço (Venda)</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</td>
              </tr>
            ) : (
              products.map(product => {
                const lowStock = product.stock_quantity <= product.min_stock;
                
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.brand || '-'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{product.type}</td>
                    <td>R$ {Number(product.sale_price).toFixed(2)}</td>
                    <td>
                      <span style={{ 
                        color: lowStock ? '#F44336' : 'inherit',
                        fontWeight: lowStock ? 'bold' : 'normal'
                      }}>
                        {product.stock_quantity} {product.unit}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.85em',
                        backgroundColor: product.active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: product.active ? '#4CAF50' : '#F44336'
                      }}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <button style={{ marginRight: '10px' }} onClick={() => handleOpenModal(product)}>Editar</button>
                      <button style={{ color: 'red', cursor: 'pointer', background: 'transparent', border: 'none' }} onClick={() => handleDelete(product.id)}>Excluir</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productData={selectedProduct}
        onSave={loadProducts}
      />
    </div>
  );
}

export default Products;
