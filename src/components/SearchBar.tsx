import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

const SearchBar: React.FC<{
  searchStr: string;
  setsearchStr: Dispatch<SetStateAction<string>>;
  handleSearch: () => Promise<void>;
  apiLoading: boolean;
  domainApiLoading: boolean;
  domain: string;
  setDomain: Dispatch<SetStateAction<string>>;
  setMode: Dispatch<SetStateAction<"tech" | "domain">>;
  searchDomain: (type: string) => void;
}> = ({
  searchStr,
  setsearchStr,
  handleSearch,
  apiLoading,
  setDomain,
  domainApiLoading,
  domain,
  searchDomain,
  setMode,
}) => {
  return (
    <div className="grid grid-cols-[60%_40%] my-3 mx-4">
      <div className="flex gap-2">
        <TextField
          value={domain}
          label={"Search Company Domain"}
          onChange={(e) => {
            setDomain(e.target.value);
          }}
          size="small"
        />
        <LoadingButton
          loading={domainApiLoading}
          variant="outlined"
          size="small"
          onClick={() => {
            searchDomain("employee");
            setMode("domain");
          }}
        >
          Search Employees
        </LoadingButton>
        <LoadingButton
          loading={domainApiLoading}
          variant="outlined"
          size="small"
          onClick={() => {
            searchDomain("manager");
            setMode("domain");
          }}
        >
          Search Managers
        </LoadingButton>
        <LoadingButton
          loading={domainApiLoading}
          variant="outlined"
          size="small"
          onClick={() => {
            searchDomain("clevel");
            setMode("domain");
          }}
        >
          Search C-Level Managers
        </LoadingButton>
      </div>
      <div className="flex justify-end gap-2 ">
        <TextField
          value={searchStr}
          label={"Search"}
          onChange={(e) => {
            setsearchStr(e.target.value);
          }}
          size="small"
        />
        <LoadingButton
          loading={apiLoading}
          variant="outlined"
          size="small"
          onClick={handleSearch}
        >
          Search by Technology
        </LoadingButton>
      </div>
    </div>
  );
};

export default SearchBar;
