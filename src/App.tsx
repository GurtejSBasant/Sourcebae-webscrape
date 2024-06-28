import { Divider, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";
import axios from "axios";
import MainView from "./components/MainView";
import { DataSetOne, DataSetTwo, Employee } from "./types";
import Loader from "./components/Loader/Loader";
import { toast } from "react-toastify";
import {
  fetchClevel,
  fetchEmployees,
  fetchManagers,
  fetchYcombinatorData,
} from "./utils/functions";

function App() {
  const [searchStr, setsearchStr] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSetOne, setDataSetOne] = useState<DataSetOne | undefined>();
  const [dataSetTwo, setDataSetTwo] = useState<DataSetTwo[] | undefined>();
  const [domainApiData, setDomainApiData] = useState<Employee | undefined>();
  const [apiLoading, setApiLoading] = useState(false);
  const [domainApiLoading, setDomainApiLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [mode, setMode] = useState<"tech" | "domain">("tech");
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: "#481079",
      },
      secondary: {
        main: "#f5d700",
      },
    },
    typography: {
      // Change the default text transform to 'capitalize'
      button: {
        textTransform: "capitalize",
      },
    },
    components: {
      // Name of the component
      MuiButtonBase: {
        defaultProps: {
          // The props to change the default for.
          disableRipple: true, // No more ripple, on the whole application 💣!
        },
      },
    },
  });

  function fetchWithTimeout(
    url: string,
    options = {},
    timeout = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const fetchPromise = fetch(url, options);

      if (timeout > 0) {
        const timeoutId = setTimeout(
          () => reject(new Error("Request timed out")),
          timeout
        );
        fetchPromise
          .then((response) => {
            clearTimeout(timeoutId);
            resolve(response);
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            reject(err);
          });
      } else {
        fetchPromise
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      }
    });
  }
  const handleSearch = async () => {
    setMode("tech");
    setApiLoading(true);
    await axios
      .post(
        `https://stagingsourcebae.shethink.in/scraper/algolia?query=${searchStr}&page=${currentPage}&hitsPerPage=10`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (res) => {
        const companyIds = res?.data?.allCompanyIds;
        if (companyIds && companyIds.length > 0) {
          await fetchYcombinatorData(
            searchStr,
            companyIds,
            setApiLoading,
            setDataSetOne
          );
        } else {
          toast.warning("No company IDs found in response"); // Debug log
        }
        const response = await fetchWithTimeout(
          `https://stagingsourcebae.shethink.in/remote/search?term=${encodeURIComponent(
            searchStr
          )}`,
          {
            mode: "cors",
          }
        );
        const searchData = await response.json();
        setDataSetTwo(searchData);
        setApiLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setApiLoading(false);
      });
  };
  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const searchDomain = (type: string) => {
    if (!domain) {
      toast.warning("Please enter company domain name");
      return;
    }

    switch (type) {
      case "employee":
        fetchEmployees(domain, setDomainApiData, setDomainApiLoading);

        break;
      case "manager":
        fetchManagers(domain, setDomainApiData, setDomainApiLoading);

        break;
      case "clevel":
        fetchClevel(domain, setDomainApiData, setDomainApiLoading);

        break;

      default:
        break;
    }
  };
  useEffect(() => {
    if (searchStr) {
      handleSearch();
    }
  }, [currentPage]);
  return (
    <div className="">
      {apiLoading && (
        <div className="flex fixed bottom-2 left-2 bg-white z-10 p-3">
          <Loader />
          <span>Searching more postings</span>
        </div>
      )}
      <ThemeProvider theme={muiTheme}>
        <SearchBar
          searchStr={searchStr}
          setsearchStr={setsearchStr}
          handleSearch={handleSearch}
          apiLoading={apiLoading}
          domain={domain}
          setDomain={setDomain}
          domainApiLoading={domainApiLoading}
          searchDomain={searchDomain}
          setMode={setMode}
        />
        <Divider />
        <MainView
          handleChange={handlePagination}
          dataSetOne={dataSetOne}
          dataSetTwo={dataSetTwo}
          page={currentPage}
          domainApiData={domainApiData}
          domainName={domain}
          mode={mode}
          setMode={setMode}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
