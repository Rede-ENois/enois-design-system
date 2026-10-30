/**
 * A company in the directory: a real page, or a name that only exists through job posts
 * (`external`), which links to its jobs instead of a page.
 */
export type CompanyDirectoryEntryView = {
  key: string;
  name: string;
  logo: string | null;
  sector: string | null;
  location: string | null;
  href: string;
  external: boolean;
  openJobs: number;
  openProjects: number;
  followers: number;
};
