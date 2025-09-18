import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:30080/api/products'; // Minikube NodePort

function ProductList() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  const addProduct = async () => {
    await axios.post(API_URL, { name, price: parseFloat(price) });
    setName(''); setPrice('');
    fetchProducts();
  };

  return (
    <div>
      <ul>
        {products.map(p => <li key={p.id}>{p.name} - ${p.price}</li>)}
      </ul>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default ProductList;
