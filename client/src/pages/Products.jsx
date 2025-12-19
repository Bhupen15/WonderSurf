import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext.jsx'
import { api } from '../api.js'

export default function Products() {
  const { token, user } = useAuth()
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await api('/products', { token })
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api('/products', { method: 'POST', token, body: { name, price: Number(price), description } })
      setName('')
      setPrice('')
      setDescription('')
      await fetchProducts()
    } catch (e) { setError(e.message) }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete product?')) return
    try {
      await api(`/products/${id}`, { method: 'DELETE', token })
      await fetchProducts()
    } catch (e) { setError(e.message) }
  }

  const handleUpdateProduct = async (id, payload) => {
    try {
      await api(`/products/${id}`, { method: 'PUT', token, body: payload })
      await fetchProducts()
    } catch (e) { setError(e.message) }
  }

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleAddProduct}>
        <div>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Add Product</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id}>
                <td>
                  <InlineEdit value={p.name} onSave={(v) => handleUpdateProduct(p._id, { name: v })} allowed />
                </td>
                <td>
                  <InlineEdit value={String(p.price)} onSave={(v) => handleUpdateProduct(p._id, { price: Number(v) })} allowed />
                </td>
                <td>
                  <InlineEdit value={p.description || ''} onSave={(v) => handleUpdateProduct(p._id, { description: v })} allowed />
                </td>
                <td>{p.createdBy?.email || '—'}</td>
                <td>
                  {(user.role === 'admin' || p.createdBy?._id === user.id) && (
                    <button onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function InlineEdit({ value, onSave, allowed }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  useEffect(() => setVal(value), [value])
  if (!allowed) return value
  return editing ? (
    <span>
      <input value={val} onChange={(e) => setVal(e.target.value)} />
      <button onClick={() => { setEditing(false); onSave(val) }}>Save</button>
      <button onClick={() => { setEditing(false); setVal(value) }}>Cancel</button>
    </span>
  ) : (
    <span>
      {value} <button onClick={() => setEditing(true)}>Edit</button>
    </span>
  )
}
