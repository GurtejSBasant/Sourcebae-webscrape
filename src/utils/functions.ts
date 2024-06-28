import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { DataSetOne, Employee } from "../types";
import { toast } from "react-toastify";
export async function fetchYcombinatorData(
  query: string,
  companiesId: string[],
  setApiLoading: Dispatch<SetStateAction<boolean>>,
  setter: Dispatch<SetStateAction<DataSetOne | undefined>>
) {
  try {
    setApiLoading(true);
    const response = await axios
      .post(
        `https://stagingsourcebae.shethink.in/scraper/fetch-data?query=${query}`,
        { companiesId }
      )
      .catch((err) => {
        console.log(err);
        setApiLoading(false);
      });
    setApiLoading(false);

    setter(response?.data);
  } catch (error) {
    console.error("Error fetching Ycombinator data:", error);
  }
}

export async function fetchEmployees(
  domain: string,
  setter: Dispatch<SetStateAction<Employee | undefined>>,
  setDomainApiLoading: Dispatch<SetStateAction<boolean>>
) {
  try {
    setDomainApiLoading(true);
    const response = await fetch(
      "https://stagingsourcebae.shethink.in/remote/fetch-employees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: "ppKeBXq42XUYmR7o6NyW6Q",
          q_organization_domains: domain,
        }),
      }
    );

    const employeeData = await response.json();
    // eslint-disable-next-line no-unsafe-optional-chaining, no-constant-condition
    if ([...employeeData?.people, ...employeeData?.contacts].length ===0) {
      toast.warning("No Data found");
    }
    // eslint-disable-next-line no-unsafe-optional-chaining
    setter([...employeeData?.people, ...employeeData?.contacts]);
    setDomainApiLoading(false);
  } catch (error) {
    console.error("Error fetching employees:", error);
    setDomainApiLoading(false);
  }
}

export async function fetchManagers(
  domain: string,
  setter: Dispatch<SetStateAction<Employee | undefined>>,
  setDomainApiLoading: Dispatch<SetStateAction<boolean>>
) {
  console.log("Fetching managers for domain:", domain); // Debug log
  setDomainApiLoading(true);

  try {
    const response = await fetch(
      "https://stagingsourcebae.shethink.in/remote/fetch-employees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: "ppKeBXq42XUYmR7o6NyW6Q",
          q_organization_domains: domain,
          person_seniorities: ["manager"], // Include person_seniorities as requested
        }),
      }
    );

    const managerData = await response.json();
    // eslint-disable-next-line no-unsafe-optional-chaining, no-constant-condition
    if ([...managerData?.people, ...managerData?.contacts].length ===0) {
      toast.warning("No Data found");
    }
    // eslint-disable-next-line no-unsafe-optional-chaining
    setter([...managerData?.people, ...managerData?.contacts]);
    setDomainApiLoading(false);

    console.log("Manager data response:", managerData); // Debug log
  } catch (error) {
    console.error("Error fetching managers:", error);
    setDomainApiLoading(false);
  }
}

export async function fetchClevel(
  domain: string,
  setter: Dispatch<SetStateAction<Employee | undefined>>,
  setDomainApiLoading: Dispatch<SetStateAction<boolean>>
) {
  console.log("Fetching managers for domain: ", domain); // Debug log
  setDomainApiLoading(true);
  try {
    const response = await fetch(
      "https://stagingsourcebae.shethink.in/remote/fetch-employees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: "ppKeBXq42XUYmR7o6NyW6Q",
          q_organization_domains: domain,
          position_title: "C-level",
          person_seniorities: ["founder", "CEO"], // Include person_seniorities as requested
        }),
      }
    );

    const managerData = await response.json();
    // eslint-disable-next-line no-unsafe-optional-chaining, no-constant-condition
    if ([...managerData?.people, ...managerData?.contacts].length ===0) {
      toast.warning("No Data found");
    }
    // eslint-disable-next-line no-unsafe-optional-chaining
    setter([...managerData?.people, ...managerData?.contacts]);
    setDomainApiLoading(false);
  } catch (error) {
    console.error("Error fetching managers:", error);
    setDomainApiLoading(false);
  }
}

function isValidURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export async function fetchEmployeeEmail(
  fullName: string,
  companyDomain: string,
  setDetails: Dispatch<SetStateAction<{ email: string; contact: string }>>,
  setApiLoading: Dispatch<SetStateAction<boolean>>,
  setRevealMail: Dispatch<SetStateAction<boolean>>
) {
  const apiKey = "ppKeBXq42XUYmR7o6NyW6Q";
  setApiLoading(true)
  try {
    let organizationName;
    console.log(isValidURL(companyDomain));
    if (isValidURL(companyDomain)) {
      const url = new URL(companyDomain);
      organizationName = url.hostname.replace(/^www\./, "").split(".")[0];
    } else {
      throw new Error("Invalid company domain URL");
    }

    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const response = await fetch(
      "https://stagingsourcebae.shethink.in/remote/fetch-employees-emails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          first_name: firstName,
          last_name: lastName,
          organization_name: organizationName,
          domain: companyDomain,
          reveal_personal_emails: true,
        }),
      }
    );

    const data = await response.json();
    console.log("Employee email response:", data); // Debug log

    if (data && data.person) {
      const person = data.person;
      const sanitizedPhone = person.sanitized_phone || "N/A";
      const email = person.email || "N/A";
      //   const name = person.name || `${firstName} ${lastName}`;
      setApiLoading(false);
    setRevealMail(true);
      setDetails({ email, contact: sanitizedPhone });
      return { email, contact: sanitizedPhone };
    } else {
      setApiLoading(false);
      console.error("Invalid response structure:", data);
      throw new Error("Failed to fetch employee email");
    }
  } catch (error) {
    setApiLoading(false);
    console.error("Error fetching employee email:", error);
    throw new Error("Failed to fetch employee email");
  }
}
