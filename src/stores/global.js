import { defineStore } from 'pinia';
import { reactive } from 'vue';

import api from '../api';


export const useGlobalStore = defineStore('global',() => {
	

	let user = reactive({
		token: localStorage.getItem('token'),
		email: null,
		isAdmin: null,
		_id: null
	})

    async function getUserDetails(token) {

        if(!token) {
			user.token = null;
		  	user.email = null;
        	user.isAdmin = null;
        	user._id = null;

        	return;
    	} else {

    		let {data} = await api.get('/users/details');
    		const userData = data.user || data;

			user.token = token;
	        user.email = userData.email;
	        user.isAdmin = userData.isAdmin;
	        user._id = userData._id;

    	}

	}

	return {
		user,
		getUserDetails
	}
})