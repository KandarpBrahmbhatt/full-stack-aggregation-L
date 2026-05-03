// // import React from "react";

// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const BranchList = ({ data }) => {
//   const navigate = useNavigate()

//     const handleclick = ()=>{
//       navigate("/class") 
//       console.log("btn clicked")
//       toast.success("classwise student")
//     }
//   return (
//     <>
//       {/* total branches */}
//       <div className="card-container">
//         {data.map((branch, index) => (
//           <div key={index} className="card">
//             <h2>{branch.branch_name}</h2>
//             <div className="grid">

//               {branch.classes.map((cls, i) => (
//                 <div onClick={handleclick} key={i} className="badge">
//                   {cls.class}: {cls.students}
//                 </div>
//               ))}

//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default BranchList;

import { useNavigate } from "react-router-dom";

const BranchList = ({ data = [], schoolName }) => {
  const navigate = useNavigate();

  const handleClick = (branch, standard) => {
    navigate(
      `/class?schoolName=${encodeURIComponent(schoolName)}&branchName=${encodeURIComponent(branch.branchName)}&standard=${encodeURIComponent(standard)}`
    );
  };

  return (
    <div className="card-container">
      {data.map((branch, index) => (
        <div key={index} className="card">
          <h2>{branch.branchName}</h2>

          <div className="grid">
            {(branch.classStats || []).map((cls, i) => (
              <div
                key={i}
                className="badge"
                onClick={() => handleClick(branch, cls.standard)}
              >
                Class {cls.standard}: {cls.totalStudents}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BranchList;
