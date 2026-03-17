import { useEffect } from "react";
import { getColleges } from "../services/collegeService";

function Home() {

  useEffect(() => {
    getColleges()
      .then(res => console.log(res.data))
      .catch(err => console.log("Backend not connected yet"));
  }, []);

  return <h2>Welcome to AimRoute</h2>;
}

export default Home;