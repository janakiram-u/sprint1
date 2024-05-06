import React from 'react';
import Card from 'react-bootstrap/Card';
import { BASE_URL } from '../../services/helper';
import { NavLink } from 'react-router-dom';
import { statuschangefunc } from "../../services/Apis";
import { ToastContainer, toast } from "react-toastify";
import "./table.css";
import Paginations from '../pagination/Paginations';


const Tables = ({ userdata, deleteUser, userGet, handlePrevious, handleNext, page, pageCount, setPage }) => {

  const handleChange = async (id, status) => {
    const response = await statuschangefunc(id, status);

    if (response.status === 200) {
      userGet();
      toast.success("Status Updated");
    } else {
      toast.error("Error");
    }
  };

  return (
    <div className="container-fluid bg-light py-4 tables-container">
      <div className="row">
        {userdata.length > 0 ? (
          userdata.map((element, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <Card className='shadow' style={{ height: '350px' }}>
             
                <div className="card-img-container" style={{ height: '55%' }}>
                <NavLink to={`/userprofile/${element._id}`} >
                      
                    
                  <img src={`${BASE_URL}/uploads/${element.profile}`} alt="Profile" className="card-img" style={{ height: '100%', objectFit: 'cover' }} />
                  </NavLink> </div>
                <Card.Body style={{ height: '40%' }}>
                  <Card.Subtitle className="mb-3 text-muted"> {element.name}</Card.Subtitle>
                  <Card.Text>
                    <span className="fw-bold">Location:</span> {element.location}
                    <br />
                    <span className="fw-bold">Price Range:</span> 
                    {element.price === "$" ? "$" : 
                      element.price === "$$" ? "$$" :
                      element.price === "$$$" ? "$$$" : "Unknown"}
                      <br />
                      <span className="fw-bold">Status:</span> {element.status}
                      <br />
                      <span className="fw-bold" style={{color:"grey"}}>Edit:</span>  <NavLink to={`/edit/${element._id}`} style={{color:"yellow"}}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </NavLink> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;

                     <span className="fw-bold" style={{color:"grey"}}>Delete:</span> <span
                      onClick={() => deleteUser(element._id)} style={{color:"orange"}}><i className="fa-solid fa-trash"></i></span>

                  </Card.Text>

                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className='no_data text-center'>NO Data Found</div>
        )}<div className='page'>
        <Paginations
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          page={page}
          pageCount={pageCount}
          setPage={setPage}
        />
        </div>
      </div>
      <ToastContainer />
  
    </div>
  );
};

export default Tables;
