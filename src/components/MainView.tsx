import { Button, Chip, Divider, Pagination } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DataSetOne, DataSetTwo, Employee, EmployeeType } from "../types";
import { LoadingButton } from "@mui/lab";
import { fetchEmployeeEmail } from "../utils/functions";
const EmployeeCard: React.FC<{ item: EmployeeType; domainName: string }> = ({
  item,
  domainName,
}) => {
  const [revealMail, setRevealMail] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    email: "",
    contact: "",
  });
  const getInfo = () => {
    fetchEmployeeEmail(
      item?.name,
      domainName,
      setContactDetails,
      setApiLoading,
      setRevealMail
    );
  };

  return (
    <div className="grid grid-cols-2 p-4 border border-primaryPurple rounded-lg ">
      <div>Employee Name</div>
      <div>{item?.name}</div>
      <div>Position Title</div>
      <div>{item?.title}</div>
      {/* <div>Skills</div>
  <div className="p-2">
    {item?.skills?.map((i) => (
      <Chip sx={{ margin: "2px" }} label={i?.name} />
    ))}
  </div> */}
      <div>LinkedIn</div>
      <a href={item?.linkedin_url} target="_blank" className="cursor-pointer">
        {item?.linkedin_url}
      </a>
      <div>Website</div>
      <div>{item?.domain}</div>
      {contactDetails?.contact && (
        <>
          <div>Phone</div>
          <div>{contactDetails?.contact}</div>
        </>
      )}
      {contactDetails?.email && (
        <>
          <div>Email</div>
          <div>{contactDetails?.email}</div>
        </>
      )}
      <div></div>
      <div>
        {!revealMail && (
          <LoadingButton
            variant="outlined"
            className={"!rounded-full"}
            size="small"
            loading={apiLoading}
            onClick={getInfo}
          >
            Get Contact Info
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
const MainView: React.FC<{
  handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  dataSetOne: DataSetOne | undefined;
  dataSetTwo: DataSetTwo[] | undefined;
  domainApiData: Employee | undefined;
  page: number;
  domainName: string;
  mode: "tech" | "domain";
  setMode: Dispatch<SetStateAction<"tech" | "domain">>;
}> = ({
  dataSetOne,
  handleChange,
  page,
  dataSetTwo,
  domainApiData,
  domainName,
  mode,
  setMode,
}) => {
  return (
    <div>
      {mode === "domain" && (
        <div className="py-4 px-6">
          <Button
            variant="outlined"
            className="!rounded-full "
            onClick={() => {
              setMode("tech");
            }}
          >
            &larr; Go Back
          </Button>
        </div>
      )}
      {mode === "tech" && (
        <>
          {dataSetOne?.companies?.map((item) => {
            return (
              <div className="p-6">
                <strong className="text-2xl">{item?.name}</strong>
                <p>
                  <strong>Website </strong>
                  <a href={item?.website} target="_blank">
                    {item?.website}
                  </a>
                  <div className="grid grid-cols-2 py-4 gap-4">
                    {item?.jobs?.map((item) => {
                      return (
                        <div className="grid grid-cols-2 p-4 border border-primaryPurple rounded-lg ">
                          <div>Job Title</div>
                          <div>{item?.title}</div>
                          <div>Skills</div>
                          <div className="p-2">
                            {item?.skills?.map((i) => (
                              <Chip sx={{ margin: "2px" }} label={i?.name} />
                            ))}
                          </div>
                          <div>Minimum Experience</div>
                          <div>{item?.pretty_min_experience}</div>
                          <div>Salary Range</div>
                          <div>{item?.pretty_salary_range}</div>
                          <div>Equity Range</div>
                          <div>{item?.pretty_equity_range}</div>
                        </div>
                      );
                    })}
                  </div>
                </p>
              </div>
            );
          })}
          <Divider />
          {dataSetTwo?.length && (
            <h2 className="px-6 text-2xl py-4 font-bold">More Postings ...</h2>
          )}
          <div className="grid grid-cols-2 py-4 gap-4 px-6 ">
            {dataSetTwo?.map((item) => {
              return (
                <div className="grid grid-cols-2 p-4 border border-primaryPurple rounded-lg ">
                  <div>Job Title</div>
                  <div>{item?.title}</div>
                  {/* <div>Skills</div>
              <div className="p-2">
                {item?.skills?.map((i) => (
                  <Chip sx={{ margin: "2px" }} label={i?.name} />
                ))}
              </div> */}
                  <div>Company Name</div>
                  <div>{item?.company}</div>
                  <div>Tags</div>
                  <div>{item?.tags}</div>
                  <div>Job Link</div>
                  <div>
                    <a href={item?.link} target="_blank">
                      <Chip label={"Open"} />
                    </a>
                  </div>
                  {/* <div>Website</div>
              <div>{item?.website}</div> */}
                </div>
              );
            })}
          </div>
        </>
      )}
      {mode === "domain" && (
        <div className="grid grid-cols-2 py-4 gap-4 px-6">
          {domainApiData?.map((item) => {
            return <EmployeeCard item={item} domainName={domainName} />;
          })}
        </div>
      )}
      {dataSetOne && mode === "tech" && (
        <div className="flex justify-center">
          <Pagination count={10} page={page} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

export default MainView;
