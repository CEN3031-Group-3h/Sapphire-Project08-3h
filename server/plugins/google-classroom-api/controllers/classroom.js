'use strict';

/**
 * google-classroom-api.js controller
 *
 * @description: A set of functions called "actions" of the `google-classroom-api` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  list: async (ctx) => {
    const code = ctx.request.query.code

    const googleClassroomClient = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getGoogleClassroomClient(code);

    const courses = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getCourses(googleClassroomClient);

    ctx.send({
      message: 'ok',
      courses: courses.data.courses
    });
  },

  get: async (ctx) => {
    const code = ctx.request.query.code;
    const id = ctx.params.id;

    const googleClassroomClient = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getGoogleClassroomClient(code);

    const course = await googleClassroomClient.courses.get({
      id
    })
    console.log(course)
    ctx.send({
      message: 'ok',
      course: course.data
    })
  },

  create: async (ctx) => {
    const { name, id, enrollmentCode, mentorObj } = ctx.request.body;
    ctx.request.body.code = enrollmentCode;

    // Set mentor body
    ctx.request.body.first_name = mentorObj.firstName;
    ctx.request.body.last_name = mentorObj.lastName;
    ctx.request.body.user = mentorObj.user;
    console.log(ctx.request.body)

    try {
      // Store id in database

      // Check if classroom exists
      let classroom = await strapi.query('classroom').findOne({name: name})
      const classroomExists = classroom !== null;
      if(classroomExists) {
        ctx.badRequest("Classroom exists");
      }

      // Add students to roster
      classroom = await strapi.services.classroom.create(ctx.request.body)
      ctx.request.body.classrooms = [classroom]

      const googleClassroomObj = {
        name: name,
        classroom: classroom.id,
        google_classroom_id: id
      }

      const googleClassroom = await strapi.services['google-classroom'].create(googleClassroomObj)


      // Assign user as mentor
      let mentor = await strapi.query('mentor').findOne({ user: mentorObj.user });
      const mentorExist = mentor !== null;
      if (!mentorExist) {
        mentor = await strapi.services.mentor.create(ctx.request.body)
      }
      else {
        const mentorClassrooms = mentor.classrooms;
        mentorClassrooms.push(classroom);
        console.log(mentorClassrooms)
        await strapi.query('mentor').update({id: mentor.id}, {classrooms: mentorClassrooms});
      }




      ctx.send({
        message: 'ok',
        // body: sanitizeEntity(classroom, { model: strapi.models.classroom })
      })
    }
    catch (err) {
      console.log(err)
    }
    // return sanitizeEntity(classroom, { model: strapi.models.classroom });

  },

  // Course Work Routes
  courseWorkList: async (ctx) => {
    const code = ctx.request.query.code;
    const id = ctx.params.courseId;
    console.log(id)

    const googleClassroomClient = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getGoogleClassroomClient(code);

    const course = await googleClassroomClient.courses.courseWork.list({
      courseId: id
    })
    console.log(course)
    ctx.send({
      message: 'ok',
      course: course.data
    })
  },

  courseWork: async(ctx) => {
    const code = ctx.request.query.code;

    const { courseId, id } = ctx.params;

    console.log(courseWorkId)

    const googleClassroomClient = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getGoogleClassroomClient(code);

    const course = await googleClassroomClient.courses.courseWork.get({
      courseId: courseId,
      id
    })
    console.log(course)
    ctx.send({
      message: 'ok',
      course: course.data
    })
  }, 
    
  upload: async(ctx) =>{
    const strapi_id = ctx.params.id;
    const activity = ctx.request.body;
    const code = ctx.request.query.code;
    
    let googleclassroom = await strapi.query('google-classroom').findOne({classroom: strapi_id });
    const google_classroom_id = googleclassroom.google_classroom_id

    console.log(google_classroom_id)
    const googleClassroomClient = await strapi
    .plugins['google-classroom-api']
    .services.classroom
    .getGoogleClassroomClient(code);

    let response = await googleClassroomClient.courses.topics.list({courseId: google_classroom_id});

    var topics_id;
    let topics = response.data.topic.filter((topic) => topic.name === activity.lesson_module.name);
    const topicExists = Object.entries(topics).length > 0;
    if(!topicExists){
      const topic = {
        name: activity.lesson_module.name
      }
      topics = await googleClassroomClient.courses.topics.create({courseId: google_classroom_id, requestBody: topic});
      topics_id = topics.data.topicId
    }else{
      topics_id = topics[0].topicId;
    }

    const title = "Activity Level " + activity.number;
    const assignmentResponse = await googleClassroomClient.courses.courseWork.list({courseId: google_classroom_id});
    let assignments = assignmentResponse.data.courseWork.filter((courseWork) => (courseWork.title === title && courseWork.topicId === topics_id));
    const assignmentExist = Object.entries(assignments).length > 0;

    if(assignmentExist){
      ctx.send({
        message: 'ok',
        assignmentExists: true
      })
      return;
    }

    const assignment = {
      title: title,
      description: activity.description,
      topicId: topics_id,
      state: "PUBLISHED",
      workType: "ASSIGNMENT"
    }
    const assignmentUpload = await googleClassroomClient.courses.courseWork.create({courseId: google_classroom_id, requestBody: assignment});
    console.log(assignmentUpload)
    ctx.send({
      message: 'ok',
      assignment: assignmentUpload.data
    })

  }
};
