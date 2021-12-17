import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  
  /**
   * Function which formats the text to be displayed for the number of interview spots remaining per day
   * @param {number} spots 
   * @returns string of spots remaining to be displayed
   */
  function formatSpots(spots) {
    if (spots > 1) {
      return `${spots} spots remaining`;
    } else if (spots === 0) {
      return `no spots remaining`;
    }
    return `1 spot remaining`;
  }
  const dayClass = classNames(
    "day-list__item",
    {"day-list__item--selected": props.selected},
    {"day-list__item--full": props.spots === 0}
  );
  
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}