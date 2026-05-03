// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/new", // change if needed
// });

// export const fetchSchools = () =>
//   API.get(`/schools`);

// export const fetchBranches = (schoolName) =>
//   API.get(`/branches?schoolName=${schoolName || ""}`);


// export const fetchClasses = (schoolName,branchName,standard)=>{
//   API.get(`/getStudentsWithMarks?branchName=${branchName}&schoolName=${schoolName}&standard=${standard}`)
// }
// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/new"
});

// ✅ Schools
export const fetchSchools = () => API.get(`/schools`);

// ✅ Branches (optional filter)
export const fetchBranches = (schoolName) => {
  if (!schoolName) return API.get(`/branchlisting`);
  return API.get(`/branchlisting?schoolName=${encodeURIComponent(schoolName)}`);
};

// ✅ Classes (FIXED return)
export const fetchClasses = (schoolName, branchName, standard) => {
  if (!schoolName || !branchName || !standard) {
    return Promise.resolve({ data: { data: [] } }); // prevent API call
  }

  return API.get(
    `/getStudentsWithMarks?branchName=${encodeURIComponent(branchName)}&schoolName=${encodeURIComponent(schoolName)}&standard=${encodeURIComponent(standard)}`
  );
};

export default API;
