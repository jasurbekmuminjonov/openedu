import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Staff from "./pages/Staff";
import Home from "./pages/Home";
import Teacher from "./pages/Teacher";
import Group from "./pages/Group";
import Subject from "./pages/Subject";
import Subscription from "./pages/Subscription";
import Payment from "./pages/Payment";
import Salary from "./pages/Salary";
import Expense from "./pages/Expense";
import Analytics from "./pages/Analytics";
import Student from "./pages/Student";
import GroupDetails from "./pages/GroupDetails";
import StudentDetails from "./pages/StudentDetails";
import Lesson from "./pages/Lesson";
import Attendance from "./pages/Attendance";
import TeacherDetails from "./pages/TeacherDetails";
import Exam from "./pages/Exam";
import { useEffect } from "react";
import Settings from "./pages/Settings";

const App = () => {
  const token = localStorage.getItem("token");
  const primaryColor = localStorage.getItem("primaryColor");
  const userFont = localStorage.getItem("userFont");
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", primaryColor || "#1677ff");
    root.style.setProperty("--user-font", userFont || "'Poppins', sans-serif");
  }, [primaryColor, userFont]);
  return token ? (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher/:id" element={<TeacherDetails />} />
        <Route path="/student" element={<Student />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/student/:id" element={<StudentDetails />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/group" element={<Group />} />
        <Route path="/group/:id" element={<GroupDetails />} />
        <Route path="/subject" element={<Subject />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  ) : (
    <Login />
  );
};

export default App;
