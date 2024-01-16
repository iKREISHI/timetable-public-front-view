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

const overrides = extendTheme({
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                fontFamily: '"Roboto", "Noto", sans-serif"'
            },
        }),
    },
})
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
    <ChakraProvider theme={extendTheme({
        styles: {
            global: {
                "html, body": {
                    "& :where(img, svg, video, canvas, audio, iframe, embed, object)": {
                        display: "inline"
                    },
                },
            },
        },
    })}>
        <App />
    </ChakraProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
