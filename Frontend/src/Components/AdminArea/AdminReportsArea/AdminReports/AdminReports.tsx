// Components
import CountriesChart from "../CountriesChart/CountriesChart";
import FollowersChart from "../FollowersChart/FollowersChart";

function AdminReports(): JSX.Element {
  return (
    <div className="AdminReports">
      <div className="vacations-graph">
        <FollowersChart />
        <CountriesChart />
      </div>
    </div>
  );
}

export default AdminReports;
