// TODO: Create an interface for the Candidate objects returned by the API
export default interface Candidate {
  id: number;
  login: string;
  name: string | null;
  location: string | null;
  avatar_url: string;
  email: string | null;
  html_url: string;
  company: string | null;
}

// additional type for localStorage tracking
export interface SavedCandidate extends Candidate {
  savedDate: string;
}