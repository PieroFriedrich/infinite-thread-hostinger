function AboutUs() {
  return (
    <>
      <h2 className="mt-4 mb-2">About Us</h2>
      <p>
        Welcome to Infinite Thread, your go-to platform for exploring, sharing,
        and connecting within the ever-evolving world of IT. Whether you're a
        seasoned developer, an aspiring tech enthusiast, or simply someone
        curious about the latest in technology, Infinite Thread is here to
        empower you.
      </p>
      <p>Here you can:</p>
      <ul className="list-disc pl-6">
        <li>Create posts to share your knowledge, ideas, or projects.</li>
        <li>Discover insightful content from others in the IT community.</li>
        <li>
          Stay updated on trends, tools, and best practices in the tech
          industry.
        </li>
      </ul>
      <p>
        Join us in building a collaborative space where innovation and learning
        thrive. Together, we can weave an infinite thread of ideas that shape
        the future of technology.
      </p>
      <p className="mt-4">
        Copyright &copy;{" "}
        <a
          href="https://www.linkedin.com/in/piero-friedrich-90a9b9192/"
          target="_blank"
          className="underline text-mycolor4 hover:text-mycolor2"
        >
          Piero Friedrich.
        </a>{" "}
        All rights reserved
      </p>
    </>
  );
}

export default AboutUs;
