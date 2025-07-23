import React,{useState,useContext,useEffect} from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
function Login() {
  const [state, setState] = useState('sign up');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(AppContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (state == 'sign up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', formData);
        if (data.success) {
          console.log(data);
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        else {
          toast.error(data.message);
        }
      }
      else {
        const { data } = await axios.post(backendUrl + '/api/user/login',
          {
            email: formData.email,
            password: formData.password
          }
        );
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        else {
          toast.error(data.message);
        }
      }
    }
    catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }
  const handleChange = (event) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    });
  }
  useEffect(() => {
    if(token)
    navigate('/');
  },[token])
  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state == 'sign up' ? "Create Account" : "Login"}</p>
        <p>Please {state == 'sign up' ? "sign up" : "login"} to book appointment</p>
        {
          state == 'sign up' && 
          <div className="w-full">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="border border-zinc-300 rounded w-full p-2 mt-1" />
          </div>
        }
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="border border-zinc-300 rounded w-full p-2 mt-1"/>
        </div>
        <div className="w-full">
          <label htmlFor="name">password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="border border-zinc-300 rounded w-full p-2 mt-1"/>
        </div>
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer">{state == 'sign up' ? "Create Account" : "Login"}</button>
        {
          state == 'sign up' ?
            <p>Already have an account ? <span className="text-primary underline cursor-pointer" onClick={() => setState("login")}>Login</span></p> :
            <p>Don't have an account ? <span className="text-primary underline cursor-pointer" onClick={() => setState("sign up")}>Signup</span></p>
        }
      </div>
    </form>
  )
}

export default Login