import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import Spiner from '../../components/Spiner/Spiner';
import { singleUsergetfunc } from '../../services/Apis';
import { BASE_URL } from '../../services/helper';
import moment from 'moment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './profile.css';

const Profile = () => {
  const [userprofile, setUserProfile] = useState({});
  const [showspin, setShowSpin] = useState(true);

  const { id } = useParams();

  const userProfileGet = async () => {
    const response = await singleUsergetfunc(id);

    if (response.status === 200) {
      setUserProfile(response.data);
    } else {
      console.log('error');
    }
  };

  useEffect(() => {
    userProfileGet();
    console.log('User ID:', id);
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [id]);

  return (
    <>
      {showspin ? (
        <Spiner />
      ) : (
        <div className="contain">
          <Card className="card-profile shadow design">
            <div className="image-container">
              <img src={`${BASE_URL}/uploads/${userprofile.profile}`} alt="" className="profile-image" />
            </div>
            <CardContent>
              <div className="details-row">
                <div className="detail-item">
                  <Typography variant="h3">Name:</Typography>
                  <Typography variant="h4">{userprofile.name}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="h3">Category:</Typography>
                  <Typography variant="h4">{userprofile.category}</Typography>
                </div>
              </div>
              <div className="details-row">
                <div className="detail-item">
                  <Typography variant="h3">
                    <LocationOnIcon /> Location:
                  </Typography>
                  <Typography variant="h4">{userprofile.location}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="h3">Price Range:</Typography>
                  <Typography variant="h4">{userprofile.price}</Typography>
                </div>
              </div>
              <div className="details-row">
                <div className="detail-item">
                  <Typography variant="h3">
                    <EmailIcon /> Email:
                  </Typography>
                  <Typography variant="h4">{userprofile.email}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="h3">
                    <PhoneIcon /> Mobile:
                  </Typography>
                  <Typography variant="h4">{userprofile.mobile}</Typography>
                </div>
              </div>
              <div className="details-row">
                <div className="detail-item">
                  <Typography variant="h3">Status:</Typography>
                  <Typography variant="h4">{userprofile.status}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="h3">
                    <CalendarTodayIcon /> Date Created:
                  </Typography>
                  <Typography variant="h4">{moment(userprofile.datecreated).format('DD-MM-YYYY')}</Typography>
                </div>
              </div>
              <div className="details-row">
                <div className="detail-item">
                  <Typography variant="h3">
                    <CalendarTodayIcon /> Date Updated:
                  </Typography>
                  <Typography variant="h4">{userprofile.dateUpdated}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
