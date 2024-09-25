import Logo from "../images/infinite_thread.png";

function Post() {
  return (
    <div className="my-8">
      <div className="bg-myblue w-[90%] mx-auto p-0 rounded-tl-xl rounded-tr-xl">
        <div className="relative p-3">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Infinite Thread Logo" width={30} height={30} />
            <p className="text-white">Author Name</p>
          </div>
          <div className="bg-myorange text-white absolute top-0 right-0 p-1 rounded-tr-xl rounded-bl-xl">
            Group Category
          </div>
          <h2 className="text-white text-3xl py-3 border-b border-b-myorange">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </h2>
          <p className="text-white pt-3 text-sm">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Dignissimos animi quidem harum dolore ipsa excepturi est inventore
            explicabo ad. Ipsa ipsam vel sunt rem quia, commodi ab inventore
            dignissimos numquam? Lorem ipsum dolor sit amet consectetur
            adipisicing elit.
          </p>
        </div>
      </div>
      <div className="bg-myorange w-[90%] mx-auto p-0 rounded-bl-xl rounded-br-xl flex gap-2 py-2">
        <p className="bg-myyellow rounded-lg ml-2 px-2 text-myblue">Tags</p>
        <p className="bg-myyellow rounded-lg ml-2 px-2 text-myblue">Tags</p>
        <p className="bg-myyellow rounded-lg ml-2 px-2 text-myblue">Tags</p>
      </div>
    </div>
  );
}

export default Post;
