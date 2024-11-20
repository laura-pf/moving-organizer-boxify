import "../scss/components/Landing.scss";
import { Link } from "react-router-dom";
import Login from "./Login";

function Landing(props) {
  return (
    <main className="landing">
      <Login toggleForm={props.toggleForm} isLogin={props.isLogin} />
      <div className="landing__button">
        <Link to="/main" className="landing__button-link">
          &gt;
        </Link>
      </div>
    </main>
  );
}

export default Landing;
