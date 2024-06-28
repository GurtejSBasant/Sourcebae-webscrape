export type DataSetOne = {
  companies: {
    name: string;
    website: string;
    jobs: {
      title: string;
      skills: { name: string }[];
      pretty_min_experience: string;
      pretty_salary_range: string;
      pretty_equity_range: string;
    }[];
  }[];
};

export type DataSetTwo = {
    company: string;
    website: string;
    title: string;
    // skills: { name: string }[];
    tags: string;
    link: string;
};
export type Employee = {
  name: string;
  title: string;
  email: string;
  contact: string;
  linkedin_url: string;
  domain: string;
}[];
// export type Managers = {};
// export type CLevelManagers = {};

export type EmployeeType = {
    name: string;
    title: string;
    email: string;
    contact: string;
    linkedin_url: string;
    domain: string;
  };