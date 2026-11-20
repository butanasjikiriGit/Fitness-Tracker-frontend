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



	const workouts = ref([]);
	const updateBox = ref(false);

	const name = ref('');
	const duration = ref('');
	const id = ref('')






	async function fetchWorkouts() {

		try {

			const response = await api.get('/workouts/getMyWorkouts');
			workouts.value = response.data;

		} catch (err) {

			notyf.error(err.response.data.message);

		}

	}





	async function handleLogout() {
		
		localStorage.removeItem('token');
		getUserDetails(null);
		router.push({path:'/'});
		notyf.success('Logged Out successfully');

	}






	async function deleteFunction(workoutId) {

		try {

			const response = await api.delete(`/workouts/deleteWorkout/${workoutId}`)

			if (response.status === 200){
				notyf.success(response.data.message);
			}

			fetchWorkouts();

		} catch (err) {

			notyf.error(err.response.data.message);

		}

	}








	async function completeStatus(workoutId) {

		try {

			const response = await api.patch(`/workouts/completeWorkoutStatus/${workoutId}`)

			if (response.status === 200){
				notyf.success(response.data.message);
			}

			fetchWorkouts();

		} catch (err) {

			notyf.error(err.response.data.message);

		}

	}







	async function openUpdateBox(workoutId) {

		try {

			updateBox.value = true;

			const response = await api.get(`/workouts/getWorkouts/${workoutId}`);
			name.value = response.data.name;
			duration.value = response.data.duration;
			id.value = response.data._id;

		} catch (err) {

			notyf.error(err.response.data.message);

		}

	}

	async function closeUpdateBox() {
		updateBox.value = false;
	}








	async function handleUpdate() {

		try {

			const response = await api.patch(`/workouts/updateWorkout/${id.value}`, {
				name: name.value,
				duration: duration.value
			})

			if (response.status === 200){
				notyf.success(response.data.message);
			}

			fetchWorkouts();

		} catch (err) {

			notyf.error(err.response.data.message);

		} finally {

			updateBox.value = false;

		}

	}








	onMounted(async () => {
		const token = localStorage.getItem('token');
		if (!token){
			router.push({path:'/'})
		}
		await getUserDetails(token);
	})

	fetchWorkouts();

</script>

<template>

	<div v-if="updateBox" class="modal-box">
		<form @submit.prevent="handleUpdate">
			<div class="font1">
				<p>Update {{name}} details</p>
			</div>
			<div class="font2">
				<div class="input-box">
					<label>Name:</label>
					<input type="text" v-model="name">
				</div>
				<div class="input-box">
					<label>Duration:</label>
					<input type="text" v-model="duration">
				</div>
			</div>
			<div class="update-btn">
				<button @click.prevent="closeUpdateBox" class="bg-warning">Close</button>
				<button type="submit" class="bg-primary">Save</button>
			</div>
		</form>
	</div>
	
	<div class="container">

		<h1 class="text-center p-5">Welcome to Fitness Tracker <i class="bi bi-graph-up-arrow"></i></h1>

		<div class="row mb-3">
			<div class="col-12 d-flex">
				<div class="add-exit">
					<router-link to="/addWorkouts" class="add-new"><i class="bi bi-plus-lg"></i> Add Workout</router-link>
					<button @click.prevent="handleLogout" class="logout"><i class="bi bi-box-arrow-in-right"></i> LogOut</button>
				</div>
			</div>
		</div>

		<div v-if="workouts.length === 0" class="row">
			<div class="col-12">
				
				<div class="no-data">
					<p>No Workouts available</p>
				</div>

			</div>
		</div>

		<div v-else class="row">
			<div class="col-12">
				
				<div class="parent-box" v-for="workout in workouts" :key="workout._id">

					<div class="display-box">
						
						<div class="name">
							<p>{{workout.name}}</p>
							<p class="pending" v-if="workout.status === 'pending'">Pending</p>
							<p class="completed" v-else>Completed</p>
						</div>
						<div class="status-duration">
							<p>Status: {{workout.status}}</p>
							<p>Duration: {{workout.duration}}</p>
							<p>Date Added: {{workout.dateAdded}}</p>
						</div>
						<div v-if="workout.status === 'pending'" class="actions">
							<button @click.prevent="completeStatus(workout._id)">Complete</button>
							<button @click.prevent="openUpdateBox(workout._id)">Edit</button>
							<button @click.prevent="deleteFunction(workout._id)">Delete</button>
						</div>
						<div v-else class="actions">
							<button disabled class="text-decoration-line-through bg-warning">Complete</button>
							<button disabled class="text-decoration-line-through bg-warning">Edit</button>
							<button @click.prevent="deleteFunction(workout._id)">Delete</button>
						</div>

					</div>

				</div>

			</div>
		</div>
	</div>

</template>

<style scoped>

	.no-data{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		font-weight: bold;
		margin-top: 40px;
	}

	h1{
		font-weight: bold;
		font-size: 50px;
	}
	
	.display-box{
		border-radius: 20px;
		background-color: #FFF4DD;
		margin-bottom: 20px;
		position: relative;
		overflow: hidden;
		box-shadow: 0px 0px 10px gray;
	}

	.name{
		background-color: #2B2D42;
		padding: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		color: white;
		font-size: 30px;
	}

	.status-duration{
		padding: 10px 50px;
	}

	.status-duration p{
		font-weight: bold;
		font-size: 14px;
	}

	.add-exit{
		margin-left: auto;
	}

	.add-new{
		text-decoration: none;
		color: white;
		font-size: 16px;
		padding: 10px 25px;
		background-color: royalblue;
		border-radius: 5px;
	}

	.logout{
		padding: 8px 25px;
		border: none;
		background-color: indianred;
		color: white;
		font-weight: normal;
		margin-left: 10px;
		border-radius: 5px;
		font-size: 16px;
	}

	.actions{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 10px;
		position: absolute;
		right: 10px;
		bottom: 10px;
	}

	.actions button{
		width: 120px;
		border-radius: 5px;
		border: none;
		padding: 5px;
		font-weight: bold;
		font-size: 12px;
		color: white;
		transition: .2s;
	}

	.actions button:hover{
		translate: 0px -3px;
		box-shadow: 2px 2px 2px gray;
	}

	.actions button:nth-child(1){
		background-color: forestgreen;
	}
	.actions button:nth-child(2){
		background-color: royalblue;
	}
	.actions button:nth-child(3){
		background-color: indianred;
	}

	.pending{
		color: white;
		font-size: 12px;
		letter-spacing: 2px;
		background-color: indianred;
		font-weight: bold;
		padding: 2px 20px;
		border-radius: 100px;
	}

	.completed{
		color: white;
		font-size: 12px;
		letter-spacing: 2px;
		background-color: forestgreen;
		font-weight: bold;
		padding: 2px 20px;
		border-radius: 100px;
	}

	.modal-box{
		background-color: #FFF4DD;
		border-radius: 20px;
		box-shadow: 0px 0px 10px gray;
		z-index: 2;
		position: fixed;
		top: 30%;
		left: 40%;
		width: 100%;
		max-width: 400px;
		overflow: hidden;
	}

	.font1{
		width: 100%;
		background-color: #2B2D42;
		padding: 10px;
		font-size: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-weight: bold;
	}

	.font1 p{
		margin: 0;
	}

	.font2{
		padding: 20px;
		width: 100%;
		position: relative;
	}

	.input-box{
		width: 100%;
		position: relative;
		margin-bottom: 20px;
	}

	.input-box input{
		width: 100%;
		padding: 10px 10px;
		border: none;
		border-radius: 5px;
		letter-spacing: 3px;
	}

	.input-box label{
		font-weight: bold;
		margin-bottom: 5px;
	}

	.update-btn{
		padding: 20px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

	.update-btn button{
		width: 100%;
		padding: 6px;
		border: none;
		color: white;
		border-radius: 5px;
		font-weight: bold;
		letter-spacing: 3px;
		transition: .2s;
	}

	.update-btn button:hover{
		translate: 0px -3px;
		box-shadow: 3px 3px 3px gray;
	}




	@media (max-width: 407px){

		.status-duration{
			padding: 10px 10px;
		}

		.modal-box{
			position: fixed;
			top: 30%;
			left: 0%;
		}

	}

</style>