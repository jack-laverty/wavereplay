import SessionsData from "./components/SessionsData";
import AddSessionButton from "./components/AddSessionButton";

export default function Home() {
  return (

    <div>
      <div className="dashboard md:p-4">
        <SessionsData />
      </div>
    </div>
  );
}
