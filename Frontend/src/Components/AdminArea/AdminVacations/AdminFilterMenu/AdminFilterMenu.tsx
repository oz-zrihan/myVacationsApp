import "./AdminFilterMenu.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// Models
import CountryModel from "../../../../Models/CountryModel";
import FilterMenuDataModel from "../../../../Models/FilterMenuDataModel";
// Services
import countriesService from "../../../../Services/CountriesService";
import notifyService from "../../../../Services/NotifyService";

interface filterMenuInterface {
  onDataSend: (data: FilterMenuDataModel) => void;
}

function AdminFilterMenu(props: filterMenuInterface): JSX.Element {
  // Filter data to send to parent
  const { onDataSend } = props;

  // Initial render state
  const [initialRender, setInitialRender] = useState<boolean>(true);

  // Show only vacation that not started if true
  const [isNotStarted, setIsNotStarted] = useState<boolean>(false);

  // Show only active vacation if true
  const [isActive, setIsActive] = useState<boolean>(false);

  // Countries state
  const [countries, setCountries] = useState<CountryModel[]>([]);

  // Show only vacations at the selected country
  const [selectedCountry, setSelectedCountry] = useState<number>(null);

  // Get akk countries -> for selection menu
  useEffect(() => {
    countriesService
      .getAllCountries()
      .then((dbCountries) => setCountries(dbCountries))
      .catch((err) => notifyService.error(err));
  }, []);

  // Handle isNotStarted toggle
  function toggleIsNotStarted() {
    setIsNotStarted(!isNotStarted);
  }

  // Handle isActive toggle
  function toggleIsActive() {
    setIsActive(!isActive);
  }

  // Set selected country id to state
  function setSelectedCountryState(args: ChangeEvent<HTMLSelectElement>): void {
    const countryId = +args.target.value;
    setSelectedCountry(countryId);
  }

  // Clear selection
  function clearSelection() {
    setIsNotStarted(false);
    setIsActive(false);
    setSelectedCountry(null);
  }

  // Update onDataSend when relevant state changed
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      const data = new FilterMenuDataModel();
      data.isNotStarted = isNotStarted;
      data.isActive = isActive;
      data.selectedCountry = selectedCountry;
      onDataSend(data);
    }
  }, [isNotStarted, isActive, selectedCountry]);

  // ============================= HTML =============================
  return (
    <>
      <div className="AdminFilterMenu">
        <h2> Admin menu</h2>
        <h3> Filter vacations</h3>

        {/* Is not started */}
        <div className="checkbox-wrapper">
          <small> Show vacations that not started</small>
          <label className="switch">
            <input
              type="checkbox"
              checked={isNotStarted}
              onChange={toggleIsNotStarted}
            />
            <div className="slider round"></div>
          </label>
        </div>

        {/* Is Active */}
        <div className="checkbox-wrapper">
          <small> Show active vacations</small>
          <label className="switch">
            <input
              type="checkbox"
              checked={isActive}
              onChange={toggleIsActive}
            />
            <div className="slider round"></div>
          </label>
        </div>

        {/* Sort by country */}
        <small> Show by country</small>
        <select
          defaultValue={selectedCountry}
          onChange={setSelectedCountryState}
        >
          {countries.map((c) => (
            <option key={c.countryId} value={c.countryId}>
              {c.countryName}
            </option>
          ))}
          <option value={0}>All</option>
        </select>

        <button className="blue-btn" onClick={clearSelection}>
          {" "}
          Clear selection
        </button>

        <h3> Add vacation</h3>
        <NavLink to={"/add-vacation"}>
          {" "}
          <button className="blue-btn"> Add Vacation</button>
        </NavLink>

        <h3> Reports</h3>
        <NavLink to={"/admin-reports"}>
          <button className="blue-btn"> Reports</button>
        </NavLink>
      </div>
    </>
  );
}

export default AdminFilterMenu;
