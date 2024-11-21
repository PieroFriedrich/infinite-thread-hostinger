import NavBar from "../components/NavBar";
import TimeLine from "../components/TimeLine";
import Tags from "../components/Tags";
import AboutUs from "../components/AboutUs";
import GoogleButton from "../components/GoogleButton";

function Home() {
  return (
    <>
      <NavBar />
      <div className="flex w-full">
        <div className="w-[30%]">
          <Tags />
        </div>
        <div className="w-[40%]">
          <TimeLine />
        </div>
        <div className="w-[30%] flex flex-col items-center">
          <div className="my-4">
            <GoogleButton />
          </div>
          <div className="w-[80%] mx-auto text-center flex flex-col items-center">
            <AboutUs />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
