

// controllers/school.controller.js

import School from "../models/school.model.js";
import mongoose from "mongoose";
import Branch from "../models/branch.model.js";
import StudentStandard from "../models/studentStandard.model.js";

export const getSchoolListing = async (req, res) => {
    try {
        const data = await School.aggregate([

            // 1. JOIN BRANCHES
            {
                $lookup: {
                    from: "branches",
                    localField: "_id",
                    foreignField: "schoolId",
                    as: "branches"
                }
            },

            // 2. JOIN STUDENT STANDARD
            {
                $lookup: {
                    from: "studentstandards",
                    localField: "_id",
                    foreignField: "schoolId",
                    as: "students"
                }
            },

            // 3. UNWIND STUDENTS
            {
                $unwind: {
                    path: "$students",
                    preserveNullAndEmptyArrays: true
                }
            },

            // 4. GROUP BY SCHOOL + STANDARD
            {
                $group: {
                    _id: {
                        schoolId: "$_id",
                        schoolName: "$name",
                        standard: "$students.standard"
                    },
                    branchCount: { $first: { $size: "$branches" } },
                    totalStudents: { $sum: 1 }
                }
            },

            // 5. GROUP AGAIN BY SCHOOL
            {
                $group: {
                    _id: {
                        schoolId: "$_id.schoolId",
                        schoolName: "$_id.schoolName"
                    },
                    branchCount: { $first: "$branchCount" },
                    standards: {
                        $push: {
                            standard: "$_id.standard",
                            totalStudents: "$totalStudents"
                        }
                    }
                }
            },

            // 6. FORMAT
            {
                $project: {
                    _id: 0,
                    schoolName: "$_id.schoolName",
                    branchCount: 1,
                    standards: 1
                }
            }

        ]);

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};



export const getBranchWiseData = async (req, res) => {
    try {
        const { schoolName } = req.query;

        // if (!schoolName) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "schoolName is required"
        //     });
        // }

        const data = await Branch.aggregate([
            // ✅ Step 1: Join School collection
            {
                $lookup: {
                    from: "schools",
                    localField: "schoolId",
                    foreignField: "_id",
                    as: "school"
                }
            },
            { $unwind: "$school" },

            // ✅ Step 2: Filter by schoolName
            ...(schoolName
                ? [{
                    $match: {
                        "school.name": schoolName
                    }
                }]
                : []),

            // ✅ Step 3: Join StudentStandard
            {
                $lookup: {
                    from: "studentstandards",
                    let: { branchId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$branchId", "$$branchId"]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$standard",
                                totalStudents: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { _id: 1 } // sort classes 1 → 12
                        }
                    ],
                    as: "classStats"
                }
            },

            // ✅ Step 4: Format output
            {
                $project: {
                    _id: 0,
                    branchId: "$_id",
                    branchName: "$name",
                    schoolName: "$school.name",
                    classStats: {
                        $map: {
                            input: "$classStats",
                            as: "c",
                            in: {
                                standard: "$$c._id",
                                totalStudents: "$$c.totalStudents"
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            totalBranches: data.length,
            data
        });

    } catch (error) {
        console.error("Branch Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// export const getBranchWiseData = async (req, res) => {
//     try {
//         const { schoolId } = req.query;

//         if (!schoolId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "schoolId is required"
//             });
//         }

//         const data = await Branch.aggregate([
//             // ✅ Step 1: Filter branches of selected school
//             {
//                 $match: {
//                     schoolId: new mongoose.Types.ObjectId(schoolId)
//                 }
//             },

//             // ✅ Step 2: Join StudentStandard (BEST for counting)
//             {
//                 $lookup: {
//                     from: "studentstandards",
//                     let: { branchId: "$_id" },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $eq: ["$branchId", "$$branchId"]
//                                 }
//                             }
//                         },
//                         {
//                             $group: {
//                                 _id: "$standard",
//                                 totalStudents: { $sum: 1 }
//                             }
//                         }
//                     ],
//                     as: "classStats"
//                 }
//             },

//             // ✅ Step 3: Format output
//             {
//                 $project: {
//                     _id: 0,
//                     branchId: "$_id",
//                     branchName: "$name",
//                     classStats: 1
//                 }
//             }
//         ]);

//         res.json({
//             success: true,
//             totalBranches: data.length,
//             data
//         });

//     } catch (error) {
//         console.error("Branch Stats Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }
// };


import Result from "../models/result.model.js";

export const getStudentsWithMarks = async (req, res) => {
    try {
        const { schoolName, branchName, standard } = req.query;

        const data = await Result.aggregate([

            // student
            {
                $lookup: {
                    from: "students",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },

            // branch
            {
                $lookup: {
                    from: "branches",
                    localField: "student.branchId",
                    foreignField: "_id",
                    as: "branch"
                }
            },
            { $unwind: "$branch" },

            // school
            {
                $lookup: {
                    from: "schools",
                    localField: "student.schoolId",
                    foreignField: "_id",
                    as: "school"
                }
            },
            { $unwind: "$school" },

            // filters
            {
                $match: {
                    ...(schoolName && {
                        "school.name": { $regex: schoolName, $options: "i" }
                    }),
                    ...(branchName && {
                        "branch.name": { $regex: branchName, $options: "i" }
                    }),
                    ...(standard && { standard: Number(standard) })
                }
            },

            {
                $project: {
                    _id: 0,
                    studentName: "$student.name",
                    subject: 1,
                    marks: 1,
                    class: { $concat: ["Class ", { $toString: "$standard" }] },
                    branch: "$branch.name",
                    school: "$school.name"
                }
            },

            { $limit: 100 }

        ]);

        res.json({ success: true, count: data.length, data });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
