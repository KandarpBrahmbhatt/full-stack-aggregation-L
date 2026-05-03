import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";

import School from "../models/school.model.js";
import Branch from "../models/branch.model.js";
import Student from "../models/student.model.js";
import StudentStandard from "../models/studentStandard.model.js";
import Result from "../models/result.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log("DB Connected");

    // 🔥 Drop DB (important for Atlas + clean run)
    await mongoose.connection.dropDatabase();
    console.log("Database dropped");

    // ✅ 1. CREATE SCHOOLS
    const schools = await School.insertMany([
      { name: "New Noble School" },
      { name: "Panchtirth School" },
      { name: "Silver Oak School" }
    ]);
    console.log("Schools inserted");

    // ✅ 2. DIFFERENT BRANCHES PER SCHOOL
    const branchConfig = {
      "New Noble School": ["Gota", "Bopal"],
      "Panchtirth School": ["Ranip", "Chandkheda"],
      "Silver Oak School": ["SG Highway", "Science City"]
    };

    const branchData = [];

    schools.forEach((school) => {
      const branchesForSchool = branchConfig[school.name];

      branchesForSchool.forEach((branch) => {
        branchData.push({
          name: branch,
          schoolId: school._id
        });
      });
    });

    const branches = await Branch.insertMany(branchData);
    console.log("Branches inserted");

    // ✅ OPTIMIZATION: branch map (O(1))
    const branchMap = {};
    branches.forEach((b) => {
      const key = b.schoolId.toString();
      if (!branchMap[key]) branchMap[key] = [];
      branchMap[key].push(b);
    });

    // ⚠️ Atlas free → keep low
    const TOTAL_STUDENTS = 1800000;   // use 1800000 for local DB only
    const BATCH_SIZE = 10000;

    const subjects = ["Maths", "Science", "English"];

    console.log("Seeding students...");

    for (let i = 0; i < TOTAL_STUDENTS; i += BATCH_SIZE) {
      const studentsBatch = [];

      // 👉 STEP 1: Prepare students
      for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_STUDENTS; j++) {
        const school =
          schools[Math.floor(Math.random() * schools.length)];

        const schoolBranches = branchMap[school._id.toString()];
        const branch =
          schoolBranches[Math.floor(Math.random() * schoolBranches.length)];

        studentsBatch.push({
          name: `Student_${i + j}`,
          schoolId: school._id,
          branchId: branch._id
        });
      }

      // 👉 STEP 2: Insert students
      const insertedStudents = await Student.insertMany(studentsBatch, {
        ordered: true // keep true for debugging
      });

      console.log(`Students inserted: ${insertedStudents.length}`);

      // 👉 STEP 3: Prepare standards + results
      const standardsBatch = [];
      const resultsBatch = [];

      insertedStudents.forEach((student) => {
        const standard = Math.floor(Math.random() * 12) + 1;

        standardsBatch.push({
          studentId: student._id,
          schoolId: student.schoolId,   // ✅ FIX
          branchId: student.branchId,   // ✅ FIX
          standard
        });

        subjects.forEach((sub) => {
          resultsBatch.push({
            studentId: student._id,
            standard,
            subject: sub,
            marks: Math.floor(Math.random() * 100)
          });
        });
      });

      console.log(`Standards prepared: ${standardsBatch.length}`);

      // 👉 STEP 4: Insert standards
      const insertedStandards = await StudentStandard.insertMany(
        standardsBatch,
        { ordered: true }
      );

      console.log(`Standards inserted: ${insertedStandards.length}`);

      // 👉 STEP 5: Insert results
      const insertedResults = await Result.insertMany(resultsBatch, {
        ordered: true
      });

      console.log(`Results inserted: ${insertedResults.length}`);

      console.log(`✅ Batch completed: ${i + BATCH_SIZE}`);
    }

    console.log("🎉 Data seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error("Seeder Error:", error);
    process.exit(1);
  }
};

seedData();