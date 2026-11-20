import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'notyf/notyf.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory  } from 'vue-router';


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'login',
			component: Login
		},
		{
			path: '/register',
			name: 'register',
			component: Register
		},
		{
			path: '/workouts',
			name: 'workouts',
			component: Workouts
		},
		{
			path: '/addWorkouts',
			name: 'addWorkouts',
			component: addWorkouts
		}
	]
});





// Routes
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Workouts from './pages/Workouts.vue';
import addWorkouts from './pages/addWorkouts.vue';





const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
