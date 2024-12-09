import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  userId: "",
  name: "",
  email: "",
  phone: "",
  token: "",
  companies: [],
  selectedCompanyIndex: 0,
  isLogin: false,
};

if (localStorage.getItem("user")) {
  const { userId, name, email, phone, token, companies, selectedCompanyIndex } =
    JSON.parse(localStorage.getItem("user"));
  initialState = {
    userId,
    name,
    email,
    phone,
    token,
    isLogin: true,
    selectedCompanyIndex,
    companies,
  };
}

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      const {
        userId,
        name,
        email,
        phone,
        token,
        companies,
        selectedCompanyIndex,
      } = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.token = token;
      state.isLogin = true;
      state.companies = companies;
      state.selectedCompanyIndex = selectedCompanyIndex;
    },

    setUserLogout: (state, action) => {
      localStorage.clear();
      state.userId = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.token = "";
      state.isLogin = false;
      state.companies = [];
    },
    updateUserDetails: (state, action) => {
      const { name, email, phone } = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;

      const updatedUser = { ...state, name, email, phone };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
  },
});

export const { setUserLogin, setUserLogout, updateUserDetails } =
  userSlice.actions;

export default userSlice.reducer;
