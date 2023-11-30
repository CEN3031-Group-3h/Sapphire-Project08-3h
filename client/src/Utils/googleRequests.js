import { server } from './hosts';
import { setUserState, getCurrUser } from './userState';

import axios from 'axios';

const makeGoogleRequest = async ({ method, path, data, auth = false, error }) => {
    let res = null;
    let err = null;
    const config = auth
      ? {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      : null;
  
    try {
      switch (method) {
        case GET:
          res = (await axios.get(path, config)).data;
          break;
        case POST:
          res = (await axios.post(path, data, config)).data;
          break;
        case PUT:
          res = (await axios.put(path, data, config)).data;
          break;
        case DELETE:
          res = (await axios.delete(path, config)).data;
          break;
        default:
          throw Error('Invalid method.');
      }
    } catch (e) {
      console.error(e);
      err = error ? error : 'An error occurred.';
    }
  
    return { data: res, err: err };
  };

const googleGetCourses() 