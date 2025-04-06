// lib/token_utils.js
import Cookies from "js-cookie";
export const getToken = () => Cookies.get("authToken");
