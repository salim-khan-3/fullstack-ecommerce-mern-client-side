import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import Home from "./pages/Home/Home";
import Navbar from "./Components/layouts/Navbar/Navbar";
import Footer from "./Components/layouts/Footer/Footer";
import Listing from "./pages/Listing/Listing";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage/ProductDetailsPage";
import Cart from "./pages/Cart/CartPage/Cart";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { StoreProvider, MyContext } from "./context/Storecontext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import MyList from "./pages/MyList/MyList";
import Checkout from "./pages/CheckOutPage/CheckOut";

export { MyContext };

const AppLayout = () => {
  const { isShowHeaderFooter } = useContext(MyContext);

  return (
    <>
      {isShowHeaderFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Listing />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      {isShowHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <AppLayout />
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css";
// import { useContext } from "react";
// // import { StoreProvider, MyContext } from "./context/StoreContext";

// import Home from "./pages/Home/Home";
// import Navbar from "./Components/layouts/Navbar/Navbar";
// import Footer from "./Components/layouts/Footer/Footer";
// import Listing from "./pages/Listing/Listing";
// import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage/ProductDetailsPage";
// import Cart from "./pages/Cart/CartPage/Cart";
// import Login from "./pages/Login/Login";
// import SignUp from "./pages/SignUp/SignUp";
// import { StoreProvider, MyContext } from "./context/Storecontext";

// export { MyContext };

// const AppLayout = () => {
//   const { isShowHeaderFooter } = useContext(MyContext);

//   return (
//     <>
//       {isShowHeaderFooter && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/category/:id" element={<Listing />} />
//         <Route path="/product/:id" element={<ProductDetailsPage />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//       </Routes>
//       {isShowHeaderFooter && <Footer />}
//     </>
//   );
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <StoreProvider>
//         <AppLayout />
//       </StoreProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css";
// import Home from "./pages/Home/Home";
// import Navbar from "./Components/layouts/Navbar/Navbar";
// import Footer from "./Components/layouts/Footer/Footer";
// import { createContext,  useEffect, useState } from "react";
// import axios from "axios";
// import Listing from "./pages/Listing/Listing";
// import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage/ProductDetailsPage";
// import Cart from "./pages/Cart/CartPage/Cart";
// import Login from "./pages/Login/Login";
// import SignUp from "./pages/SignUp/SignUp";

// const MyContext = createContext();

// function App() {
//   const [countryList, setCountryList] = useState([]);
//   const [selectedCountry,setSelectedCountry] = useState("");
//   const [isShowHeaderFooter,setisShowHeaderFooter] = useState(true);
//   const [isLogin,setIsLogin] = useState(false)

//   useEffect(() => {
//     const getCountry = async () => {
//       try {
//         const res = await axios.get(
//           "https://countriesnow.space/api/v0.1/countries/",
//         );
//         setCountryList(res.data.data || []);
//       } catch (error) {
//         console.error("Country fetch error:", error);
//       }
//     };

//     getCountry();
//   }, []);

//   const values = {
//     countryList,
//     selectedCountry,
//     setSelectedCountry,
//     isShowHeaderFooter,
//     setisShowHeaderFooter,
//     isLogin,
//     setIsLogin
//   };
//   return (
//     <BrowserRouter>
//       <MyContext.Provider value={values}>
//         {
//           isShowHeaderFooter === true && <Navbar></Navbar>
//         }

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/listing/:id" element={<Listing />} />
//           <Route path="/product/:id" element={<ProductDetailsPage />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/login" element={<Login></Login>}/>
//           <Route path="/signup" element={<SignUp></SignUp>}/>
//         </Routes>
//         {
//           isShowHeaderFooter === true && <Footer></Footer>
//         }
//       </MyContext.Provider>
//     </BrowserRouter>
//   );
// }

// export default App;

// export { MyContext };
