import React, { useContext, useState, useEffect } from 'react' // ✅ Combined imports of hooks
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from "../../assets/assets";

const MyOrders = () => {

  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]); // ✅ Renamed 'data' to 'orders' for clarity

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      // ✅ Ensure response.data.data exists and is an array
      setOrders(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // ✅ fallback to empty array on error
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {orders && orders.length > 0 ? ( // ✅ Safe check to prevent undefined.map error
          orders.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="Parcel" />
                <p>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <span key={idx}>
                        {item.name} x {item.quantity}
                        {idx !== order.items.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    "No items"
                  )}
                </p>
                <p>${order.amount || 0}.00</p> {/* ✅ Added fallback if amount is undefined */}
                <p>Items: {order.items ? order.items.length : 0}</p> {/* ✅ Fallback */}
                <p><span>&#x25cf;</span><b>{order.status || "Pending"}</b></p> {/* ✅ Fallback */}
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            )
          })
        ) : (
          <p>No orders found</p> // ✅ Shows message if no orders
        )}
      </div>
    </div>
  )
}

export default MyOrders
