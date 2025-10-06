import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { fetchMilestoneList, fetchMyUser } from "../../features";
import MilestoneView from "../Profile/MilestoneView";
import { useNavigate } from "react-router-dom";

const ProfileNew = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();

  const myUser = useSelector((state: RootState) => state.myUser);
  const milestoneList = useSelector((state: RootState) => state.milestoneList);

  const getData = async () => {
    dispatch(fetchMyUser());
    dispatch(fetchMilestoneList());
  };

  return (
    <div>
      <label htmlFor="">ProfileNew</label>
      <MilestoneView
        navigate={navigate}
        dataUser={myUser?.data}
        dataMilestone={milestoneList?.data}
      />
    </div>
  );
};

export default ProfileNew;
