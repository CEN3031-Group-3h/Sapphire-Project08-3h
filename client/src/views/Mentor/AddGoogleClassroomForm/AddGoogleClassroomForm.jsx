import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../Utils/requests';
import { message } from 'antd';
import './AddGoogleClassroomForm.less';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate, useLocation } from 'react-router-dom';

// Google Api Imports
import { googleAddClassroom, googleGetClassroom, googleGetClassrooms } from '../../../Utils/googleRequests';
import { googleGetGapiToken } from '../../../Utils/GoogleAuthRequests';

export default function AddGoogleClassroomForm() {
  const [value] = useGlobalState('currUser');
  const location = useLocation();
  const { id, name, enrollmentCode } = location.state;
  const navigate = useNavigate();

  const handleAddClassroom = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const user = JSON.parse(sessionStorage.getItem('user'))

    const classroomObj = {
      name,
      id,
      school: formJson.school,
      grade: formJson.grade,
      enrollmentCode,
      mentorObj: {
        firstName: formJson.firstName,
        lastName: formJson.lastName,
        school: formJson.school,
        user: user.id
      }
    }
    
    console.log(classroomObj)

    googleAddClassroom(id, classroomObj).then(res => {
      console.log(res);
      navigate('/dashboard')
      message.success('Classroom added');
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Welcome {value.name}</div>
      <MentorSubHeader title={`Add ${name}`}></MentorSubHeader>
      <div id='classrooms-container'>
        <form id='add-classroom-form' method='post' onSubmit={handleAddClassroom}>
          <label>
            First Name: <input name="firstName" defaultValue="Kaniel" />
          </label>
          <label>
            Last Name: <input name="lastName" defaultValue="Vicencio" />
          </label>
          <label>
            School: <input name="school" defaultValue="1" />
          </label>
          <label>
            Grade: <input name="grade" defaultValue="4" />
          </label>
          <button id='add-classroom-form-button' type='submit'>Add Classroom</button>
        </form>
      </div>
    </div>
  )

}

