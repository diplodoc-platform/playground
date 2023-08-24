import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '@gravity-ui/uikit';

import {App} from './app';

const container = document.getElementById('app');
const root = createRoot(container);

import './styles.css';

root.render(
  <ThemeProvider theme="light"> 
    <App />
  </ThemeProvider>
);
