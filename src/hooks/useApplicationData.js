import { useState, useEffect } from "react";
import axios from "axios";

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

  // add new appointment
  function bookInterview(id, interview) {
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
        //find the index value of current day object
        const index = state.days.findIndex(item => item.name === state.day);
        //update the days array
        const newDay = {
          ...state.days[index],
          spots: state.days[index].spots - 1
        }
        const newDays = [...state.days];
        newDays.splice(index, 1, newDay);

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
        //find the index value of current day object
        const index = state.days.findIndex(item => item.name === state.day);
        //update the days array
        const newDay = {
          ...state.days[index],
          spots: state.days[index].spots + 1
        }
        const newDays = [...state.days];
        newDays.splice(index, 1, newDay);
        
        setState({
          ...state,
          days: newDays,
          appointments
        });
      });
  }
  
  return { state, setDay, bookInterview, cancelInterview };
}

