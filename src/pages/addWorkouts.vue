<script setup>
	
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useGlobalStore } from '../stores/global.js';
	import { Notyf } from 'notyf';
	import api from '../api.js';


	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})


	const router = useRouter();
	const { getUserDetails, user } = useGlobalStore();




	const name = ref('');
	const duration = ref('');
	const isLoading = ref(false);







	async function handleAddWorkouts() {

		isLoading.value = true;

		try {

			const response = await api.post('/workouts/addWorkout', {
				name: name.value,
				duration: duration.value,
			})

			if (response.status === 200){
				notyf.success('New workout added');
			}

			router.push({path:'/workouts'});

		} catch (err) {

			notyf.error(err.response.data.message);

		} finally {

			isLoading.value = false;

		}
	}












	onMounted(async () => {
		const token = localStorage.getItem('token');
		if (!token){
			router.push({path:'/'})
		}
		await getUserDetails(token);
	})

</script>

<template>
		
	<div class="body">
		
		<form @submit.prevent="handleAddWorkouts">

			<router-link to="/workouts" class="go-back"><i class="bi bi-arrow-left"></i> Back</router-link to="/workouts">

			<div class="login-box">
				<div class="fonts">
					<p>Add new Workout</p>
				</div>
				<div class="text-box">
					<label><i class="bi bi-graph-up-arrow"></i> Name</label>
					<input type="text" autocomplete="off" v-model="name" required>
				</div>
				<div class="text-box">
					<label><i class="bi bi-clock"></i> Duration</label>
					<input type="text" autocomplete="off" v-model="duration" required>
				</div>
				<button :disabled="isLoading"><i class="bi bi-plus-lg"></i>{{isLoading ? 'Adding ....' : 'Add'}}</button>
			</div>
		</form>

	</div>

</template>

<style scoped>
	
	.body{
		height: 100vh;
		width: 100wh;
		display: flex;
		flex-direction: column;
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
	}

	.go-back{
		padding: 7px 25px;
		margin-bottom: 10px;
		text-decoration: none;
		color: #FFF4DD;
		background-color: #2B2D42;
		border-radius: 5px;
	}

	form{
		display: contents;
	}

</style>