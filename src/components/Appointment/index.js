import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  /**
   * Function which is called when a user enters details to book a new interview
   * @param {string} name- The name of the student
   * @param {number} interviewer - The id of the interviewer
   */
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    /* pass the form details to useApplicationData hook to process and save details */
    props.bookInterview(props.id, interview, mode)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
  }
  /** 
   * Function which displays the Confirm component
   */
  function confirm() {
    transition(CONFIRM);
  }

  /**
   * Function which deletes an existed appointment from the scheduler
   */
  function deleteAppointment() {
    transition(DELETING, true);
    /* pass the form details to useApplicationData hook to process deletion */
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE, true));
  }

  /**
   * Renders the Edit component upon clicking the edit button
   */
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
          message="Are you sure you would like to delete?"
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
      {mode === ERROR_SAVE && (
        <Error
          message="Unable to save appointment"
          onClose={back}
        />
        )}
      {mode === ERROR_DELETE && (
        <Error
          message="Unable to delete appointment"
          onClose={back}
        />
      )}
    </article>
  );

};