// UpdateSubmissionButton.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../Utils/hosts';
import { googleGetGapiToken } from '../Utils/GoogleAuthRequests';
import { googleGetStudentSubmissions, googleGetCourseWork, googleGetCourseWorkList} from '../Utils/googleRequests';

const UpdateSubmissionButton = ({ classroomid, activity }) => {
    const [response, setResponse] = useState(null);

    const handleUpdateSubmission = async () => {
        try {
            // Assuming you have the `code` needed for authorization
            // const url = new URL(`${server}/google-classroom-api/courses/${courseId}/${courseWorkId}/${studentId}`);
            // url.searchParams.append('code', googleGetGapiToken());

            // // Make a request to your Strapi API to update the submission
            // const response = await axios.patch(url,
            //     {
            //         draftGrade: 90,
            //         assignedGrade: 95,
            //         // ... other fields
            //     }
            // );
            console.log(activity)

            const classrooms = await googleGetStudentSubmissions(classroomid, activity);
            console.log(classrooms)

            // Handle the response
        } catch (error) {
            console.error('Error updating submission:', error);
        }
          
    };

    return (
        <div>
            <button onClick={handleUpdateSubmission}>Update Submission</button>

            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default UpdateSubmissionButton;

