import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

const API_URL = 'http://20.231.202.18:8000/api/form';

function App() {
  const[modal, setModal] = useState(false);
  const[products, setProducts] = useState([]);
  const[filteredProducts, setFilteredProducts] = useState([]);
  const[errors, setErrors] = useState('');
  const[selectedProduct, setSelectedProduct] = useState(null);
  const[searchBar, setSerachBar] = useState('');
  const[form, setForm] = useState({
    code: '',
    name: '',
    descrition: ''
  })
  useEffect(() =>{
    fetchProducts();

  },[])

  const fetchProducts = async() =>{
    try{
      const response = await axios.get(API_URL);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch(error){
      console.log(error.message);
    }
  }

  const toggleModal = () =>{
    setModal(!modal);
    setForm({code:'',name:'',description:''});
    setSelectedProduct(null);
  }

  const validateForm = () =>{
    let isValid = true;
    const newErrors = {};

    if(form.code.trim === ''){
      isValid = false;
      newErrors.code = 'El codigo es requerido'
    }
    if(form.name.trim === ''){
      isValid = false;
      newErrors.name = 'El Nombre es requerido'
    }
    if(form.description.trim === ''){
      isValid = false;
      newErrors.description = 'La descripción es requerida'
    }

    setErrors(newErrors);
    return isValid;

  }

  const handleInputChange = e =>{
    const {name,value} = e.target;
    setForm({...form, [name]: value});
  }

  const addProduct = async () =>{
    if(validateForm()){
      try{
        const response = await axios.post(API_URL,form);
        toggleModal();
      } catch(error){
        const newErrors = {};
        newErrors.code = error.response.data.message;
      }

    }
    fetchProducts();
  }

 
    

  const handleEditButton = (product) =>{
    setSelectedProduct(product);
    
    setForm({
      code: product.code,
      name: product.name,
      description: product.description
    })
    setModal(true);
    
  }

  const editProduct = async () =>{
    if(validateForm()){
      try{
        const response = await axios.put(`${API_URL}/${selectedProduct.id}`,form);
        toggleModal();
      } catch (e){
         console.log(e.message);
      }
    }
    fetchProducts();
  }

  const deleteProduct = async (id) =>{
    try{
      
      const response = axios.delete(`${API_URL}/${id}`) 
      fetchProducts();
    } catch (e){
      console.log(e.message);
    }
    fetchProducts();
  }

  const resetForm = () =>{
    setForm({code:'',name:'',descrition:''});
    setSelectedProduct(null);
  }

  return (
    <div >
      <div >
        <input
          type="text"
          placeholder="Buscar productos"
          
          
        />
        <Button color="primary" onClick={toggleModal}>
          Agregar Producto
        </Button>
      </div>
      

      <Modal isOpen={modal} toggle = {toggleModal}>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label>Código</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleInputChange}
                
                
                
                className="form-control"
                required
              />
              {errors.code && <span>{errors.code}</span>}
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                
                
                className="form-control"
                required
              />
              {errors.name && <span>{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                
                
                className="form-control"
                required
              />
              {errors.description && <span>{errors.description}</span>}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          { selectedProduct?  (
            <Button color="primary" onClick={editProduct}>
              Editar
            </Button>
          ) : (
            <Button color="primary" onClick={addProduct} >
              Agregar
            </Button>
          )}
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Table style={{ width: '80%' }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                <Button color="primary" onClick={()=>handleEditButton(product)}><FontAwesomeIcon icon={faEdit}/>Editar</Button>
                {"   "}
                <Button color="danger" onClick={()=> deleteProduct(product.id)}><FontAwesomeIcon icon={faTrashAlt}/>Eliminar</Button>
                  
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
