
// Helper function which filters thorught the days array and returns the appointments for searched day
const getAppointments = function(days, dayToFind) {
  let appointments = [];
  for (const day of days) {
    if (day.name === dayToFind) {
      appointments = day.appointments;
    }
  }
  return appointments;
};

// Function which finds and returns the appointments for a specified day
const getAppointmentsForDay = function(state, day) {
  const appointments = getAppointments(state.days, day); // call helper to get appointments array

  //return empty array if no appointments for that day otherwise get the appointment objects by item and return them
  if (!appointments || appointments.length === 0) {
    return [];
  }
  return appointments.map(appointmentId => state.appointments[appointmentId]); 
};

// Function which returns the complete interview object with student and interviewer data
const getInterview= function(state, interview) {
  if (!interview) {
    return null;
  }
  
  const interviewerInfo = state.interviewers[interview.interviewer];
  return {
    ...interview,
    interviewer: interviewerInfo
  }
};

// Helper function which filters thorught the days array and returns the interviewers for searched day
const getInterviewers = function(days, dayToFind) {
  let interviewers = [];
  for (const day of days) {
    if (day.name === dayToFind) {
      interviewers = day.interviewers;
    }
  }
  return interviewers;
};

// Function which finds and returns the interviewers for a specified day
const getInterviewersForDay = function(state, day) {

  const interviewersForDay = getInterviewers(state.days, day); // get the list of interviewer ids

  if (!interviewersForDay || interviewersForDay.length === 0) {
    return [];
  }

  return interviewersForDay.map(id => state.interviewers[id]);
};

export { getAppointmentsForDay, getInterview, getInterviewersForDay };