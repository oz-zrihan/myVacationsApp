import "./FilterMenu.scss";
import { ChangeEvent, useEffect, useState } from "react";
// Models
import CountryModel from "../../../../Models/CountryModel";
import FilterMenuDataModel from "../../../../Models/FilterMenuDataModel";
// Services
import countriesService from "../../../../Services/CountriesService";
import notifyService from "../../../../Services/NotifyService";
//icons
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TbStarsOff } from "react-icons/tb";

interface filterMenuInterface {
  onDataSend: (data: FilterMenuDataModel) => void;
}

function FilterMenu(props: filterMenuInterface): JSX.Element {
  // Filter data to send to parent
  const { onDataSend } = props;

  // Initial render state
  const [initialRender, setInitialRender] = useState<boolean>(true);

  // Show only followed vacation if true
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Show only vacation that not started if true
  const [isNotStarted, setIsNotStarted] = useState<boolean>(false);

  // Show only active vacation if true
  const [isActive, setIsActive] = useState<boolean>(false);

  // Countries state
  const [countries, setCountries] = useState<CountryModel[]>([]);

  // Show only vacations at the selected country
  const [selectedCountry, setSelectedCountry] = useState<number>(null);

  // Show only vacation that are cheaper than selected price
  const [sortByPrice, setSortByPrice] = useState<number>(10000);

  // star rating
  const [sortByStarRating, setSortByStarRating] = useState(0);

  // Get akk countries -> for selection menu
  useEffect(() => {
    countriesService
      .getAllCountries()
      .then((dbCountries) => setCountries(dbCountries))
      .catch((err) => notifyService.error(err));
  }, []);

  // Handle isFollowing toggle
  function toggleIsFollowing() {
    setIsFollowing(!isFollowing);
  }

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

  // Handle sort by price
  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSortByPrice(parseInt(event.target.value));
  }

  // Clear selection
  function clearSelection() {
    setIsFollowing(false);
    setIsNotStarted(false);
    setIsActive(false);
    setSelectedCountry(null);
    setSortByPrice(10000);
    setSortByStarRating(0);
  }

  // Update onDataSend when relevant state changed
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      const data = new FilterMenuDataModel();
      data.isFollowing = isFollowing;
      data.isNotStarted = isNotStarted;
      data.isActive = isActive;
      data.selectedCountry = selectedCountry;
      data.sortByPrice = sortByPrice;
      data.sortByStarRating = sortByStarRating;
      onDataSend(data);
    }
  }, [isFollowing, isNotStarted, isActive, selectedCountry, sortByPrice, sortByStarRating, initialRender]);

  // ============================= HTML =============================
  return (
    <>
      <div className="FilterMenu">
        <h2> Filters</h2>

        {/* Sort by price */}
        <div className="price-range">
          <small> Show vacations under:</small>
          <div>
            <input
              type="range"
              name="range-slider"
              min="0"
              max="10000"
              step="500"
              value={sortByPrice}
              onChange={handlePriceChange}
            />
          </div>
          <span className="price-display">${sortByPrice}</span>
        </div>

        {/* Is following */}
        <div className="checkbox-wrapper">
          <small> Show followed vacations</small>
          <label className="switch">
            <input
              type="checkbox"
              checked={isFollowing}
              onChange={toggleIsFollowing}
            />
            <div className="slider round"></div>
          </label>
        </div>

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

        {/* Star rating */}
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= sortByStarRating ? "on" : "off"}
                onClick={() => setSortByStarRating(index)}
              >
                <span className="star">
                  {index <= sortByStarRating ? (
                    <AiFillStar />
                  ) : (
                    <AiOutlineStar />
                  )}
                </span>
              </button>
            );
          })}
          <span
            title="Clear star rating"
            className="clear-stars"
            onClick={() => setSortByStarRating(0)}
          >
            <TbStarsOff />
          </span>
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

        <button className="gold-btn" onClick={clearSelection}>
          {" "}
          Clear selection
        </button>
      </div>
    </>
  );
}

export default FilterMenu;
