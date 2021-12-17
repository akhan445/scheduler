import { useState, useEffect } from "react";
import axios from "axios";

// Helper function which returns the updated days array after add or delete
const updateDays = function(state, isAdd) {
  const val = isAdd ? -1 : 1;
  //find the index value of current day object
  const index = state.days.findIndex(item => item.name === state.day);
  //update the days array
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

  // //function which changes the state of the current day
  const setDay = day => setState({...state, day});

  // makes a get request to get the list of days from server
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  // add new appointment, mode is passed from Appointment to add an additional check
  // so spots is not updated when user is editting an existing interview slot
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
        // call the helper function to return an updated versiond of the days array, only change it if the mode is CREATE
        const newDays = mode === "CREATE" ? updateDays(state, true) : [...state.days]; 
        
        setState({
            ...state,
            days: newDays,
            appointments
        });
      });
  }

  // delete an appointment
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
