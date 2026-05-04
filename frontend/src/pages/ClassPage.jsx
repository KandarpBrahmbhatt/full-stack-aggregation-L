// // import { useEffect, useState } from "react";
// // import { fetchClasses } from "../api/api";
// // import { useSearchParams, useNavigate } from "react-router-dom";
// // import Loader from "../components/Loadar";

// // const ClassPage = () => {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [params] = useSearchParams();
// //   const schoolName = params.get("schoolName");
// //   const branchName = params.get("branchName");
// //   const standard = params.get("standard");

// //   const navigate = useNavigate();

// //   const loadData = async () => {
// //     try {
// //       const res = await fetchClasses(schoolName, branchName, standard);
// //       setData(res.data.data);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (schoolName && branchName && standard) {
// //       loadData();
// //     }
// //   }, [schoolName, branchName, standard]);

// //   return (
// //     <div className="container">
// //       <button onClick={() => navigate(-1)}>Back</button>

// //       <h2>
// //         {schoolName} | {branchName} | Class {standard}
// //       </h2>

// //       {loading ? (
// //         <Loader />
// //       ) : (
// //         <div>
// //           {data.map((item, i) => (
// //             <div key={i} className="card">
// //               {item.studentName} - {item.marks}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ClassPage;

// import { useEffect, useState } from "react";
// import { fetchClasses } from "../api/api";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import Loader from "../components/Loadar";

// const ClassPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [params] = useSearchParams();
//   const schoolName = params.get("schoolName");
//   const branchName = params.get("branchName");
//   const standard = params.get("standard");

//   const navigate = useNavigate();

//   const loadData = async () => {
//     try {
//       const res = await fetchClasses(schoolName, branchName, standard);
//       setData(res.data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (schoolName && branchName && standard) {
//       loadData();
//     }
//   }, [schoolName, branchName, standard]);

//   return (
//     <div className="container">
//       <button onClick={() => navigate(-1)}>⬅ Back</button>

//       <h2>
//         {schoolName} | {branchName} | Class {standard}
//       </h2>

//       {loading ? (
//         <Loader />
//       ) : data.length === 0 ? (
//         <p style={{ color: "red" }}>No students found</p>
//       ) : (
//         <div className="grid">
//           {data.map((student, i) => (
//             <div key={i} className="card">
//               <h3>{student.studentName}</h3>

//               <p>
//                 {student.class} | {student.branch}
//               </p>

//               {/* 🔹 SUBJECTS */}
//               <div className="subjects">
//                 {student.subjects?.map((sub, index) => (
//                   <div key={index} className="subject">
//                     {sub.subject}: {sub.marks}
//                   </div>
//                 ))}
//               </div>

//               {/* 🔹 TOTAL */}
//               <h4>Total: {student.totalMarks}</h4>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassPage;







import { useEffect, useState } from "react";
import { fetchClasses } from "../api/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loadar";

const ClassPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const schoolName = params.get("schoolName");
  const branchName = params.get("branchName");
  const standard = params.get("standard");

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchClasses(schoolName, branchName, standard);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolName && branchName && standard) {
      loadData();
    }
  }, [schoolName, branchName, standard]);

  // ✅ Get all unique subjects (important fix)
  const allSubjects = [
    ...new Set(
      data.flatMap((s) => s.subjects?.map((sub) => sub.subject) || [])
    ),
  ];

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>
        {schoolName} | {branchName} | Class {standard}
      </h2>

      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <p style={{ color: "red" }}>No students found</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Branch</th>
                <th>Class</th>

                {/* Dynamic Subjects */}
                {allSubjects.map((subject, i) => (
                  <th key={i}>{subject}</th>
                ))}

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {data.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.studentName}</td>
                  <td>{student.branch}</td>
                  <td>{student.class}</td>

                  {/* Marks */}
                  {allSubjects.map((subject, i) => {
                    const found = student.subjects?.find(
                      (s) => s.subject === subject
                    );
                    return <td key={i}>{found ? found.marks : "-"}</td>;
                  })}

                  <td>
                    <b>{student.totalMarks}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassPage;