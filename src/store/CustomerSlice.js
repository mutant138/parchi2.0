import { createSlice } from "@reduxjs/toolkit";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../firebase";

let initialState = {
  data: [],
};
// const fetchData = async () => {
//   try {
//     const { companies } = JSON.parse(localStorage.getItem("user"));
//     const ref = collection(db, "customers");
//     const q = query(ref, where("companyId", "==", companies[0].companyId));
//     const querySnapshot = await getDocs(q);

//     const dataset = querySnapshot.docs.map((doc) => {
//       const { createdAt, ...rest } = doc.data();
//       return {
//         id: doc.id,
//         ...rest,
//       };
//     });

//     console.log("🚀 ~data:", dataset);
//     initialState.data = dataset;
//   } catch (error) {
//     console.error(`Error fetching ${"customers"}:`, error);
//   }
// };

// if (localStorage.getItem("user")) {
//   initialState.data = await fetchData();
// }

const CustomerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomersDetails: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setCustomersDetails } = CustomerSlice.actions;

export default CustomerSlice.reducer;
