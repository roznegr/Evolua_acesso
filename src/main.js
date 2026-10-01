import './styles/main.css';
import { createApp } from './ui/app.js';
import { initAnalytics } from './lib/analytics.js';

initAnalytics();
const root = document.getElementById('assessment');
const app = createApp(root);
document.querySelectorAll('[data-start-assessment]').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    app.start();
  }),
);
