import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import './AssignmentUpload.less';
import googleClassroom from './google_classroom_32x32_yellow_stroke_icon.png';
import { sendAssignment } from '../../../Utils/googleRequests';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate, useLocation } from 'react-router-dom';



const AssignmentUpload = ({ classroomid, activity }) => {
  //const { id, name, enrollmentCode } = location.state;


  const handleCallback = async () => {

    sendAssignment(classroomid, activity).then(res => {
      const { assignmentExists } = res.data
      if (assignmentExists) {
        message.info("Assignment already exists in Google Classroom")
      }
      else {
        message.success('Assignment uploaded to Google Classroom');
      }
    }).catch(err => {
      message.console.error('Failed to upload assignment to Google Classroom');
      console.log(err)
    })
  }

  return (
    <div>
      <script src="https://apis.google.com/js/client.js"></script>
      <button id='google-classroom' onClick={handleCallback}><img src={googleClassroom} /></button>
    </div>
  );
};
export default AssignmentUpload;