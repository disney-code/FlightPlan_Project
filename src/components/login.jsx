import React,{useState} from 'react';
import axios from 'axios';
function Login() {
const [data,setData]=useState({
	username:'',
	password:''
})

const handleInputChange=(event)=>{
	
	const {name,value}=event.target;
  console.log("name and value")
  console.log(name)
  console.log(value)
	setData({
		...data,
		[name]:value
	})
}

const handleLogin=async (event)=>{
event.preventDefault();
try{ 
	const response = await axios.post('http://localhost:3002/login', {
      username: data.username,
      password: data.password,
    });

    // Check the response status code to determine success or failure
    if (response.status === 200) {
      console.log("Login successful");
    } else {
      console.log("Login failed with status code:", response.status);
    }
	
}

catch(error){
  console.log("erro ahppeRned")
}

}

  return (
	<div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title text-center">Welcome</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input 
		  type="text"
		  className="form-control" 
		  id="username"
		 name="username"
		 value={data.username}
		 onChange={(e)=>setData({...data,username:e.target.value})} 
		  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
		  type="password" 
		  className="form-control" 
		  id="password" 
		  name="password"
		  value={data.password}
		  onChange={(e)=>setData({...data,password:e.target.value})}
		  />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;