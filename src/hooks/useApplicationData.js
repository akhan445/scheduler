import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Helper function which returns the updated days array after add or delete
 * @param {Object} state - state object which contains the information to be parsed 
 * @param {boolean} isAdd - represents whether the user is performing the add or delete operation
 * @returns days array with the updates spots remaining value
 */
const updateDays = function(state, isAdd) {
  
  const val = isAdd ? -1 : 1; // set the value to -1 if adding a new interview and +1 if deleting an existing interview
  
  const index = state.days.findIndex(item => item.name === state.day); // finds the index value of current day object in the days array
  
  /* update the days array by incrementing/decrementing the spots remaining */
  const newDay = {
    ...state.days[index],
    spots: state.days[index].spots + val
  }
  const newDays = [...state.days];
  newDays.splice(index, 1, newDay); // replace the old day value with the new one

  return newDays;
}

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  /**
   * Function which changes the state of the current day
   * @param {string} day - the new value of the day property in state
   * @returns callback function to be called when setDay is invoked
   */
  const setDay = day => setState({...state, day});

  /*  Makes multiple get requests to get the information from the api server and update the state */
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  /**
   * add new appointment, mode is passed from Appointment to add an additional check so spots is not updated when user is editting an existing interview slot
   * @param {number} id - id of the appointment 
   * @param {Object} interview - Object containing the interview details
   * @param {string} mode - representing the string value of the current mode
   * @returns promise object which contains the appropriate response receive after axios request
   */
  function bookInterview(id, interview, mode) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        /* call the helper function to return an updated versiond of the days array, only change it if the mode is CREATE */
        const newDays = mode === "CREATE" ? updateDays(state, true) : [...state.days]; 
        
        setState({
            ...state,
            days: newDays,
            appointments
        });
      });
  }

  /**
   * Function called to delete an existing appointment
   * @param {number} id - representing the appointment id 
   * @returns promise object which contains the appropriate response receive after axios request
   */
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id] : appointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const newDays = updateDays(state, false); // call the helper function to return an updated versiond of the days array
        
        setState({
          ...state,
          days: newDays,
          appointments
        });
      });
  }
  
  return { state, setDay, bookInterview, cancelInterview };
}

