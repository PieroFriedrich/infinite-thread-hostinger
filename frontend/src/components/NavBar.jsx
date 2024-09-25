import Logo from "../images/infinite_thread.png";
import SearchIcon from "../images/search_icon.svg";

function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-myblue p-4">
      <div className="flex items-center justify-between">
        <img src={Logo} alt="Infinite Thread Logo" width={30} height={30} />
        <div className="text-white pl-4">Infinite Thread</div>
      </div>
      <div className="flex items-center justify-between gap-2 bg-white p-1 rounded-md">
        <input
          className="outline-none"
          type="text"
          placeholder="search for a thread"
        />
        <img src={SearchIcon} alt="Search Icon" width={20} height={20} />
      </div>
      <img src={Logo} alt="Profile Avatar" width={30} height={30} />
    </nav>
  );
}

export default NavBar;
