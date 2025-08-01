import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate , Link} from 'react-router-dom';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
// by this uploadbytesResumable , we can track the process of uploading
import { app } from "../firebase";

import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure , deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser , loading , error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [listings , setListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (fileUploadError) {
      const timer = setTimeout(() => {
        setFileUploadError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fileUploadError]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        // dispatch(updateUserSuccess(null));
        // setUpdateSuccess(false);
        dispatch(updateUserFailure(error.message))
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) =>{
    setFormData({ ...formData , [e.target.id]: e.target.value});
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
        dispatch(updateUserStart());
        const res = await fetch(`api/user/update/${currentUser._id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(res.status === 401) {
            dispatch(updateUserFailure('Unauthorized access'));
            setTimeout(() => {
                dispatch(updateUserFailure('Token expired, please login again'));

                setTimeout(() => {
                    navigate('/sign-in');
                }, 2000);
            }, 2000);
            return;
        }
        if(data.success === false){
            dispatch(updateUserFailure(data.message));
            return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        
    } catch (error) {
        dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser = async ()=>{
    try {
        dispatch(deleteUserStart());
        const res = await fetch(`api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if(data.success === false){
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(deleteUserSuccess(data));    
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
  }
 
  const handleSignOutUser = async () =>{
    try {
        dispatch(signOutUserStart());
        const res = await fetch('api/auth/signout');
        const data = await res.json();
        if(data.success === false){
            dispatch(signOutUserFailure(data.message));
            return;
        }
        dispatch(signOutUserSuccess(data));
    } catch (error) {
        dispatch(signOutUserFailure(error.message));
    }
  }
  const handleShowListings = async () =>{
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleDeleteListing = async (listingId) =>{
    try {
         const res = await fetch(`/api/listing/delete/${listingId}`,{
          method: 'DELETE',
         })
         const data = await res.json();
         if(data.success === false){
            setShowListingError(data.message);
            return;
         }
         setListings((prev) => prev.filter((listing)=> listing._id !== listingId));
        //  ui is not updated in sync with the server , samrth sir se puchna he 
    } catch (error) {
      setShowListingError('Error deleting listing');
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          onChange={handleChange}
          defaultValue={currentUser.username}
          id="username"
          className="border-white bg-white p-3 rounded-lg focus:outline-none"
        />
        <input
          type="email"
          placeholder="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
          id="email"
          className="border-white bg-white p-3 rounded-lg focus:outline-none"
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border-white bg-white p-3 rounded-lg focus:outline-none"
        />
        <button disabled= {loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90 cursor-pointer' >
           Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOutUser} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'Profile Updated Successfully' : ''}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full cursor-pointer">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError ? showListingError : ''}</p>


      {listings && listings.length >0 && 
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {listings.map((listing)=>(
            <div key={listing._id} className="border p-3 rounded-lg flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
              </Link>
              <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold hover:underline truncate flex-1">
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center gap-1">
                <button className="text-red-700 cursor-pointer uppercase hover:opacity-70" onClick={()=> handleDeleteListing(listing._id)}>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 cursor-pointer uppercase hover:opacity-70">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      }

    </div>
  );
}
