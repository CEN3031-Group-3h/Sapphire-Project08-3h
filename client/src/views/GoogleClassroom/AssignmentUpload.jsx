import React, { useState, useEffect } from 'react';
import './AssignmentUpload.less';
import googleClassroom from '../../../google_classroom_32x32_yellow_stroke_icon.png';
import {sendAssignment} from '../../Utils/GoogleClassroomRequests';


const AssignmentUpload = () =>{

    const handleCallback = async () => {
        const url = await sendAssignment()
        //console.log(url.data.url)
        //console.log(window.location.replace(url.data.url))
      }
    
    return (
        <div>
            <script src="https://apis.google.com/js/client.js"></script>
            <button className='google-classroom' onClick={handleCallback}><img src={googleClassroom} /></button>
        </div>
     );
};
export default AssignmentUpload;