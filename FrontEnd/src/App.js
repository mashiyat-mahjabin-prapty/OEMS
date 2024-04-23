import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./pages/Student/register";
import ForgotPassword from "./pages/Student/forgotPass";
import Dashboard from "./pages/Student/dashboard";
import TDashboard from "./pages/Teacher/teachersDash";
import Editprofile from './pages/Student/Editprofile';
import ExamMcq from './pages/Student/MCQExam';
import QuestWritten from './pages/Teacher/AddWritquestion';
import QuestMcq from './pages/Teacher/AddMCQquestion';
import ExamWritten from './pages/Student/WrittenExam';
import AssignedCourseforTeacher from './pages/Teacher/AssignedCourseforTeacher';
import AddExam from './pages/Teacher/addExam';
import EnrolledCourses from './pages/Student/enrolledCoursePrev';
import AddCourse from './pages/Student/addCourses';
import CourseDetails from './pages/Teacher/courseDetails';
import VieWritten from './pages/Teacher/viewWrittenQuestion';
import ViewMCQ from './pages/Teacher/viewMCQquestion';
import ExamScripts from './pages/Teacher/ExamScripts';
import ViewSummary from './pages/Teacher/viewSummaryExam';
import SignUpuTeacher from './pages/Teacher/teacherSignup';
import LogIIn from './pages/LogIn';
import LogIn from './pages/admin/adminLogin';
import AdminDashboard from './pages/admin/adminDash';
import AllTeachers from './pages/admin/allTeachers';
import AllCourses from './pages/admin/allCourses';
import SignUp from './pages/admin/adminSignUp';
import AllStudents from './pages/admin/allStudents';
import AddCourseA from './pages/admin/addCourse';
import ScriptPage from './pages/Teacher/scriptExam';
import CourseDetailsAdmin from './pages/admin/courseDetails';
import StudentStatistics from './pages/Student/Statistics';

import InvalidPage from './pages/invalidPage';

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log(token, role);

  return (
    <>
      <BrowserRouter>
        {
          token && role === "student" ? (
            <Routes>
              
              <Route path="/student/resetpassword" exact element={<ForgotPassword />}></Route>
              <Route path="/student/dashboard" exact element={<Dashboard />}></Route>
              <Route path="/student/editprofile" exact element={<Editprofile />}></Route>
              <Route path="/student/enrolledcourse" exact element={<EnrolledCourses />}></Route>
              <Route path="/student/addcourse" exact element={<AddCourse />}></Route>
              <Route path="/student/courses/:courseId/exams/:examId/mcq-exam" exact element={<ExamMcq />}></Route>
              <Route path="/student/courses/:courseId/exams/:examId/written-exam" exact element={<ExamWritten />}></Route>
              <Route path="/student/statistics" exact element={<StudentStatistics />}></Route>
              <Route path="/*" element={<InvalidPage />}></Route>
            </Routes>
          ) : token && role === "teacher" ? (
            <Routes>
              
              <Route path="/teacher/dashboard" exact element={<TDashboard />}></Route>
              <Route path="/teacher/courses" exact element={<AssignedCourseforTeacher />}></Route>
              <Route path="/teacher/course-details/:courseId/add-written-question/:examId" exact element={<QuestWritten />}></Route>
              <Route path="/teacher/course-details/:courseId/add-mcq-question/:examId" exact element={<QuestMcq />}></Route>
              <Route path="/teacher/courses/coursedetails/:courseId/addexam" exact element={< AddExam />}></Route>
              <Route path="/teacher/courses/coursedetails/:courseId" exact element={<CourseDetails />}></Route>
              <Route path="/teacher/courses/coursedetails/:courseId/view-written-question/:examId" exact element={<VieWritten />}></Route>
              <Route path="/teacher/courses/coursedetails/:courseId/view-mcq-question/:examId" exact element={<ViewMCQ />}></Route>
              <Route path="/teacher/examscripts" exact element={<ExamScripts />}></Route>
              <Route path="/teacher/examscripts/viewScript/:courseId/:examId" exact element={<ScriptPage />}></Route>
              <Route path="/teacher/courses/coursedetails/:courseId/view-summary/:examId" exact element={<ViewSummary />}></Route>
              <Route path="/*" element={<InvalidPage />}></Route>
            </Routes>
          ) : token && role === "admin" ? (
            <Routes>
              
              {/* <Route path="/admin/login" exact element={<LogIn />}></Route> */}
              <Route path="/admin/dashboard" exact element={<AdminDashboard />}></Route>
              <Route path="/admin/all-teachers" exact element={<AllTeachers />}></Route>
              <Route path="/admin/all-courses-admin" exact element={<AllCourses />}></Route>
              <Route path="/admin/all-students" exact element={<AllStudents />}></Route>
              <Route path="/admin/add-course" exact element={<AddCourseA />}></Route>
              <Route path="/admin/all-courses-admin/coursedetails/:courseId" exact element={<CourseDetailsAdmin />}></Route>
              <Route path="/*" element={<InvalidPage />}></Route>
            </Routes>
          ) : role === "admin" ? (
            <Routes>
              <Route path="/admin/login" exact element={<LogIn />}></Route>
              <Route path="/admin/signup" exact element={<SignUp />}></Route>
              <Route path="/*" element={<InvalidPage />}></Route>
            </Routes>
          ) : role === "teacher" ? (
            <Routes>
              <Route path="/teacher/signup" exact element={<SignUpuTeacher />}></Route>
              <Route path="/*" element={<InvalidPage />}></Route>
            </Routes>
          ) : role === "student" ? (
            <Routes>
              <Route path="/student/register" exact element={<Register />}></Route>
              <Route path="/*" element={<InvalidPage />}></Route>
            </Routes>
          ) : (
            <Routes>
              <Route path="/" exact element={<LogIIn />}></Route>
            </Routes>
          )
        }
      </BrowserRouter >
    </>
  )
}

