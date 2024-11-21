import Logo from "../images/infinite_thread.png";
import SearchIcon from "../images/search_icon.svg";
import PlusIcon from "../images/plus_icon.png";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const redirectToHome = () => {
    navigate("/");
  };
  const redirectToNewPost = () => {
    navigate("/newpost");
  };

  return (
    <nav className="flex items-center justify-between bg-myblue p-4">
      <button
        className="flex items-center gap-4 px-4 py-2 bg-transparent text-white text-lg font-semibold hover:text-orange-500 focus:text-orange-600"
        onClick={redirectToHome}
      >
        {/* Logo */}
        <img src={Logo} alt="Infinite Thread Logo" width={30} height={30} />

        {/* Text */}
        <span>Infinite Thread</span>
      </button>

      <div className="flex items-center justify-between gap-2 bg-white p-1 rounded-md">
        <input
          className="outline-none w-[400px]"
          type="text"
          placeholder="search for a thread"
        />
        <button>
          <img src={SearchIcon} alt="Search Icon" width={20} height={20} />
        </button>
      </div>
      <button onClick={redirectToNewPost}>
        <div className="flex gap-1 bg-myorange p-1 rounded-md text-myblue">
          <img src={PlusIcon} alt="plus icon" width={20} height={20} />
          Create a new post
        </div>
      </button>
    </nav>
  );
}

export default NavBar;
