import "./DestinationCSV.scss";
import { useState } from "react";
// Models
import FollowerModel from "../../../../Models/FollowerModel";
import VacationModel from "../../../../Models/VacationModel";
// Services
import notifyService from "../../../../Services/NotifyService";

interface DestinationCSVProps {
  vacations: VacationModel[];
  followers: FollowerModel[];
}

function DestinationCSV(props: DestinationCSVProps): JSX.Element {
  // loading state -> show spinner if true
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create destination & followers data array
  function createCSV(): void {
    setIsLoading(true);

    // Filtering vacations and there followers
    const newData = props.vacations.map((vacation, index) => {
      try {
        const numOfFollowers = props.followers.filter((f) =>
          f.vacationId === vacation?.vacationId ? f.vacationId : 0
        );
        return {
          city: vacation?.city ?? "",
          followers: numOfFollowers.length,
          id: vacation.vacationId,
        };
      } catch (err: any) {
        notifyService.error(err);
      }
    });

    // Create city and corresponding followers objects
    const mergedData = newData.reduce(
      (
        acc: { city: string; followers: { id: number; count: number }[] }[],
        cur
      ) => {
        const existingCity = acc.find((el) => el.city === cur.city);
        if (existingCity) {
          const existingFollower = existingCity.followers.find(
            (follower: { id: number; count: number }) => follower.id === cur.id
          );
          if (existingFollower) {
            existingFollower.count += cur.followers;
          } else {
            existingCity.followers.push({ id: cur.id, count: cur.followers });
          }
        } else {
          acc.push({
            city: cur.city,
            followers: [{ id: cur.id, count: cur.followers }],
          });
        }

        return acc;
      },
      []
    );

    // Format the merged data as an array of arrays
    const formattedData = mergedData.map((vacation) => {
      const row = [vacation.city];
      const followers = vacation.followers.map((follower) => follower.count);
      const ids = vacation.followers.map((follower) => follower.id);

      row.push(followers.join(" | "));
      row.push(ids.join(" | "));
      row.push(String(followers.reduce((sum, count) => sum + count, 0)));

      return row;
    });

    // Add the header row
    formattedData.unshift([
      "Destination",
      "Vacations followers",
      "Vacation Id",
      "Total of Followers",
    ]);
    convertToCSV(formattedData);
  }

  // Convert data to CSV file
  function convertToCSV(csvData: string[][]): void {
    let dataToPrint = "";
    for (let i = 0; i < csvData.length; i++) {
      let line = "";
      for (let j = 0; j < csvData[i].length; j++) {
        if (line !== "") line += ",";
        line += csvData[i][j];
      }
      dataToPrint += line + "\r\n";
    }
    downloadCSV(dataToPrint, "destinationCSV");
  }

  // Download CSV file
  function downloadCSV(csv: string, filename: string): void {
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvData);
    link.setAttribute("download", filename);
    link.click();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="DestinationCSV">
      <button disabled={isLoading} className="blue-btn" onClick={createCSV}>
        {isLoading ? (
          <>
            <div className="loader"></div>
          </>
        ) : (
          <span>Download CSV</span>
        )}
      </button>
    </div>
  );
}

export default DestinationCSV;
