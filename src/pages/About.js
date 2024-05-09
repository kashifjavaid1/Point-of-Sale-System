import React, { useEffect, useState } from "react";
import axios from "axios";
import { ComponentToPrint } from "../component/Print";

export default function About() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/products");
      const response = await res.data;
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProductToCart = (product) => {
    // check if the product is already in the cart
    let exisingProduct = cart.find((oneProduct) => {
      return oneProduct.id === product.id;
    });
    if (exisingProduct) {
      // update existing product
      let newProduct = [];
      let newItem;
      cart.forEach((cardItem) => {
        if (cardItem.id === product.id) {
          newItem = {
            ...cardItem,
            quantity: cardItem.quantity + 1,
            totalAmount: cardItem.price * (cardItem.quantity + 1),
          };
          newProduct.push(newItem);
        } else {
          newProduct.push(cardItem);
        }
      });
      setCart(newProduct);
    } else {
      // add new product to cart
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart([...cart, addingProduct]);
    }
  };

  const removeProduct = async (product) => {
    const newProduct = cart.filter((item) => {
      return item.id !== product.id;
    });
    setCart(newProduct);
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-8">
          {isLoading ? (
            "Loading..."
          ) : (
            <div className="row">
              {products.map((product, index) => (
                <div key={index} className="col-lg-4 mb-4">
                  <div
                    className="pos-item px-3 text-center border"
                    onClick={() => addProductToCart(product)}
                  >
                    <p>{product.name}</p>
                    <img
                      src={product.image}
                      className="img-fluid"
                      alt={product.name}
                    />
                    <p>${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="table-responsive bg-dark">
          <table className="table table-responsive table-dark table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((cartProduct, index) => (
                  <tr key={index}>
                    <td>{cartProduct.id}</td>
                    <td>{cartProduct.name}</td>
                    <td>{cartProduct.price}</td>
                    <td>{cartProduct.quantity}</td>
                    <td>{cartProduct.totalAmount}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeProduct(cartProduct)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No items available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
