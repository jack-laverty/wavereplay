import SessionsData from "./components/SessionsData";

export default function Home() {
  return (

    <div>
      <div className="dashboard md:p-4">
        <SessionsData />
      </div>
    </div>
  );
}
