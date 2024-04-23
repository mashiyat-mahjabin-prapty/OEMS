import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import waving from '../background/hello.png';
import Box from '@mui/material/Box';

// let theme = createTheme();
// theme = responsiveFontSizes(theme);



function preventDefault(event) {
  event.preventDefault();
}
// const theme = createTheme({
//     typography: {
//       // In Chinese and Japanese the characters are usually larger,
//       // so a smaller fontsize may be appropriate.
//       fontSize: 12,
//     },
//   });

const theme = createTheme({
    typography: {
      fontFamily: [
        'Helvetica Neue', 'Bold'
      
      ].join(','),
    },
  });
  

  
  

export default function Hello() {
  return (
    <React.Fragment>
         <div style={{ alignItems:'self-end' }}>
        <img src={waving} style={{height:200, width:200, position: 'absolute', left:'550px'}} />   

        {/* <Box
  component="img"
  sx={{
    height: 233,
    width: 350,
    maxHeight: { xs: 233, md: 167 },
    maxWidth: { xs: 350, md: 250 },
  }}
  alt="waving"
  src={ waving}
  marginLeft={{ xs: 4, md: 26 }}
/> */}
      </div>
     
    <ThemeProvider theme={theme}>
      
      <Typography sx={{fontSize: '4.5rem',fontWeight: 'bold'}}>
        Hello
      </Typography>
      <Typography sx={{fontSize: '4.5rem',fontWeight: 'bold'}} >
        Alice!
      </Typography>
    </ThemeProvider>

    </React.Fragment>
  );
}