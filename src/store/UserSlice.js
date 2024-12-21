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
  selectedDashboard: "",
  userAsOtherCompanies: {
    customer: [],
    vendor: [],
    staff: [],
  },
};

if (localStorage.getItem("user")) {
  const {
    userId,
    name,
    email,
    phone,
    token,
    companies,
    selectedCompanyIndex,
    selectedDashboard,
  } = JSON.parse(localStorage.getItem("user"));

  initialState = {
    userId,
    name,
    email,
    phone,
    token,
    isLogin: true,
    selectedCompanyIndex,
    companies,
    selectedDashboard: selectedDashboard,

    userAsOtherCompanies: {
      customer: [],
      vendor: [],
      staff: [],
    },
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
        selectedDashboard,
        userAsOtherCompanies,
      } = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.token = token;
      state.isLogin = true;
      state.companies = companies;
      state.selectedDashboard = selectedDashboard;
      state.userAsOtherCompanies = userAsOtherCompanies;
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
      state.userAsOtherCompanies = {
        customer: [],
        vendor: [],
        staff: [],
      };
      state.selectedCompanyIndex = 0;
      state.selectedDashboard = "";
    },

    updateUserDetails: (state, action) => {
      const { name, email, phone, selectedCompanyIndex } = action.payload;
      state.name = name ?? state.name;
      state.email = email ?? state.email;
      state.phone = phone ?? state.phone;
      state.selectedCompanyIndex =
        selectedCompanyIndex ?? state.selectedCompanyIndex;
      const updatedUser = { ...state, name, email, phone };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },

    updateCompanyDetails: (state, action) => {
      const { isCalendarMonth, name, userType, weekOff } = action.payload;
      const updatedCompanies = state.companies;
      state.companies[state.selectedCompanyIndex].isCalendarMonth =
        isCalendarMonth;
      state.companies[state.selectedCompanyIndex].name = name;
      state.companies[state.selectedCompanyIndex].userType = userType;
      state.companies[state.selectedCompanyIndex].weekOff = weekOff;
      updatedCompanies[state.selectedCompanyIndex] = {
        ...updatedCompanies[state.selectedCompanyIndex],
        isCalendarMonth,
        name,
        userType,
        weekOff,
      };
      const updatedData = { ...state, companies: updatedCompanies };
      localStorage.setItem("user", JSON.stringify(updatedData));
    },
  },
});

export const {
  setUserLogin,
  setUserLogout,
  updateUserDetails,
  updateCompanyDetails,
} = userSlice.actions;

export default userSlice.reducer;
