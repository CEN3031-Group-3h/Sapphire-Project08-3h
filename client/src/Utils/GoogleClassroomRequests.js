import { server } from './hosts';
import { setUserState, getCurrUser } from './userState';

import axios from 'axios';

export const sendAssignment = async () => {
    console.log("Ok");
    const url = await axios.get(`${server}/google-auth-provider/googleClassroomAssignmentUpload`);
    return url;
}