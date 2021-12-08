import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  // Creates a InterviewerListItem component for each interviewer from the list of interviewers
  const interviewerListItemsArray = props.interviewers.map((currInterviewer) => {
    return (
      <InterviewerListItem
        key={currInterviewer.id}
        id={currInterviewer.id}
        name={currInterviewer.name}
        avatar={currInterviewer.avatar}
        selected={props.interviewer === currInterviewer.id}
        setInterviewer={props.setInterviewer}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerListItemsArray}
      </ul>
    </section>
  );
};