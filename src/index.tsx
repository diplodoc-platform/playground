import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '@gravity-ui/uikit';

import {App} from './app';

import './index.css';
import './styles.css';
import './overrides.scss';

import '@diplodoc/transform/dist/js/yfm.js';

const container = document.getElementById('app');
const root = createRoot(container as HTMLElement);

root.render(
  <ThemeProvider theme="light">
    <App />
  </ThemeProvider>,
);
