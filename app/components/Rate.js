import React from "react";

export default function Rate(props) {
  const name = props.rate.Name;

  const user = props.rate.User;
  const starsGiven = props.rate.Stars;
  const review = props.rate.review;
  return (
    <div className="RateWrapper">
      <div className="ratingOuter">
        <img src={starsGiven >= 1 ? "star-filled.png" : "star-empty.png"}></img>
        <img src={starsGiven >= 2 ? "star-filled.png" : "star-empty.png"}></img>
        <img src={starsGiven >= 3 ? "star-filled.png" : "star-empty.png"}></img>
        <img src={starsGiven >= 4 ? "star-filled.png" : "star-empty.png"}></img>
        <img src={starsGiven >= 5 ? "star-filled.png" : "star-empty.png"}></img>
      </div>
      <p className="User">{name.trim() ? name : user}</p>
      <p>{review}</p>
    </div>
  );
}
