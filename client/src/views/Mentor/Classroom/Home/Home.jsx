import React, { useEffect, useState } from 'react';
import './Home.less';
import {
  getClassroom,
  getLessonModule,
  getLessonModuleActivities,
} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import DisplayCodeModal from './DisplayCodeModal';
import MentorActivityDetailModal from './MentorActivityDetailModal';
import LessonModuleModal from './LessonModuleSelect/LessonModuleModal';
import { message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { initializeGapiClient, gisLoaded, gapiLoaded } from '../../../../components/gapiCallbacks';

export default function Home({ classroomId, viewing }) {
  const [classroom, setClassroom] = useState({});
  const [activities, setActivities] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [activeLessonModule, setActiveLessonModule] = useState(null);
    const [activityDetailsVisible, setActivityDetailsVisible] = useState(false)
    const [tokenClient, setTokenClient] = useState({});
  const navigate = useNavigate();

  const SCIENCE = 1;
  const MAKING = 2;
    const COMPUTATION = 3;

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const SCOPES = "https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.announcements";
    const DISCOVERY_DOC = 'https://classroom.googleapis.com/$discovery/rest';

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
                    fetch("https://classroom.googleapis.com/v1/courses/NjM3MTA3NjEzNDky/courseWork/NjM3MTEwOTc4NjI5/studentSubmissions/NjM3MTExMDc5MDkw?updateMask=assignedGrade", {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenResponse.access_token}`
                        },
                        
                        body: JSON.stringify({ "assignedGrade": 90 })
                    })
                    /*fetch("https://classroom.googleapis.com/v1/courses/NjM3MTA3NjEzNDky/courseWork/NjM3MTEwOTc4NjI5/studentSubmissions", {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${tokenResponse.access_token}`
                        },
                    }).then(response => response.json()).then(data => console.log(data));
                    console.log(tokenResponse.access_token);*/
                }
            }
        });

        setTokenClient(tokenClient);
    }, []);

    /*useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOC],
                scope: SCOPES
            })
        }
        gapi.load('client:auth2', start);
    }, [tokenClient]);*/

    /*useEffect(() => {
        initializeGapiClient();
        gapiLoaded();
        gisLoaded();
    }, []);*/

    function sendActivity() {
        //tokenClient.requestAccessToken();
        //listCourses();
        //console.log("Courses should be listed!");
    }

    /**
       * Print the names of the first 10 courses the user has access to. If
       * no courses are found an appropriate message is printed.
       */
    /*async function listCourses() {
        let response;
        try {
            response = await gapi.client.classroom.courses.list({
                pageSize: 10,
            });
        } catch (err) {
            document.getElementById('content').innerText = err.message;
            return;
        }

        const courses = response.result.courses;
        if (!courses || courses.length == 0) {
            document.getElementById('content').innerText = 'No courses found.';
            return;
        }
        // Flatten to string to display
        const output = courses.reduce(
            (str, course) => `${str}${course.name}\n`,
            'Courses:\n');
        document.getElementById('content').innerText = output;
    }*/

  useEffect(() => {
    const fetchData = async () => {
      const res = await getClassroom(classroomId);
      if (res.data) {
        const classroom = res.data;
        setClassroom(classroom);
        setGradeId(classroom.grade.id);
        classroom.selections.forEach(async (selection) => {
          if (selection.current) {
            const lsRes = await getLessonModule(
              selection.lesson_module
            );
            if (lsRes.data) setActiveLessonModule(lsRes.data);
            else {
              message.error(lsRes.err);
            }
            const activityRes = await getLessonModuleActivities(lsRes.data.id);
            if (activityRes) setActivities(activityRes.data);
            else {
              message.error(activityRes.err);
            }
          }
        });
      } else {
        message.error(res.err);
      }
    };
    fetchData();
  }, [classroomId]);

  const handleViewActivity = (activity, name) => {
    activity.lesson_module_name = name;
    localStorage.setItem('sandbox-activity', JSON.stringify(activity));
    navigate('/sandbox');
  };

  const openActivityInWorkspace = (activity, name) => {
    activity.lesson_module_name = name;
    activity.template = activity.activity_template;
    delete activity.id;
    delete activity.activity_template;
    localStorage.setItem('sandbox-activity', JSON.stringify(activity));
    navigate('/sandbox');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const color = [
    'magenta',
    'purple',
    'green',
    'cyan',
    'red',
    'geekblue',
    'volcano',
    'blue',
    'orange',
    'gold',
    'lime',
  ];

  return (
    <div>
      <button id='home-back-btn' onClick={handleBack}>
        <i className='fa fa-arrow-left' aria-hidden='true' />
      </button>
      <DisplayCodeModal code={classroom.code} />
      <MentorSubHeader title={classroom.name}></MentorSubHeader>
      <div id='home-content-container'>
        <div id='active-lesson-module'>
          {activeLessonModule ? (
            <div>
              <div id='active-lesson-module-title-container'>
                <h3>{`Learning Standard - ${activeLessonModule.name}`}</h3>
                <LessonModuleModal
                  setActiveLessonModule={setActiveLessonModule}
                  classroomId={classroomId}
                  gradeId={gradeId}
                  viewing={viewing}
                  setActivities={setActivities}
                />
              </div>
              <p id='lesson-module-expectations'>{`Expectations: ${activeLessonModule.expectations}`}</p>
             {activeLessonModule.link ? (
                <p>
                  Addtional resources to the lesson:{' '}
                  <a
                    href={activeLessonModule.link}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {activeLessonModule.link}
                  </a>
                </p>
              ) : null}
              {activities ? (
                <div id='card-btn-container' className='flex space-between'>
                  {activities.map((activity) => (
                    <div id="view-activity-card" key={activity.id}>
                      <div id='activity-title'>
                       Activity Level {activity.number}
                       </div>
                      <div id='view-activity-heading' style={{display: "flex"}}>
                        
                        <button
                          id='view-activity-button'
                          style={{marginRight: "auto"}}
                          onClick={() =>
                            handleViewActivity(activity, activeLessonModule.name)
                          }
                        >
                          Student Template
                        </button>
                        {activity.activity_template && (
                          <button
                            id='view-activity-button'
                            style={{marginRight: "auto"}}
                            onClick={() =>
                              openActivityInWorkspace(
                                activity,
                                activeLessonModule.name
                              )
                            }
                          >
                            Demo Template
                                  </button>


                              )}

                              <button onClick={() => sendActivity()}> Send Activities </button>

                        <MentorActivityDetailModal
                          learningStandard={activeLessonModule}
                          selectActivity={activity}
                          activityDetailsVisible={false}
                          setActivityDetailsVisible={false}
                          setActivities={setActivities}
                          viewing={false}
                        />
                      </div>
                      <div id='view-activity-info'>
                        <p>
                          <strong>STANDARDS: </strong>
                          {activity.StandardS}
                        </p>
                        <p>
                          <strong>Description: </strong>
                          {activity.description}
                        </p>
                        <p>
                          <strong>Classroom Materials: </strong>
                          {activity.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type === SCIENCE
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 1) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        <p>
                          <strong>Student Materials: </strong>
                          {activity.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type === MAKING
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 4) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        <p>
                          <strong>Arduino Components: </strong>
                          {activity.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type ===
                                COMPUTATION
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 7) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        {activity.link ? (
                          <p>
                            <strong>Link to Additional Information: </strong>
                            <a href={activity.link} target='_blank' rel='noreferrer'>
                              {activity.link}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <p>There is currently no active lesson set.</p>
              <p>Click the button below to browse available lessons.</p>
              <LessonModuleModal
                setActiveLessonModule={setActiveLessonModule}
                classroomId={classroomId}
                gradeId={gradeId}
                viewing={viewing}
                setActivities={setActivities}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
