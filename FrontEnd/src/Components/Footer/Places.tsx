import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
  ComboboxList,
} from "@reach/combobox";

type PlaceProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
};

function Places({ setOffice }: PlaceProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (location: string) => {
    setValue(location, false);
    clearSuggestions();

    const results = await getGeocode({ address: location });
    const { lat, lng } = getLatLng(results[0]);
    setOffice({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        id="search adresses"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search address"
        disabled={!ready}
        className=" w-4/5  p-2 text-black dark:text-white text-res-md-sm rounded-md mt-2 outline-none bg-transparent border-2 border-[#e89c3e] dark:border-blue-900 min-500:w-3/5 min-1200:w-2/4 min-1500:w-2/5"
      />
      <ComboboxPopover>
        <ComboboxList className="bg-[#46d6e9] dark:bg-[#102231] mt-1 rounded-lg p-2">
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                value={description}
                className=" cursor-pointer hover:bg-[#aeebf4]  dark:hover:bg-[#193043] transition-colors duration-300 p-1 rounded-md "
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

export default Places;
