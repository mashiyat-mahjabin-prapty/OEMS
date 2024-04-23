import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase';
import {
    Container, Table, TableBody, TableCell, TableContainer,
    tableCellClasses, TableHead, TableRow, Paper,
    IconButton, TextField, Button, Card, Box, CardContent
} from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import ThemeM from './mainTheme';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // ... your styling
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // ... your styling
}));

function ScriptPage() {
    const { courseId, examId } = useParams();
    const [examScripts, setExamScripts] = useState([]);
    const [pdfUrl, setPDFURL] = useState('');
    const [openPdf, setOpenPdf] = useState([]);
    const [render, setRender] = useState(false);
    const [numq, setNumq] = useState(0);
    const [inputValues, setInputValues] = useState(Array(numq).fill(''));
    const [marks, setMarks] = useState();
    
    useEffect(() => {
        const fetchedScripts = async () => {
            // fetch the exam scripts of the exam
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                };
                const response = await axios.get(`http://localhost:2000/api/teacher/courses/${courseId}/exams/${examId}/scripts`, requestOptions);
                console.log('Exam scripts response:', response.data);
                setRender(true);

                // filter only those scripts whose isChecked is false
                const filteredScripts = response.data.examScripts.filter((script) => script.isChecked === false);

                setExamScripts(filteredScripts);
                console.log('Exam scripts:', examScripts);

                // initialize the openPdf state
                const tempOpenPdf = [];
                for (let i = 0; i < filteredScripts.length; i++) {
                    tempOpenPdf.push(false);
                }
                setOpenPdf(tempOpenPdf);

                // fetch the number of questions in the exam
                const examDetails = await axios.get(`http://localhost:2000/api/teacher/courses/${courseId}/exams/${examId}/details`, requestOptions);
                console.log('Exam details response:', examDetails.data);
                setNumq(examDetails.data.questions);

            } catch (error) {
                console.log(error);
            }
        };
        fetchedScripts();
    }, [render]);

    useEffect(() => {
        console.log('inputValues:', inputValues);
    }, [inputValues]);

    useEffect(() => {
        // print the comments
        console.log('examScripts:', examScripts);
    }, [examScripts]);

    useEffect(() => {
        // calculate the marks
        let totalMarks = 0;
        for (let i = 0; i < inputValues.length; i++) {
            totalMarks += parseInt(inputValues[i]);
        }
        setMarks(totalMarks);
    }, [inputValues]);

    const openPdfViewer = async (pdfUrl, scriptIndex) => {
        // fetch the url from the firebase
        const storageRef = ref(storage, pdfUrl);

        pdfUrl = await getDownloadURL(storageRef);
        console.log('pdfUrl:', pdfUrl);

        setPDFURL(pdfUrl);

        // toggle the openpdf state
        const tempOpenPdf = [...openPdf];
        tempOpenPdf[scriptIndex] = !tempOpenPdf[scriptIndex];
        setOpenPdf(tempOpenPdf);
    };

    const handleCommentChange = (examId, comment) => {
        // update the comment of the exam script
        const tempExamScripts = [...examScripts];
        const index = tempExamScripts.findIndex((script) => script.exam_id === examId);
        tempExamScripts[index].comment = comment;
        setExamScripts(tempExamScripts);
    };

    const handleSave = (examId, studentId) => {
        try {
            // update the examScript in the database with isChecked = true
            const requestOptions = {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(
                    {
                        isChecked: true,
                        comment: examScripts.comment,
                        marks: marks,
                    }
                ),
              };
            // make objects of the isCheked, comment and marks and send it to the backend
            const tempExamScripts = examScripts.map((examScript) => {
                // Create an object for each examScript
                return {
                    id: examScript.exam_id, // Use the appropriate property for the ID
                    isChecked: true, // Use the appropriate property for isChecked
                    comment: examScript.comment, // Use the appropriate property for comment
                    marks: marks+examScript.obtained_marks, // Use the appropriate property for marks
                };
            });

            axios.put(`http://localhost:2000/api/teacher/courses/${courseId}/exams/${examId}/scripts/${studentId}`, tempExamScripts, requestOptions)
                .then((response) => {
                    console.log('Exam script update response:', response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
                window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <ThemeM />
                <Box display="flex" alignItems="center" sx={{ margin: '30px' }}>
                    <Card sx={{ width: '80vw', marginTop: '50px', backgroundColor: '#e0dada' }}>
                        <CardContent>
                            <h1>Exam Scripts</h1>
                            <Container>
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
                                                        <IconButton onClick={() => openPdfViewer(examScript.answer_script_url, scriptIndex)}>
                                                            <PictureAsPdf />
                                                        </IconButton>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <TextField
                                                            value={examScript.obtained_marks}
                                                            
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <TextField
                                                            value={examScript.comment}
                                                            onChange={(e) => handleCommentChange(examScript.exam_id, e.target.value)}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Button variant="outlined" onClick={()=>handleSave(examScript.exam_id, examScript.student_id)}>
                                                            Save
                                                        </Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>

                                                {openPdf[scriptIndex] && (
                                                    <React.Fragment>
                                                        {/* Add your code for additional rows here */}
                                                        {/* Example: */}
                                                        <StyledTableRow>
                                                            {Array.from(Array(numq).keys()).map((index) => (
                                                                <StyledTableCell key={index}>
                                                                    <TextField placeholder={`Q ${index + 1}`}
                                                                        value={inputValues[index]}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value;
                                                                            setInputValues((prevValues) => {
                                                                                const updatedValues = [...prevValues];
                                                                                updatedValues[index] = newValue;
                                                                                return updatedValues;
                                                                            });
                                                                        }} />
                                                                </StyledTableCell>
                                                            ))}
                                                        </StyledTableRow>
                                                        <StyledTableRow>
                                                            <StyledTableCell colspan={11}>
                                                                <h1>PDF Viewer</h1>
                                                                <iframe
                                                                    title="PDF Viewer"
                                                                    src={pdfUrl}
                                                                    width="100%"
                                                                    height="500px" // You can adjust the height as needed
                                                                >
                                                                    <p>Your browser does not support iframes.</p>
                                                                </iframe>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    </React.Fragment>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Container>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </div>
    );

}

export default ScriptPage;