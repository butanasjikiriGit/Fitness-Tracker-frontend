<script setup>
		
	import { ref, onBeforeMount } from 'vue';
	import { Notyf } from 'notyf';
	import api from '../api.js';
	import { useRouter } from 'vue-router';


	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})
	const router = useRouter();


	const email = ref('');
	const password = ref('');
	const isLoading = ref(false);


	async function handleLogin() {

		isLoading.value = true;

		try {

			if (!email.value.includes('@')){
				notyf.error('Invalid email format');
			} else {

				const response = await api.post('/users/login', {
					email: email.value,
					password: password.value
				})

				localStorage.setItem('token', response.data.access);

				if (response.status === 200){
					notyf.success('Logged In successfully');
				}

				router.push({path:'/workouts'});

			}

		} catch (err) {

			notyf.error(err.response.data.message);

		} finally {
			isLoading.value = false;
		}

	}

	onBeforeMount(() => {
		const token = localStorage.getItem('token');

		if (token){
			router.push({path:'/workouts'})
		}
	})

	

</script>

<template>
	
	<div class="body">
		
		<form @submit.prevent="handleLogin">
			<div class="login-box">
				<div class="fonts">
					<p>Welcome to Fitness Tracking <i class="bi bi-graph-up-arrow"></i></p>
					<p>Login to access and manage your fitness records</p>
				</div>
				<div class="text-box">
					<label><i class="bi bi-envelope"></i> Email</label>
					<input type="text" autocomplete="off" v-model="email" required>
				</div>
				<div class="text-box">
					<label><i class="bi bi-lock"></i> Password</label>
					<input type="password" autocomplete="off" v-model="password" required>
				</div>
				<button :disabled="isLoading">{{isLoading ? 'Logging In....' : 'Login'}}</button>
				<hr>
				<p class="link">Don't have account?</p><router-link to="/register" class="register">Register</router-link>
			</div>
		</form>

	</div>

</template>

<style scoped>
	
	.body{
		height: 100vh;
		width: 100wh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-box{
		padding: 30px;
		width: 100%;
		max-width: 600px;
		border-radius: 10px;
		background-color: #FFF4DD;
		box-shadow: 0px 0px 10px gray;
	}

	.fonts p:nth-child(1){
		font-size: 40px;
		font-weight: bold;
	}

	.fonts p:nth-child(2){
		color: gray;
		font-size: 14px;
	}

	.text-box{
		width: 100%;
		position: relative;
		margin-bottom: 20px;
	}

	.text-box label{
		font-weight: bold;
		font-size: 14px;
		margin-bottom: 5px;
	}

	.text-box input{
		width: 100%;
		padding: 8px 15px;
		letter-spacing: 3px;
		border: none;
		border-radius: 5px;
		background-color: white;
	}

	button{
		width: 100%;
		padding: 8px;
		border: none;
		border-radius: 5px;
		letter-spacing: 5px;
		font-weight: bold;
		background-color: #234E36;
		margin-top: 10px;
		color: white;
		transition: .2s;
	}

	button:hover{
		translate: -3px -3px;
		box-shadow: 2px 2px 2px black;
	}

	.link{
		display: inline-block;
		margin-right: 10px;
		font-size: 14px;
	}

	.register{
		text-decoration: none;
		font-weight: bold;
		font-size: 14px;
	}

	form{
		display: contents;
	}

</style>