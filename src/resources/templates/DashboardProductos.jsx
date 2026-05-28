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
    // AJUSTADOS A JAVA:
    stockMin: '', 
    imagen: '',   
    visibilidad: true,
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

// Borrado Lógico (Alternar visibilidad)
const handleDelete = async (id) => {
    if (!window.confirm("¿Cambiar el estado de visibilidad de este producto?")) return;
    try {
        // Llamamos al PatchMapping que definimos en el Controller
        await api.patch(`/productos/${id}/visibilidad`);
        fetchDatos();
        alert("Estado actualizado");
    } catch (error) {
        alert("No se pudo actualizar la visibilidad");
    }
};

const openModal = (prod = null) => {
    if (prod) {
        setFormData({
            id: prod.id,
            nombre: prod.nombre || '',
            descripcion: prod.descripcion || '',
            precio_compra: prod.precio_compra || '',
            precio_venta: prod.precio_venta || '',
            stock: prod.stock || '',
            // Ajuste aquí:
            stockMin: prod.stockMin || '', 
            imagen: prod.imagen || '',     
            visibilidad: prod.visibilidad ?? true,
            categoria: { id: prod.categoria?.id || '' }
        });
    } else {
        setFormData({
            id: null, nombre: '', descripcion: '', precio_compra: '',
            precio_venta: '', stock: '', stockMin: '', imagen: '',
            visibilidad: true, categoria: { id: '' }
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
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock / Min</th>
                    <th>P. Venta</th>
                    <th className="text-center">Acciones</th>
                </tr>
                </thead>

                <tbody>
                    {productos.map((prod) => (
                        <tr key={prod.id} style={{ opacity: prod.visibilidad ? 1 : 0.5 }}>
                            <td>
                                <img 
                                src={prod.imagen || 'https://via.placeholder.com/50'} // Antes imagen_url
                                    alt={prod.nombre} 
                                    className="img-tabla-mini" 
                                />
                            </td>
                            <td className="text-bold">
                                {prod.nombre}
                                {!prod.visibilidad && <span className="badge-oculto"> (Oculto)</span>}
                            </td>
                            <td>{prod.categoria?.emoji} {prod.categoria?.nombre}</td>

                <           td className={prod.stock <= prod.stockMin ? "low-stock" : ""}>
                            {prod.stock} / <small>{prod.stockMin}</small>
                        </td>
                            <td className="text-price">s/{prod.precio_venta}</td>
                            <td className="actions-cell">
                                <button onClick={() => openModal(prod)} className="btn-icon-edit"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(prod.id)} className="btn-icon-delete">
                                    {prod.visibilidad ? <Trash2 size={18} /> : <Eye size={18} />}
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

                            {/* Campo para Imagen URL */}
                            <div className="form-group">
                                <label>URL de la Imagen</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.imagen} // Antes imagen_url
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                {/* Campo Stock Actual */}
                                <div className="form-group">
                                    <label>Stock Actual</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        required
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                
                                {/* NUEVO: Campo Stock Mínimo */}
                            <div className="form-group">
                                <label>Stock Mínimo (Alerta)</label>
                                <input
                                    type="number"
                                    value={formData.stockMin} // Antes stock_minimo
                                    required
                                    onChange={(e) => setFormData({ ...formData, stockMin: e.target.value })}
                                />
                            </div>

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