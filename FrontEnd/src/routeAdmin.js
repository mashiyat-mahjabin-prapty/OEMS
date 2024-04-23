import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import AdminDashboard from './pages/admin/adminDash';
import AllTeachers from './pages/admin/allTeachers';
import AllCourses from './pages/admin/allCourses';
import SignUp from './pages/admin/adminSignUp';
import LogIn from './pages/admin/adminLogin';
import AllStudents from './pages/admin/allStudents';
import AddCourse from './pages/admin/addCourse';
import CourseDetails from './pages/admin/courseDetails';
import ViewSummary from './pages/admin/viewSummaryExam';
import AddMcq from './pages/admin/AddMCQquestion';
import AddWritten from './pages/admin/AddWritquestion';
import ViewMcq from './pages/admin/viewMCQquestion';
import ViewWritten from './pages/admin/viewWrittenQuestion';
import AddExam from './pages/admin/addExam';

export default function App() {
    return (
     <>
        <BrowserRouter>
        <Routes>
            <Route path="/admin/signup" exact element={<SignUp />}></Route>
            <Route path="/admin/login" exact element={<LogIn />}></Route>
            <Route path="/admin/profile" exact element={<AdminDashboard />}></Route>
            <Route path="/admin/all-teachers" exact element={<AllTeachers />}></Route>
            <Route path="/admin/all-courses-admin" exact element={<AllCourses />}></Route>
            <Route path="/admin/all-students" exact element={<AllStudents />}></Route>
            <Route path="/admin/all-courses-admin/add-course" exact element={<AddCourse />}></Route>
            <Route path="/admin/all-courses-admin/coursedetails/:courseId" exact element={<CourseDetails />}></Route>
            <Route path="/admin/all-courses-admin/coursedetails/:courseId/view-summary/:examId" exact element={<ViewSummary />}></Route>
            <Route path="/admin/coursedetails/:courseId/add-written-question/:examId" exact element={<AddWritten />}></Route>
            <Route path="/admin/coursedetails/:courseId/add-mcq-question/:examId" exact element={<AddMcq />}></Route>
            <Route path="/admin/all-courses-admin/coursedetails/:courseId/view-written-question/:examId" exact element={<ViewWritten />}></Route>
            <Route path="/admin/all-courses-admin/coursedetails/:courseId/view-mcq-question/:examId" exact element={<ViewMcq />}></Route>
            <Route path="/admin/all-courses-admin/coursedetails/:courseId/addexam" exact element={< AddExam />}></Route>


        </Routes>
        </BrowserRouter>
     </>
    )
    }