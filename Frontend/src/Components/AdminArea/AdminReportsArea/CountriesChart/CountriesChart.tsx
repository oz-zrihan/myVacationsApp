import "./CountriesChart.scss";
import { useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
// Services
import followersService from "../../../../Services/FollowersService";
import vacationsService from "../../../../Services/vacationsService";
import notifyService from "../../../../Services/NotifyService";
import usersService from "../../../../Services/UsersService";
//Models
import UserModel from "../../../../Models/UserModel";
import FollowerModel from "../../../../Models/FollowerModel";
import VacationModel from "../../../../Models/VacationModel";

interface DataInterface {
  countryName: string;
  city: string[];
  followers: number;
  users: UserModel[];
}

interface DisplayUsers {
  user: UserModel;
  vacationId: number;
  vacationHotel: string;
  userId: number;
}

export default function CountriesChart(): JSX.Element {
  const [followers, setFollowers] = useState<FollowerModel[]>([]);
  const [vacations, setVacations] = useState<VacationModel[]>([]);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [displayUsers, setDisplayUsers] = useState<DisplayUsers[]>([]);
  const [data, setData] = useState<DataInterface[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    try {
      followersService
        .getAllFollowers()
        .then((dbFollowers) => setFollowers(dbFollowers));
      vacationsService
        .getAllVacations()
        .then((dbVacations) => setVacations(dbVacations));
      usersService.getAllUsers().then((dbUsers) => setUsers(dbUsers));
    } catch (err) {
      notifyService.error(err);
    }
  }, []);

  useEffect(() => {
    if (followers.length && vacations.length) {
      const stats = getVacationStats(vacations, followers, users);
      setData(stats);
    }
  }, [followers, vacations, users]);

  function getVacationStats(
    vacations: VacationModel[],
    followers: FollowerModel[],
    users: UserModel[]
  ) {
    const stats: DataInterface[] = [];
    const followerCount: Record<string, number> = {};
    let followersWithUsers: DisplayUsers[] = [];

    for (const vacation of vacations) {
      const { countryName, city } = vacation;
      let countryStats = stats.find((s) => s.countryName === countryName);

      if (!countryStats) {
        countryStats = { countryName, city: [city], followers: 0, users: [] };
        stats.push(countryStats);
      } else if (!countryStats.city.includes(city)) {
        countryStats.city.push(city);
      }

      const vacationFollowers = followers.filter(
        (f) => f.vacationId === vacation.vacationId
      );
      followerCount[countryName] =
        (followerCount[countryName] || 0) + vacationFollowers.length;

      const followersForVacation = vacationFollowers
        .map((follower) => {
          const user = users.find((user) => user.userId === follower.userId);
          return user ? { ...follower, user } : null;
        })
        .filter(Boolean);

      followersWithUsers.push(
        ...followersForVacation.map((follower) => ({
          user: follower.user,
          vacationId: vacation.vacationId,
          vacationHotel: vacation.hotel,
          userId: follower.userId,
        }))
      );
    }

    for (const stat of stats) {
      const followersForCountry = followersWithUsers.filter((follower) => {
        const vacation = vacations.find(
          (v) => v.vacationId === follower.vacationId
        );
        return (
          vacation &&
          vacation.countryName === stat.countryName &&
          stat.city.includes(vacation.city)
        );
      });
      stat.users = followersForCountry;
      stat.followers = followerCount[stat.countryName] || 0;
    }

    return stats;
  }

  function renderActiveShape(props: any) {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    function handelDisplayUsers(props: DisplayUsers[]) {
      setDisplayUsers(props);
    }

    return (
      <g>
        <text
          className="text-one"
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
        >
          {payload.countryName}
        </text>
        <Sector
          onMouseOver={() => handelDisplayUsers(props.users)}
          className="sector-one"
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
        />
        <Sector
          className="sector-one"
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
        />
        <path
          className="pie-line"
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          className="text-two"
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
        >{`${value} followers`}</text>
      </g>
    );
  }
  function onPieEnter(index: number) {
    setActiveIndex(index);
  }

  return (
    <div className="countries-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            className="main-pie"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="followers"
            onMouseEnter={(_, index) => onPieEnter(index)}
          />
        </PieChart>
      </ResponsiveContainer>
      {displayUsers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Hotel name</th>
              <th>Following user Email</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((u) => (
              <tr key={Math.random()}>
                <td>{u.vacationHotel}</td>
                <td>{u.user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
