  import React from "react";
  import tranparentLogo from "../assets/transparentLogo.png";
  import { Link, useNavigate } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";

  const Header = () => {
    const { user, isLogin, role } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = () => {
      switch (role) {
        case "manager": {
          navigate("/resturant-dashboard");
          break;
        }
        case "partner": {
          navigate("/rider-dashboard");
          break;
        }
        case "customer": {
          navigate("/user-dashboard", { state: { tab: "overview" } });
          break;
        }
        case "admin": {
          navigate("/admin-dashboard");
          break;
        }
        default:
          break;
      }
    };

    return (
      <>
        <div className="bg-background px-4 py-2 flex justify-between items-center">
          <Link to={"/"}>
            <img
              src={tranparentLogo}
              alt=""
              className="h-12 w-20 object-contain invert"
            />
          </Link>
          <div className="flex gap-4">
            <Link
              to={"/"}
              className="no-underline text-text hover:text-accent"
            >
              Home
            </Link>
            <Link
              to={"/about"}
              className="no-underline text-text hover:text-accent"
            >
              About
            </Link>
            <Link
              to={"/contact"}
              className="no-underline text-text hover:text-accent"
            >
              Contact
            </Link>
            
          </div>
          <div className="flex gap-4">
            {isLogin ? (
              <div
                className="text-primary cursor-pointer"
                onClick={handleNavigate}
              >
                {user.fullName}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-secondary py-2 px-4 font-bold hover:bg-secondary-hover hover:text-white rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-accent py-2 px-4 font-bold hover:bg-primary hover:text-white rounded"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  export default Header;


