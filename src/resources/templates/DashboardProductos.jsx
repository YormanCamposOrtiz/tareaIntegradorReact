import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Heart, Plus, Trash2, Edit, X, Package } from 'lucide-react';

import { DashboardHeader } from './fragments/DashboardHeader';


import "../static/DashboardProductos.css";

import api from "../../api";

export function DashboardProductos() {

    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        descripcion: '',
        precio_compra: '',
        precio_venta: '',
        stock: '',
        categoria: { id: '' }
    });

    useEffect(() => {
        fetchDatos();
    }, []);

    const fetchDatos = async () => {
        try {
            const response = await api.get('/productos');
            const categoriasRes = await api.get('/categorias');

            setProductos(response.data);
            setCategorias(categoriasRes.data);

        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    // Crear categoría
    const handleCrearCategoria = async () => {

        const nombre = prompt("Nombre de la nueva categoría:");

        if (!nombre) return;

        const emoji = prompt("Emoji para la categoría (ej: 💊):") || "📦";

        try {

            const response = await api.post('/categorias', {
                nombre,
                emoji
            });

            const nuevaCat = response.data;

            setCategorias([...categorias, nuevaCat]);

            setFormData({
                ...formData,
                categoria: { id: nuevaCat.id }
            });

            alert("Categoría creada con éxito");

        } catch (error) {

            console.error("Error detallado:", error);

            if (error.response) {
                alert(`Error: ${error.response.data.message || "No se pudo crear la categoría"}`);
            } else {
                alert("No se pudo conectar con el servidor.");
            }
        }
    };

    // Guardar producto
    const handleSave = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post('/productos', formData);

            if (response.status === 200 || response.status === 201) {

                alert("Producto guardado con éxito");

                fetchDatos();

                closeModal();

                setFormData({
                    id: null,
                    nombre: '',
                    descripcion: '',
                    precio_compra: '',
                    precio_venta: '',
                    stock: '',
                    categoria: { id: '' }
                });
            }

        } catch (error) {

            console.error("Error al guardar:", error);

            if (error.response) {
                alert(`Error: ${error.response.data.message || 'No se pudo guardar el producto'}`);
            } else {
                alert("Error de conexión con el servidor.");
            }
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {

        if (!window.confirm("¿Eliminar este producto?")) return;

        try {

            await api.delete(`/productos/${id}`);

            fetchDatos();

            alert("Producto eliminado");

        } catch (error) {
            alert("No se pudo eliminar el producto");
        }
    };

    // Abrir modal
    const openModal = (prod = null) => {

        if (prod) {

            setFormData({
                id: prod.id,
                nombre: prod.nombre || '',
                descripcion: prod.descripcion || '',
                precio_compra: prod.precio_compra || '',
                precio_venta: prod.precio_venta || '',
                stock: prod.stock || '',
                categoria: { id: prod.categoria?.id || '' }
            });

        } else {

            setFormData({
                id: null,
                nombre: '',
                descripcion: '',
                precio_compra: '',
                precio_venta: '',
                stock: '',
                categoria: { id: '' }
            });
        }

        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="productos-container">

            <DashboardHeader />

            <main className="productos-full-content">

                <div className="table-toolbar">
                    <button className="btn-nuevo-header" onClick={() => openModal()}>
                       <Plus size={18} /> Nuevo Producto
                    </button>
                </div>

                <div className="table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>P. Compra</th>
                                <th>P. Venta</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {productos.map((prod) => (

                                <tr key={prod.id}>

                                    <td className="text-muted">
                                        #{prod.id}
                                    </td>

                                    <td className="text-bold">
                                        {prod.nombre}
                                    </td>

                                    <td>
                                        <span className="cat-tag">
                                            {prod.categoria?.emoji} {prod.categoria?.nombre}
                                        </span>
                                    </td>

                                    <td className={prod.stock < 10 ? "low-stock" : ""}>
                                        {prod.stock} uds.
                                    </td>

                                    <td className="text-price-alt">
                                        s/{prod.precio_compra}
                                    </td>

                                    <td className="text-price">
                                        s/{prod.precio_venta}
                                    </td>

                                    <td className="actions-cell">

                                        <button
                                            onClick={() => openModal(prod)}
                                            className="btn-icon-edit"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(prod.id)}
                                            className="btn-icon-delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </main>

            {/* MODAL */}
            {isModalOpen && (

                <div
                    className="modal-overlay"
                    onClick={(e) =>
                        e.target.className === 'modal-overlay' && closeModal()
                    }
                >

                    <div className="modal-box">

                        <div className="modal-header">

                            <h3>
                                {formData.id
                                    ? 'Editar Producto'
                                    : 'Nuevo Producto'}
                            </h3>

                            <button
                                onClick={closeModal}
                                className="btn-close"
                            >
                                <X />
                            </button>

                        </div>

                        <form
                            onSubmit={handleSave}
                            className="modal-form"
                        >

                            <div className="form-group">

                                <label>Nombre</label>

                                <input
                                    type="text"
                                    value={formData.nombre}
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nombre: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>Descripción</label>

                                <input
                                    type="text"
                                    value={formData.descripcion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            descripcion: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>Precio Compra</label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precio_compra}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                precio_compra: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Precio Venta</label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precio_venta}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                precio_venta: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Stock</label>

                                    <input
                                        type="number"
                                        value={formData.stock}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock: e.target.value
                                            })
                                        }
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>Categoría</label>

                                <div className="select-with-action">

                                    <select
                                        value={formData.categoria.id}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                categoria: {
                                                    id: e.target.value
                                                }
                                            })
                                        }
                                    >

                                        <option value="">
                                            Seleccione...
                                        </option>

                                        {categorias.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.emoji} {cat.nombre}
                                            </option>
                                        ))}

                                    </select>

                                    <button
                                        type="button"
                                        className="btn-add-inline"
                                        onClick={handleCrearCategoria}
                                    >
                                        <Plus size={16} />
                                    </button>

                                </div>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-cancel"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-confirm"
                                >
                                    Guardar Cambios
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}