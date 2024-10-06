export default function NavBar() {
    return (
        <div className="navigation">
        <a href="/">
          <img
            className="logoMain"
            src="https://cdn-icons-png.flaticon.com/512/2997/2997468.png"
            alt="logo"
          />
        </a>
        <h1 className="header">StoryFrame - New way of viewing books</h1>
        <button className="btnNav" >
          More books!
        </button>
      </div>
    );
}