import React,{useState} from 'react';
import axios from 'axios';
function Login() {
const [data,setData]=useState({
	username:'',
	password:''
})

const handleInputChange=(event)=>{
	
	const {name,value}=event.target;
	setData({
		...data,
		[name]:value
	})
}

const handleSubmit=async (event)=>{
event.preventDefault();
try{ 
	//const response = await fetch('https://jsonplaceholder.typicode.com/posts');
// fetch('/api/data').then((r)=>console.log(r.text())).then((d)=>console.log("dk ",d))
fetch('http://localhost:3002/user/login',{
	method:'POST',
	headers:{'Content-Type': 'application/json',},
	body: JSON.stringify(data),
})
  .then((response) => {
    if (!response.ok) {
	console.log("hffs")
      console.log("Network response was not ok")
      throw new Error('Network response was not ok');
    }
    else {
      console.log("good dyeeE")
	//console.log("EINRle: ",response.body)
       return response.json(); // Parse response body as JSON
    }
  })
  .then((data) => {
    // Now 'data' contains the parsed JSON response
    console.log("Parsed JSON data:");
    console.log(data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
	
}
catch(error){
	console.log("error has IRJ happened")
	console.log(error)
}
}

  return (
	<div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title text-center">Welcome</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input 
		  type="text"
		  className="form-control" 
		  id="username"
		 name="username"
		 value={data.username}
		 onChange={handleInputChange} 
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
		  onChange={handleInputChange}
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