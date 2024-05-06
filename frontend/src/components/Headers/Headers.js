import React from 'react';
import { AppBar, Container, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUtensils } from 'react-icons/fa';
import finddubai from '../../Assests/finddubai.jpg'; 
import './header.css'; 

const Headers = () => {
  return (
    <AppBar position="fixed" color="inherit" sx={{ zIndex: 1000 }} style={{backgroundColor:"mintcream"}}>
      <Container >
        <Toolbar>
          <NavLink to="/" style={{ textDecoration: 'none', marginRight: 'auto' }}>
            <img src={finddubai} alt="FindDubai" style={{ width: '80px' }} className="logo-img" />
          </NavLink>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'black' }}>
            
          </Typography>
          <Button component={NavLink} to="/" color="inherit" variant="text" sx={{ textTransform: 'none', fontSize: '18px' }}>
            <FaHome style={{ marginRight: '8px', fontSize: '24px' }} /> Home
          </Button>
          <Button component={NavLink} to="/about" color="inherit" variant="text" sx={{ textTransform: 'none' , fontSize: '18px'}}>
            About
          </Button>
          <Button component={NavLink} to="/contact" color="inherit" variant="text" sx={{ textTransform: 'none', fontSize: '18px' }}>
            Contact
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Headers;
