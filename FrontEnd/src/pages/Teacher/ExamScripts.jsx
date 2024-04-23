import React, { useState, useEffect } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer,
    tableCellClasses, TableHead, TableRow, Paper,
    IconButton, TextField, Button, Card, Box, CardContent
} from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';
import ThemeM from './mainTheme';
import { styled } from '@mui/material/styles';
import { storage } from '../../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
// import PDFViewer from 'pdf-viewer-reactjs';
// import { Document, Page } from 'react-pdf';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // ... your styling
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // ... your styling
}));

function ExamScriptPage() {
    const [courses, setCourses] = useState([]);
    const [examScripts, setExamScripts] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [render, setRender] = useState(false);
    const [coursesWithWrittenExams, setCoursesWithWrittenExams] = useState([]);
    const [viewScripts, setViewScripts] = useState([[false]]);
    const [openPdf, setOpenPdf] = useState([[[false]]]);
    const [pdfUrl, setPDFURL] = useState('');
    const [numPages, setNumPages] = useState(1);
    const [pdfData, setPdfData] = useState(null);
    const [selectedViewIndex, setSelectedViewIndex] = useState(0);
    const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                };

                console.log('Fetching courses');
                const response = await axios.get('http://localhost:2000/api/teacher/courses', requestOptions);
                console.log('Response data:', response.data);

                // Set courses after successful fetch
                setCourses(response.data.courses);
                setRender(true);
                console.log('Courses fetched');

                // Fetch exams for each course and filter by exam type
                const examsPromises = courses.map(async (course) => {
                    const examsResponse = await axios.get(`http://localhost:2000/api/teacher/courses/${course.course_id}`, requestOptions);
                    console.log('Exams response:', examsResponse.data.examCourseEntries);
                    // Filter exams by type (e.g., 'written')
                    const writtenExams = examsResponse.data.examCourseEntries.filter((exam) => exam.exam_type === 'Written');

                    // Return an object with the course and its written exams
                    return {
                        course,
                        writtenExams,
                    };
                });

                // Wait for all exams to be fetched and filter by courses with written exams
                const coursesWithWrittenExams = await Promise.all(examsPromises)
                    .then((results) => results.filter((result) => result.writtenExams.length > 0));

                // Set the filtered courses with written exams
                setCoursesWithWrittenExams(coursesWithWrittenExams);
                console.log('Courses with written exams:', coursesWithWrittenExams);
                console.log('Courses with written exams fetched');

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses(); // Call the async function to fetch courses
    }, [render]);

    const viewScriptofExam = async (courseId, examId) => {
        window.location.href =  '/teacher/examScripts/viewScript/' + courseId + '/' + examId;
    };

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <ThemeM />
                <Box display="flex" alignItems="center" sx={{ margin: '30px' }}>
                    <Card sx={{ width: '80vw', marginTop: '50px', backgroundColor: '#e0dada' }}>
                        <CardContent>
                            <h1>All Exam Scripts</h1>
                            <Container>
                                {coursesWithWrittenExams.map((course, courseIndex) => (
                                    <Card key={course.course.course_id} sx={{ marginTop: '20px' }}>
                                        <CardContent>
                                            <h1>{course.course.name}</h1>
                                            <TableContainer component={Paper}>
                                                <Table aria-label="Exam Script Table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>Exam Name</StyledTableCell>
                                                            {/* <StyledTableCell>Total Scripts</StyledTableCell> */}
                                                            <StyledTableCell>View Scripts</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {course.writtenExams.map((row, examIndex) => (
                                                            <React.Fragment key={row.exam_id}>
                                                                <StyledTableRow className={examIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                                                                    <StyledTableCell>{row.name}</StyledTableCell>
                                                                    {/* <StyledTableCell>0</StyledTableCell> */}
                                                                    <StyledTableCell>
                                                                        <button onClick={() => viewScriptofExam(course.course.course_id, row.exam_id, courseIndex, examIndex)}>
                                                                            View Scripts
                                                                        </button>
                                                                    </StyledTableCell>
                                                                </StyledTableRow>

                                                                {/* {viewScripts[examIndex] && (
                                                                    <React.Fragment>
                                                                        <StyledTableRow>
                                                                            <TableCell colSpan={3}>
                                                                                <Table aria-label="Exam Script Table">
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <StyledTableCell>Student ID</StyledTableCell>
                                                                                            <StyledTableCell>Script</StyledTableCell>
                                                                                            <StyledTableCell>Given Marks</StyledTableCell>
                                                                                            <StyledTableCell>Comment</StyledTableCell>
                                                                                            <StyledTableCell>Save</StyledTableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {examScripts.map((examScript, scriptIndex) => (
                                                                                            <React.Fragment key={examScript.exam_id}>
                                                                                                <StyledTableRow key={examScript.exam_id} className={scriptIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                                                                                                    <StyledTableCell>{examScript.student_id}</StyledTableCell>
                                                                                                    <StyledTableCell>
                                                                                                        <IconButton onClick={() => openPdfViewer(examScript.answer_script_url, course.course.course_id, row.exam_id, examScript.student_id, examIndex, scriptIndex)}>
                                                                                                            <PictureAsPdf />
                                                                                                        </IconButton>
                                                                                                    </StyledTableCell>
                                                                                                    <StyledTableCell>
                                                                                                        <TextField
                                                                                                            value={examScript.givenMarks}
                                                                                                            onChange={(e) => handleMarksChange(examScript.exam_id, e.target.value)}
                                                                                                        />
                                                                                                    </StyledTableCell>
                                                                                                    <StyledTableCell>
                                                                                                        <TextField
                                                                                                            value={examScript.comment}
                                                                                                            onChange={(e) => handleCommentChange(examScript.exam_id, e.target.value)}
                                                                                                        />
                                                                                                    </StyledTableCell>
                                                                                                    <StyledTableCell>
                                                                                                        <Button variant="outlined" onClick={handleSave}>
                                                                                                            Save
                                                                                                        </Button>
                                                                                                    </StyledTableCell>
                                                                                                </StyledTableRow>

                                                                                                {openPdf[examIndex][scriptIndex] && (
                                                                                                    <StyledTableRow>
                                                                                                        <TableCell colSpan={5}>
                                                                                                            <h1>PDF Viewer</h1>
                                                                                                            <iframe
                                                                                                                title="PDF Viewer"
                                                                                                                src={pdfUrl}
                                                                                                                width="100%"
                                                                                                                height="500px" // You can adjust the height as needed
                                                                                                            >
                                                                                                                <p>Your browser does not support iframes.</p>
                                                                                                            </iframe>
                                                                                                        </TableCell>
                                                                                                    </StyledTableRow>
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        ))}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </TableCell>
                                                                        </StyledTableRow>
                                                                        {setViewScripts(Array(viewScripts.length).fill(false))}
                                                                    </React.Fragment>

                                                                                                )}*/}
                                                            </React.Fragment>
                                                        ))} 
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Container>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </div>
    );
}

export default ExamScriptPage;
