import React, { useContext, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, InputLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { updateData } from '../../components/context/ContextProvider';
import { singleUsergetfunc, editfunc } from '../../services/Apis';
import Spiner from '../../components/Spiner/Spiner';
import { CloudUpload, Email, Phone, LocationOn, Category, DriveFileRenameOutline } from '@mui/icons-material'; // Import Material-UI icons
import './edit.css';

const Edit = () => {
  const [inputdata, setInputData] = useState({
    name: '',
    category: '',
    location: '',
    email: '',
    mobile: '',
    price: '',
  });

  const [status, setStatus] = useState('Active');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [showspin, setShowSpin] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { update, setUpdate } = useContext(updateData);

  // setInput Value
  const setInputValue = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value });
  };

  // status set
  const setStatusValue = (e) => {
    setStatus(e.target.value);
  };

  // profile set
  const setProfile = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };
  


  const userProfileGet = async () => {
    const response = await singleUsergetfunc(id);

    if (response.status === 200) {
      setInputData(response.data);
      setStatus(response.data.status);
      setPreview(response.data.profile);
    } else {
      console.log('error');
    }
  };

  const submitUserData = async (e) => {
    e.preventDefault();

    const { name, category, location, mobile, email, price } = inputdata;

    if (name === '' || location === '' || email === '' || mobile === '' || price === '' || status === '' || image === null) {
      toast.error('All fields are required!');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('category', category);
    data.append('location', location);
    data.append('email', email);
    data.append('mobile', mobile);
    data.append('price', price);
    data.append('status', status);
    data.append('user_profile', image);

    const config = {
      'Content-Type': 'multipart/form-data',
    };

    try {
      const response = await editfunc(id, data, config);

      if (response.status === 200) {
        setInputData({
          name: '',
          category: '',
          location: '',
          email: '',
          mobile: '',
          price: '',
        });
        setStatus('');
        setImage(null);
        setUpdate(response.data);
        navigate('/');
      } else {
        toast.error('Error!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    userProfileGet();
  }, [id]);

  useEffect(() => {
    if (preview) {
      setPreview(preview);
    } else {
      setPreview('/man.png');
    }
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [preview]);

  return (
    <>
      {showspin ? (
        <Spiner />
      ) : (
        <div className=" containss">
          <h3 className="text-center" >
            Register your Restaurant here...
          </h3>
          <div>
          <Card className="shadow mt-3 p-3 color-card">
          <div className="text-center">
  {preview && (
    <img className="img-fluid" src={preview} alt="Uploaded Image" style={{ maxWidth: '100%', maxHeight: '250px' }} />
  )}
  {!preview && (
    <img className="img-fluid" src="/man.png" alt="add Image" style={{ maxWidth: '100%', maxHeight: '250px' }} />
  )}
</div>
            <form onSubmit={submitUserData}>
              <Stack spacing={2}>
                <Stack spacing={1}> {/* Wrap each field and its label in Stack with spacing */}
                  <InputLabel className="input-container">Name</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    name="name"
                    value={inputdata.name}
                    onChange={setInputValue}
                    placeholder="Enter Name"
                    InputProps={{ startAdornment: <DriveFileRenameOutline /> }} // Icon for Name field
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel>Category</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    name="category"
                    value={inputdata.category}
                    onChange={setInputValue}
                    placeholder="Enter Category"
                    InputProps={{ startAdornment: <Category /> }} // Icon for Category field
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel>Location</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    name="location"
                    value={inputdata.location}
                    onChange={setInputValue}
                    placeholder="Enter Your Location"
                    InputProps={{ startAdornment: <LocationOn /> }} // Icon for Location field
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel>Email address</InputLabel>
                  <TextField
                    fullWidth
                    type="email"
                    name="email"
                    value={inputdata.email}
                    onChange={setInputValue}
                    placeholder="Enter Email"
                    InputProps={{ startAdornment: <Email /> }} // Icon for Email field
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel>Mobile</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    name="mobile"
                    value={inputdata.mobile}
                    onChange={setInputValue}
                    placeholder="Enter Mobile"
                    InputProps={{ startAdornment: <Phone /> }} // Icon for Mobile field
                  />
                </Stack>
               
                <Stack spacing={1}> 
                
  <InputLabel>Select Price Range</InputLabel>
  {/* Wrap the Select component and its label in Stack with appropriate spacing */}
    <Select
    fullWidth
      value={inputdata.price}
      label="Price Range"
      name="price"
      onChange={setInputValue}
    >
      <MenuItem value="$">$</MenuItem>
      <MenuItem value="$$">$$</MenuItem>
      <MenuItem value="$$$">$$$</MenuItem>
    </Select>
    
  </Stack>



  <InputLabel>Select Status</InputLabel>
  <Stack spacing={1}> {/* Wrap the Select component and its label in Stack with appropriate spacing */}
    <Select
    fullWidth
      value={status}
      label="Status"
      name="status"
      onChange={setStatusValue}
    >
      <MenuItem value="Active">Active</MenuItem>
      <MenuItem value="InActive">InActive</MenuItem>
    </Select>
  </Stack>


                <label htmlFor="profile-upload" className="btn btn-primary">
                  <CloudUpload />
                  &nbsp; Add Image
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    name="user_profile"
                    onChange={setProfile}
                    style={{ display: 'none' }}
                  />
                </label>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Stack>
            </form>
          </Card>
          </div>
         
          <ToastContainer position="top-center" />
        </div>
      )}
    </>
  );
};

export default Edit;
