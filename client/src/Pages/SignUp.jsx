import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "./OAuth";

function SignUp(){
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    };
    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" placeholder="username" className="border-white bg-white p-3 rounded-lg focus:outline-none" id="username" onChange={handleChange}/>
                <input type="email" placeholder="email" className="border-white bg-white p-3 rounded-lg focus:outline-none" id="email" onChange={handleChange}/>
                <input type="password" placeholder="password" className="border-white bg-white p-3 rounded-lg focus:outline-none" id="password" onChange={handleChange} />
                <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg shadow-2xl hover:opacity-90 cursor-pointer disabled:opacity-80">
                    {loading ? 'Loading...' :'Sign Up'}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
                <p>Have an account?</p>
                <Link to={"/sign-in"} > 
                    <span className="text-blue-700">
                        Sign in
                    </span>
                 </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
}
export default SignUp;