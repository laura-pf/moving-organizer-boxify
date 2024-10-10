import "../scss/components/Landing.scss";
import { Link } from "react-router-dom";
import Login from "./Login";

function Landing(props) {
  return (
    <main className="landing">
      <Login toggleForm={props.toggleForm} isLogin={props.isLogin} />
      <p className="label construction">
        Back-End en construcción 🏗️, para continuar viendo la APP:
      </p>
      <div className="landing__button">
        <Link to="/main" className="landing__button-link">
          &gt;
        </Link>
      </div>
    </main>
  );
}

export default Landing;
