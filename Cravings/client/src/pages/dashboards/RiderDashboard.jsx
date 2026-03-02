import React, { useEffect, useState } from "react";
import RiderSideBar from "../../components/riderDashboard/RiderSideBar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
import RiderProfile from "../../components/riderDashboard/RiderProfile";
import RiderCurrentOrder from "../../components/riderDashboard/RiderCurrentOrder";
import RiderOrderHistory from "../../components/riderDashboard/RiderOrderHistory";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RiderDashboard = () => {
  const { role, isLogin } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  });

  if (role !== "partner") {
    return (
      <>
        <div className="p-3">
          <div className="border rounded shadow p-5 w-4xl mx-auto text-center bg-gray-100">
            <div className="text-5xl text-red-600">⊗</div>
            <div className="text-xl">
              You are not logged in as Rider. Please login again.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-[90vh] flex">
        <div
          className={`bg-(--color-background) duration-300 ${
            isCollapsed ? "w-2/60" : "w-12/60"
          }`}
        >
          <RiderSideBar
            active={active}
            setActive={setActive}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>
        <div className={`${isCollapsed ? "w-58/60" : "w-48/60"} duration-300`}>
          {active === "overview" && <RiderOverview />}
          {active === "profile" && <RiderProfile />}
          {active === "current-order" && <RiderCurrentOrder />}
          {active === "order-history" && <RiderOrderHistory />}
        </div>
      </div>
    </>
  );
};

export default RiderDashboard;