import "../scss/components/Landing.scss";
import { Link } from "react-router-dom";
import Login from "./Login";

function Landing(props) {
  return (
    <main className="landing">
      <Login toggleForm={props.toggleForm} isLogin={props.isLogin} setLogin={props.setLogin} />
    </main>
  );
}

export default Landing;
