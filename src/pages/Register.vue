<script setup>
		
	import { ref, onBeforeMount, watch } from 'vue';
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
	const comfirmPassword = ref('');
	const isLoading = ref(false);
	const isEnable = ref(false);


	


	watch([email, password, comfirmPassword], (currentValue, oldValue) => {
		if (currentValue.every((input) => input !== "") && currentValue[1] === currentValue[2]){
			isEnable.value = true;
		} else {
			isEnable.value = false;
		}
	})







	async function handleRegister() {

		isLoading.value = true;

		try {

			const response = await api.post('/users/register', {
				email: email.value,
				password: password.value
			})

			if (response.status === 200){
				notyf.success(response.data.message);
			}

			router.push({path:'/'})

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
		
		<form @submit.prevent="handleRegister">
			<div class="login-box">
				<div class="fonts">
					<p>Create Account</p>
					<p>Register and be one of our fellow users that manages thier workouts</p>
				</div>
				<div class="text-box">
					<label><i class="bi bi-envelope"></i> Email</label>
					<input type="text" v-model="email" required autocomplete="off">
				</div>
				<div class="text-box">
					<label><i class="bi bi-lock"></i> Password</label>
					<input type="password" autocomplete="off" v-model="password" required>
				</div>
				<div class="text-box">
					<label><i class="bi bi-lock"></i> Password</label>
					<input type="password" autocomplete="off" v-model="comfirmPassword" required>
				</div>
				<button :disabled="isLoading" v-if="isEnable">{{isLoading ? 'Creating Account....' : 'Register'}}</button>
				<button class="bg-danger" disabled v-else>Register</button>
				<hr>
				<p class="link">Already have account?</p><router-link to="/" class="register">Login</router-link>
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