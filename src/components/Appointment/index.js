import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // save a new appointment
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    // make the request to add appointment to api and once succeeds display the appointment information
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => console.log(err));
  }

  function confirm() {
    transition(CONFIRM);
  }
  // deletes existing appointment
  function deleteAppointment() {
    transition(DELETING);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(err => console.log(err));
  }

  // edit an existing appointment
  function edit() {
    transition(EDIT);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
      {mode === SHOW && (
        <Show 
          student={props.interview.student} 
          interviewer={props.interview.interviewer}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={back}
          onConfirm={deleteAppointment}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student} 
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
    </article>
  );

};