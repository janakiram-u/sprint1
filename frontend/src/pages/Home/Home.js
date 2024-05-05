// Home.js

import React, { useContext, useState, useEffect } from 'react';
import { Button, FormControl, RadioGroup, Radio, FormControlLabel, Alert, TextField } from '@mui/material';
import { Menu as MenuIcon, PlusOne as PlusIcon, Search as SearchIcon, CloudUpload as UploadIcon, FilterList as FilterIcon, Sort as SortIcon, AddBox } from '@mui/icons-material'; // Import Material-UI icons
import { useNavigate } from 'react-router-dom';
import { addData, dltdata, updateData } from '../../components/context/ContextProvider';
import { usergetfunc, deletfunc, exporttocsvfunc, importcsvfunc } from '../../services/Apis';
import Tables from '../../components/Tables/Tables';
import Spiner from "../../components/Spiner/Spiner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './home.css'; // Import custom CSS for styling

const Menu = ({ setSort, setPrice, setStatus, adduser, exportuser, importuser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`menu-options ${isMenuOpen ? 'show' : ''}`}>
      <div onClick={toggleMenu}></div>
    
      
        <div className='title'>
       <MenuIcon></MenuIcon> &nbsp; Actions
        </div>
        <div className='operations'>
        <div className="operation">
          
        
        <span onClick={adduser}>
          {' '}
          <AddBox />&nbsp; Add Restaurant
        </span>
      </div>
      <div className="operation">
        <UploadIcon /> &nbsp;<span onClick={exportuser}>Export CSV</span>
        <br />
      </div>
      </div>
      <div className="sort_by_time operations">
        <div className="sort titles">
          <SortIcon /> &nbsp;Sort by time
          <div className='radios'>
          <FormControl component="fieldset" >
            <RadioGroup aria-label="sort" name="sort" defaultValue="new">
              <FormControlLabel
                value="new"
                control={<Radio />}
                label="New"
                onClick={() => setSort('new')}
              />
              <FormControlLabel
                value="old"
                control={<Radio />}
                label="Old"
                onClick={() => setSort('old')}
              />
            </RadioGroup>
          </FormControl>
          </div>
        </div>
      </div>
      <div className="filter_price operations">
        <div className="filter titles">
          <FilterIcon /> &nbsp; Filter By Price
          <div className="price radios">
            <FormControl component="fieldset">
              <RadioGroup aria-label="price" name="price" defaultValue="All" onChange={(e) => setPrice(e.target.value)}>
                <FormControlLabel value="All" control={<Radio />} label="All" />
                <FormControlLabel value="$" control={<Radio />} label="$" />
                <FormControlLabel value="$$" control={<Radio />} label="$$" />
                <FormControlLabel value="$$$" control={<Radio />} label="$$$" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="filter_status operations">
        <div className="status titles">
          <FilterIcon />&nbsp; Filter By Status
          <div className="status_radio radios">
            <FormControl component="fieldset">
              <RadioGroup aria-label="status" name="status" defaultValue="All" onChange={(e) => setStatus(e.target.value)}>
                <FormControlLabel value="All" control={<Radio />} label="All" />
                <FormControlLabel value="Active" control={<Radio />} label="Active" />
                <FormControlLabel value="InActive" control={<Radio />} label="InActive" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [userdata, setUserData] = useState([]);
  const [showspin, setShowSpin] = useState(true);
  const [search, setSearch] = useState('');
  const [price, setPrice] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const { useradd, setUseradd } = useContext(addData);
  const { update, setUpdate } = useContext(updateData);
  const { deletedata, setDLtdata } = useContext(dltdata);

  const navigate = useNavigate();

  const adduser = () => {
    navigate('/register');
  };

  const userGet = async () => {
    const response = await usergetfunc(search, price, status, sort, page);
    if (response.status === 200) {
      setUserData(response.data.usersdata);
      setPageCount(response.data.Pagination.pageCount);
    } else {
      console.log('error for get user data');
    }
  };

  const deleteUser = async (id) => {
    const response = await deletfunc(id);
    if (response.status === 200) {
      userGet();
      setDLtdata(response.data);
    } else {
      toast.error('error');
    }
  };

  const exportuser = async () => {
    const response = await exporttocsvfunc();
    if (response.status === 200) {
      window.open(response.data.downloadUrl, 'blank');
    } else {
      toast.error('error !');
    }
  };

  const importuser = async () => {
    const response = await importcsvfunc();
    if (response.status === 200) {
      toast.success('CSV file imported successfully');
      userGet();
    } else {
      toast.error('Error importing CSV file');
    }
  };

  const handlePrevious = () => {
    setPage(() => {
      if (page === 1) return page;
      return page - 1;
    });
  };

  const handleNext = () => {
    setPage(() => {
      if (page === pageCount) return page;
      return page + 1;
    });
  };

  useEffect(() => {
    userGet();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [search, price, status, sort, page]);

  return (
    <div className="container">
      <div className="menu-container">
        <Menu
          setSort={setSort}
          setPrice={setPrice}
          setStatus={setStatus}
          adduser={adduser}
          exportuser={exportuser}
          importuser={importuser}
        />
      </div>
      <div className="table-container">
        {useradd ? (
          <Alert severity="success" onClose={() => setUseradd('')} dismissible>
            {useradd.name.toUpperCase()} Successfully Added
          </Alert>
        ) : null}
        {update ? (
          <Alert severity="info" onClose={() => setUpdate('')} dismissible>
            {update.name.toUpperCase()} Successfully Updated
          </Alert>
        ) : null}
        {deletedata ? (
          <Alert severity="error" onClose={() => setDLtdata('')} dismissible>
            {deletedata.name.toUpperCase()} Successfully Deleted
          </Alert>
        ) : null}
        <div className="d-flex bcol">
          <div className='restaurant'>Restaurants</div>
          <div className="searchdesign">
            <div className="search">
              <form className="d-flex">
                <TextField
                  type="search"
                  placeholder="Find your Restaurant here..."
                  className="custom-input"
                  aria-label="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="search-icon custom-btn">
                  <span className="input-group-text bg-transparent border-0">
                    <SearchIcon />
                  </span>
                </Button>
              </form>
              <br />
            </div>
          </div>
        </div>
      
        {showspin ? (
          <Spiner />
        ) : (
          <Tables
            userdata={userdata}
            deleteUser={deleteUser}
            userGet={userGet}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            page={page}
            pageCount={pageCount}
            setPage={setPage}
          />
        )}
      </div>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
};

export default Home;
