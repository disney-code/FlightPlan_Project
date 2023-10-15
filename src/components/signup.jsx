import React, { useState } from 'react';
import axios from 'axios';


function SignUp(){

const [formData, setFormData]=useState({
	username:'',
	password:'',
	email:''
})
const [error, setError] = useState(null);
const handleSubmit=(event)=>{
	event.preventDefault();
	
	axios.post('http://localhost:3002/submit-form', formData)
	.then((response) => {
		
		setError(null)
	 
	})
	.catch((error) => {
		
	if(error.response && error.response.status===400){
setError("Username or email already in use");
	}
		else{
			setError("An error occurred during registration")
		}
	  
	});

console.log(formData)
}

const handleInputChange = (event)=>{
	const {name, value}=event.target;
	setFormData({...formData, [name]:value});

}
	return(
		<div>
<h1 className="mt-4">Sign Up Page</h1>
{error && <div className="alert alert-danger">{error}</div>}
<form  onSubmit={handleSubmit}>
	<div className="form-group">
	<label htmlFor="username">Username:</label>
	<input 
	id="username"
	type="text"
	name="username"
	placeholder='Username'
	value={formData.username}
	onChange={handleInputChange}
	className="form-control"
	/>
	</div>
	<div className="form-group">
<label htmlFor="email">Email:</label>
	<input
	type="email"
	name="email"
	placeholder='Email'
	value={formData.email}
	onChange={handleInputChange}
	className="form-control"
	/>
	</div>
	<div className="form-group">
<label htmlFor="password">Password:</label>
<input
	type="password"
	name="password"
	placeholder='Password'
	value={formData.password}
	onChange={handleInputChange}
	className="form-control"
	/>
	</div>

<button type="submit" className="btn btn-primary">Sign Up</button>
</form>


		</div>
	)
}

export default SignUp;