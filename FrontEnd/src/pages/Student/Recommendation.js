// import  React from 'react';
// import { useState } from 'react';Box
// import Link from '@mui/material/Link';
// import Typography from '@mui/material/Typography';
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
// import { createTheme } from '@mui/material/styles';
// import { ThemeProvider } from '@emotion/react';
// import Box from '@mui/material/Box';
// import { useTheme } from '@mui/material/styles';
// import MobileStepper from '@mui/material/MobileStepper';
// import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// // // import Carousel from 'react-bootstrap/Carousel';
// // // import ExampleCarouselImage from './background/backimg.jpg';
// // import { useTheme } from '@mui/material/styles';
// // import Box from '@mui/material/Box';
// // import MobileStepper from '@mui/material/MobileStepper';
// // import Paper from '@mui/material/Paper';
// // import Button from '@mui/material/Button';
// // import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
// // import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// // // import SwipeableViews from 'react-swipeable-views';
// // import { autoPlay } from 'react-swipeable-views-utils';



// // let theme = createTheme();
// // theme = responsiveFontSizes(theme);

// const steps = [
//     {
//       label: 'Select campaign settings',
//       description: `For each ad campaign that you create, you can control how much
//                 you're willing to spend on clicks and conversions, which networks
//                 and geographical locations you want your ads to show on, and more.`,
//     },
//     {
//       label: 'Create an ad group',
//       description:
//         'An ad group contains one or more ads which target a shared set of keywords.',
//     },
//     {
//       label: 'Create an ad',
//       description: `Try out different ad text to see what brings in the most customers,
//                 and learn how to enhance your ads using features like ad extensions.
//                 If you run into any problems with your ads, find out how to tell if
//                 they're running and how to resolve approval issues.`,
//     },
//   ];

// function preventDefault(event) {
//   event.preventDefault();
// }

// const theme = createTheme({
//     typography: {
//       fontFamily: [
//         'Helvetica Neue', 'Bold'
      
//       ].join(','),
//     },
//   });
  
//   // const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
  
//   const images = [
//     {
//       label: 'San Francisco – Oakland Bay Bridge, United States',
//       imgPath:
//         'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//       label: 'Bird',
//       imgPath:
//         'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//       label: 'Bali, Indonesia',
//       imgPath:
//         'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
//     },
//     {
//       label: 'Goč, Serbia',
//       imgPath:
//         'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//   ];
  

// export default function recommendation() {
   
//     const [activeStep, setActiveStep] = useState([]);
//     const maxSteps = images.length;
  
//     const handleNext = () => {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     };
  
//     const handleBack = () => {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     };
  
//     const handleStepChange = (step) => {
//       setActiveStep(step);
//     };
//     const theme = useTheme();

//   return (
//     <React.Fragment>
 
//     <ThemeProvider theme={theme}>
      
//       <Typography sx={{fontSize: '1.9rem',fontWeight: 'bold'}}>
//         Recommendation
//       </Typography>
//     </ThemeProvider>
//     <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
//       <Paper
//         square
//         elevation={0}
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           height: 50,
//           pl: 2,
//           bgcolor: 'background.default',
//         }}
//       >

//       </Paper>
    
//     </Box>
//     </React.Fragment>
//   );
// }