import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const MyContext = createContext();

export const StoreProvider = ({ children }) => {
  const [countryList, setCountryList]               = useState([]);
  const [selectedCountry, setSelectedCountry]       = useState("");
  const [isShowHeaderFooter, setisShowHeaderFooter] = useState(true);
  const [isLogin, setIsLogin]                       = useState(false);

  useEffect(() => {
    const getCountry = async () => {
      try {
        const res = await axios.get("https://countriesnow.space/api/v0.1/countries/");
        setCountryList(res.data.data || []);
      } catch (error) {
        console.error("Country fetch error:", error);
      }
    };
    getCountry();
  }, []);

  return (
    <MyContext.Provider
      value={{
        countryList,
        selectedCountry,
        setSelectedCountry,
        isShowHeaderFooter,
        setisShowHeaderFooter,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};