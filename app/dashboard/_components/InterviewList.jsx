"use client";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard"

const InterviewList = ({ currentUser }) => {
  const [InterviewList, setInterviewList] = useState([]);
  useEffect(() => {
    currentUser?.email && GetInterviewList();
  }, [currentUser]);
  const GetInterviewList = async () => {
    const response = await fetch(`/api/interviews?email=${encodeURIComponent(currentUser.email)}`);
    const data = await response.json();
    setInterviewList(data.interviews || []);
  };
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {InterviewList&&InterviewList.map((interview,index)=>(
            <InterviewItemCard interview={interview} currentUser={currentUser} key={index}/>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;