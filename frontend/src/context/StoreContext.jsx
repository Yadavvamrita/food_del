import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const url = "https://food-del-backend-4ggi.onrender.com";

  // Add item to cart (local state + backend)
  const addToCart = async (itemId) => {
    if(!cartItems[itemId]){
      setCartItems((prev)=>({...prev, [itemId]:1}))
    }
    else{
      setCartItems((prev)=>({...prev, [itemId]: prev[itemId]+1}))
    }
    if(token){
      await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}})
      
    }
  };

  // Remove item from cart (local state + backend)
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1 
    }));

    if (token) {
      await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}})
    }
  };

  // Get total cart amount
 const getTotalCartAmount = () => {
  let totalAmount = 0;

  // ✅ safeguard if food_list is empty or still loading
  if (!food_list || food_list.length === 0) return 0;

  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      const itemInfo = food_list.find((product) => product._id === item);

      // ✅ check that itemInfo exists before using it
      if (itemInfo && itemInfo.price) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }

  return totalAmount;
};


  // Fetch cart from backend (for logged-in user)
 const fetchFoodList = async () => {
  const response = await axios.get(url + "/api/food/list");
  setFoodList(response.data.data);
};

const fetchCart = async () => {
  if (!token) return;
  const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
  setCartItems(response.data.cartData || {});
};



  // Load food list and token on mount
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        
      }
    }
    loadData();
  }, []);

  // Fetch cart whenever token changes (user logs in)
  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
