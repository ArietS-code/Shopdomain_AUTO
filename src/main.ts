import { createApp } from 'vue';

// Set up environment shim for tests
(globalThis as any).__VITE_ENV__ = import.meta.env;

// Import global styles
import './theme/index.scss';

import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
