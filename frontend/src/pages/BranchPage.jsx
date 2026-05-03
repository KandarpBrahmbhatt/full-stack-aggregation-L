// import { useEffect, useState } from "react";
// import { fetchBranches } from "../api/api";
// import BranchList from "../components/BranchList";
// import Loader from "../components/Loadar";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const BranchPage = () => {
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(true);
//    const [schoolName, setSchoolName] = useState();
//   const navigate = useNavigate();

//   const loadBranches = async () => {
//     try {
//       // fetch all branches (empty string to get all)
//       const branchRes = await fetchBranches(schoolName);
//       setBranches(branchRes.data.data);
//         toast.success(`Data come from ${branchRes.data.source}`);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

// // Load all branches on mount
//   useEffect(() => {
//     // Use async IIFE to avoid direct setState in effect
//     (async () => {
//       await loadBranches();
//     })();
//   }, []);

//   const handleGoBack = () => {
//     navigate("/");
//     toast.success("back dashbord");
//   };

//   return (
//     <div className="container">
//       <button id="switch" onClick={handleGoBack} style={{ marginBottom: "1rem" }}>
//         Back to Dashboard
//       </button>
//       <h1>All Branches</h1>

//       {loading ? (  
//         <Loader />
//       ) : branches.length > 0 ? (
//         <BranchList data={branches} />
//       ) : (
//         <p style={{ textAlign: "center", color: "red" }}>
//           No branches found
//         </p>
//       )}
//     </div>
//   );
// };

// export default BranchPage;


import { useEffect, useState } from "react";
import { fetchBranches } from "../api/api";
import BranchList from "../components/BranchList";
import Loader from "../components/Loadar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const BranchPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const schoolName = params.get("schoolName");

  const navigate = useNavigate();

  const loadBranches = async () => {
    try {
      const branchRes = await fetchBranches(schoolName);

      console.log("API RESPONSE:", branchRes.data);

      setBranches(branchRes.data.data || []);

      toast.success(
        `${branchRes.data.totalBranches || 0} branches loaded`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolName) loadBranches();
  }, [schoolName]);

  if (!schoolName) {
    return <p>Please select a school first</p>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate("/")}>Back</button>
      <h1>{schoolName} - Branches</h1>

      {loading ? (
        <Loader />
      ) : (
        <BranchList data={branches} schoolName={schoolName} />
      )}
    </div>
  );
};

export default BranchPage;