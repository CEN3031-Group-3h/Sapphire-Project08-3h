import {React, useEffect, useState} from 'react';
import { Tabs } from 'antd';
import './Classroom.less';
import { jwtDecode } from "jwt-decode";
import NavBar from '../../../components/NavBar/NavBar';
import Roster from './Roster/Roster';
import Home from './Home/Home';
import SavedWorkSpaceTab from '../../../components/Tabs/SavedWorkspaceTab';
import { useSearchParams, useParams } from 'react-router-dom';

const { TabPane } = Tabs;

export default function Classroom({
  handleLogout,
  selectedActivity,
  setSelectedActivity,
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [tokenClient, setTokenClient] = useState({});

  const { id } = useParams();
  const tab = searchParams.get('tab');
    const viewing = searchParams.get('viewing');

    const newGrades = {
        userId: 'NjM3MTExMDc5MDkw',
        grade: 95,  // Set the new grade value
        draftGrade: 95,  // If you're using draft grades
    };

    const CLIENT_ID = '837981329487-0hqkf7h3i5d55co41do68n034jde5c0d.apps.googleusercontent.com';
    const SCOPES = "https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.announcements";

    // tokenClient
    /*setTokenClient(
        google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
                console.log(tokenResponse);
                // We now have access to a live token for ANY google API
            }
        })
    );*/

    useEffect(() => {
        // tokenClient
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
                console.log(tokenResponse);
                // We now have access to a live token for ANY google API
                if (tokenResponse && tokenResponse.access_token) {
                    // talking with HTTP
                    fetch("https://classroom.googleapis.com/v1/courses/NjM3MTA3NjEzNDky/courseWork/NjM3MTEwOTc4NjI5/studentSubmissions/NjM3MTExMDc5MDkw", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ${tokenResponse.access_token}'
                        },
                        body: JSON.stringify({"name": "Testers class things"})
                    })
                }
            }
        });

        setTokenClient(tokenClient);
    }, []);

    

    /*const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            console.log("Callback is invoked!");
            if (tokenResponse && tokenResponse.access_token) {
                setAccessToken(tokenResponse.access_token);

                /*function start() {
                    // 2. Initialize the JavaScript client library.
                    gapi.client.init({
                        'apiKey': API_KEY,
                        // clientId and scope are optional if auth is not required.
                        'clientId': CLIENT_ID,
                        'scope': SCOPES,
                    }).then(function () {
                        // 3. Initialize and make the API request.
                        return gapi.client.request({
                            'path': 'https://people.googleapis.com/v1/courses',
                        })
                    }).then(function (response) {
                        console.log(response.result);
                    }, function (reason) {
                        console.log('Error: ' + reason.result.error.message);
                    });
                };
                // 1. Load the JavaScript client library.
                gapi.load('client', start);

                if (google.accounts.oauth2.hasGrantedAnyScope(tokenResponse, SCOPES)) {
                    gapi.client.setApiKey(API_KEY);
                    gapi.client.load('classroom', 'v1', sendGrades);
                    console.log("GAPI is loaded!");
                }
            }
        },
    });*/

  useEffect(() => {
    sessionStorage.setItem('classroomId', id);

  }, [id]);

    function sendGrades() {
        tokenClient.requestAccessToken();
        /*if (gapi && gapi.auth) {
            const auth = gapi.auth.getToken();
            if (auth.isSignedIn.get()) {
                // Make an API request to update the student's grades for the assignment
                gapi.client.classroom.courses.courseWork.studentSubmissions.modifyAttachments({
                    courseId: 'NjM3MTA3NjEzNDky',  // Replace with your course ID
                    courseWorkId: 'NjM3MTEwOTc4NjI5',
                    id: 'NjM3MTExMDc5MDkw',
                }, newGrades).then(function (response) {
                    // Handle the API response, check if the grades were updated successfully
                    console.log('Grades updated:', response.result);
                });
            } else {
                console.log('Not signed in!');
            }
        } else {
            console.log('gapi or gapi.auth is not initialized');
        }
        //console.log(gapi.auth.getToken().access_token);*/
    }

    function handleCallbackResponse(res) {
        console.log("Encoded JWT ID token: " + res.credential);
        var userObject = jwtDecode(res.credential);
        console.log(userObject);
        //client.requestAccessToken();
    }

    function handleSignIn(res) {
        console.log("handSignIn is called!");
        client.requestAccessToken();
    }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        );
    }, []);

  return (
    <div className='container nav-padding'>
      <NavBar isMentor={true} />
      <Tabs
        defaultActiveKey={tab ? tab : 'home'}
        onChange={(key) => setSearchParams({ tab: key })}
      >
        <TabPane tab='Home' key='home'>
          <Home
            classroomId={parseInt(id)}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            viewing={viewing}
          />
        </TabPane>
        <TabPane tab='Roster' key='roster'>
          <Roster handleLogout={handleLogout} classroomId={id} />
        </TabPane>
        <TabPane tab='Saved Workspaces' key='workspace'>
          <SavedWorkSpaceTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            classroomId={id}
          />
              </TabPane>

              <TabPane tab='Send Grades' key='grades'>
                  <div>
                      <button onClick={() => sendGrades()}> Send Grades </button>
                      
                      {isSignedIn ? (
                          <div>
                              <button onClick={() => setIsSignedIn(false)}>Sign Out</button>
                              {console.log(accessToken)}
                              {accessToken && (
                                  <div>
                                      <p>Access Token: {accessToken}</p>
                                      {/* Use the accessToken for making API requests */}
                                  </div>
                              )}
                          </div>
                      ) : (
                          <div>
                              <h2>New sign in below</h2>
                                  <div id="signInDiv" onClick={handleSignIn}> </div>
                                  
                          </div>
                      )}
                  </div>
              </TabPane>
      </Tabs>
    </div>
  );
}
