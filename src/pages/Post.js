import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ComponentToPrint } from "../component/Print";
import { useReactToPrint } from "react-to-print";
export default function Post() {
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

  const addProductToCart = async (product) => {
    // check if the adding product exist
    let findProductInCart = await cart.find((i) => {
      return i.id === product.id;
    });

    if (findProductInCart) {
      // new product add
      let newCart = [];
      let newItem;

      cart.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.price * (cartItem.quantity + 1),
          };
          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
        }
      });

      setCart(newCart);
    } else {
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart([...cart, addingProduct]);
    }
  };

  // print
  const componentRef = useRef();
  const handleReacttoPrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrint = () => {
    handleReacttoPrint();
  };
  // remove products
  const removeProduct = async (product) => {
    const newCart = cart.filter((cartItem) => cartItem.id !== product.id);
    setCart(newCart);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // show total amount products
  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach((icart) => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    });
    setTotalAmount(newTotalAmount);
  }, [cart]);

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
        <div className="col-lg-4">
          <div style={{ display: "none" }}>
            <ComponentToPrint
              cart={cart}
              totalAmount={totalAmount}
              ref={componentRef}
            />
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
            <h2 className="px-2 text-white">Total Amount: ${totalAmount}</h2>
          </div>
          <div className="mt-3">
            {totalAmount !== 0 ? (
              <div>
                <button className="btn btn-primary" onClick={handlePrint}>
                  Print Bill
                </button>
              </div>
            ) : (
              "please add a amount"
            )}
          </div>
        </div>
      </div>
    </>
  );
}
