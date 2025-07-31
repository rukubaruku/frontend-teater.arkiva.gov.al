import Select from "react-select";

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    padding: "0",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#2c3e50",
    background: state.isDisabled ? "#f8f9fa" : "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "all 0.3s ease",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(189, 30, 44, 0.1)" : "none",
    borderColor: state.isFocused ? "#BD1E2C" : "#e9ecef",
    "&:hover": {
      borderColor: "#BD1E2C",
    },
    minHeight: "auto",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "12px 16px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#aaa",
    fontSize: "16px",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    fontSize: "16px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingRight: "8px",
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: "16px",
    zIndex: 99999,
    position: "absolute",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "16px",
    backgroundColor: state.isSelected
      ? "#BD1E2C"
      : state.isFocused
      ? "#f8f9fa"
      : "white",
    color: state.isSelected ? "white" : "#2c3e50",
    cursor: "pointer",
    padding: "12px 16px",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "16px",
    color: "#2c3e50",
  }),
  multiValue: (provided) => ({
    ...provided,
    fontSize: "16px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: "16px",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  isMulti = false,
  isDisabled = false,
}) {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customStyles}
      isClearable
      isMulti={isMulti}
      menuPortalTarget={document.body}
      isDisabled={isDisabled}
    />
  );
}
