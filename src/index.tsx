import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ChakraProvider, extendTheme, StyleFunctionProps} from '@chakra-ui/react';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement

);
document.title = "Расписание Технопарка УПК"; // Technopark Schedule
// extendTheme({
//     styles: {
//         global: (props: StyleFunctionProps) => ({
//             body: {
//                 fontFamily: '"Roboto", "Noto", sans-serif"'
//             },
//         }),
//     },
// });
root.render(

    // <ChakraProvider theme={extendTheme({
    //     styles: {
    //         global: {
    //             "html, body": {
    //                 "& :where(img, svg, video, canvas, audio, iframe, embed, object)": {
    //                     display: "inline"
    //                 },
    //             },
    //         },
    //     },
    // })}>
    //     <App />
    // </ChakraProvider>,
    <App />
);

reportWebVitals();
