
/**
 * Helper function which finds the appointment information for a day
 * @param {Object []} days - array of day objects
 * @param {string} dayToFind - string representing the day to be matched
 * @returns array of appointmentes for that day
 */
const getAppointments = function(days, dayToFind) {
  let appointments = [];
  for (const day of days) {
    if (day.name === dayToFind) {
      appointments = day.appointments;
    }
  }
  return appointments;
};

/**
 * Function which filters through the days object and returns the list of appointments for the specified day
 * @param {Object} state - state object which contains the information to be parsed 
 * @param {string} day - string representation of the currently selected day 
 * @returns the formatted appointments for a specified day
 */
const getAppointmentsForDay = function(state, day) {
  const appointments = getAppointments(state.days, day); // call helper to get appointments array

  /* return empty array if no appointments for that day */
  if (!appointments || appointments.length === 0) {
    return [];
  }
  return appointments.map(appointmentId => state.appointments[appointmentId]); // map each appointment id with object in state.appointments
};

/**
 * Function which returns the complete interview object with student and interviewer data
 * @param {Object} state - state object which contains the information to be parsed 
 * @param {Object} interview - Object containing the interview details
 * @returns the updated interview object
 */
const getInterview= function(state, interview) {
  if (!interview) {
    return null;
  }
  
  const interviewerInfo = state.interviewers[interview.interviewer];
  return {
    ...interview,
    interviewer: interviewerInfo
  };
};

/**
 * Helper function which filters thorught the days array and finds interviewer information for that day
 * @param {Object []} days - array of day objects
 * @param {string} dayToFind - string representing the day to be matched
 * @returns array of interviewers for that day
 */
const getInterviewers = function(days, dayToFind) {
  let interviewers = [];
  for (const day of days) {
    if (day.name === dayToFind) {
      interviewers = day.interviewers;
    }
  }
  return interviewers;
};

/**
 * Function which filters through the days object and returns the list of interviewers for the specified day
 * @param {Object} state - state object which contains the information to be parsed 
 * @param {string} day - string representation of the currently selected day 
 * @returns the formatted interviewers for a specified day
 */
const getInterviewersForDay = function(state, day) {

  const interviewersForDay = getInterviewers(state.days, day); // get the list of interviewer ids

  if (!interviewersForDay || interviewersForDay.length === 0) {
    return [];
  }

  return interviewersForDay.map(id => state.interviewers[id]);
};

export { getAppointmentsForDay, getInterview, getInterviewersForDay };