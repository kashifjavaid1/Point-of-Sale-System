import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { cart, totalAmount } = props;
  return (
    <div ref={ref} className="bg-dark text-light">
      <div className="table-responsive">
        <table className="table table-dark table-hover">
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
  );
});
