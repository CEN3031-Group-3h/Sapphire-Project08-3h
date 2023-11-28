
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.announcements";
const DISCOVERY_DOC = 'https://classroom.googleapis.com/$discovery/rest';
let tokenClient;

export function gapiLoaded() {
  gapi.load('auth2', initializeGapiClient);
}

export async function initializeGapiClient() {
    await new Promise((resolve) => {
        gapi.load('auth2', resolve);
    });
  await gapi.auth2.init({
    apiKey: "AIzaSyBphe4PG3Ee9raSQwjx--xH9e4K2JsVckI",
      discoveryDocs: [DISCOVERY_DOC],
      client_id: CLIENT_ID
  });
  //gapiInited = true;
  //maybeEnableButtons();
}

export function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
      callback: async (tokenResponse) => {
          console.log(tokenResponse);
          // We now have access to a live token for ANY google API
          if (tokenResponse && tokenResponse.access_token) {
              // talking with HTTP
              /*fetch("https://classroom.googleapis.com/v1/courses/NjM3MTA3NjEzNDky/courseWork/NjM3MTEwOTc4NjI5/studentSubmissions/NjM3MTExMDc5MDkw?updateMask=assignedGrade", {
                  method: 'PATCH',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${tokenResponse.access_token}`
                  },
                  
                  body: JSON.stringify({ "assignedGrade": 90 })
              })*/
              /*fetch("https://classroom.googleapis.com/v1/courses/NjM3MTA3NjEzNDky/courseWork/NjM3MTEwOTc4NjI5/studentSubmissions", {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${tokenResponse.access_token}`
                  },
              }).then(response => response.json()).then(data => console.log(data));*/
              console.log(tokenResponse.access_token);
              if (gapi.client.getToken() === null) {
                  // Prompt the user to select a Google Account and ask for consent to share their data
                  // when establishing a new session.
                  tokenClient.requestAccessToken({ prompt: 'consent' });
              } else {
                  // Skip display of account chooser and consent dialog for an existing session.
                  tokenClient.requestAccessToken({ prompt: '' });
              }
          }
      }
  });
  //gisInited = true;
  //maybeEnableButtons();
}
