export interface Friend {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface FriendsState {
  friends: Record<string, Friend>;
  friendEmails: string[];
  loading: boolean;
}
