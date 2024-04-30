import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { FaHome,FaUtensils } from 'react-icons/fa';
import './header.css'; 

const Headers = () => {
  return (
    <Navbar className="custom-navbar"  variant="dark">
      <Container>
    
        <NavLink to="/" className="nav-link home-link">
          <FaHome className="me-1" /> Home
        </NavLink>
     
        <Nav className="justify " >
          <NavLink to="/" className="nav-link restaurants-link">
          RESTAURANTS IN DUBAI
          </NavLink>

        </Nav>
        <FaUtensils style={{  color:'silver', fontSize:'40px'}} /> 
      </Container>
    </Navbar>
  );
};

export default Headers;


