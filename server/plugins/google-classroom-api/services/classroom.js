'use strict';
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios')

/**
 * google-classroom-api.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
    async getGoogleClassroomClient(code) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        google.options({ auth: oAuth2Client });

        oAuth2Client.setCredentials({
            access_token: code
         });
        
        const googleClassroom = google.classroom({ version: 'v1', auth: oAuth2Client });

        return await googleClassroom;
    },

    async getCourses(googleClassroom) {
        return await googleClassroom.courses.list({})
    },

  
  async getCourseWork(googleClassroom) {
    return await googleClassroom.courses.courseWork.list({})
  },

  async getSubmissions(googleClassroom, courseId, courseWorkId,) {
    return await googleClassroom.courses.courseWork.studentSubmissions.list({
      courseId: courseId,
      courseWorkId: courseWorkId,
    })
  },

  async updateGrade(googleClassroom, courseId, courseWorkId, studentId, updatedSubmissionData) {
    //return await googleClassroom.courses.courseWork.studentSubmissions.patch();

    try {
      const response = await googleClassroom.courses.courseWork.studentSubmissions.patch({
        courseId: courseId,
        courseWorkId: courseWorkId,
        id: studentId,
        updateMask: 'draftGrade,assignedGrade', // Add other fields as needed
        resource: updatedSubmissionData,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

};
