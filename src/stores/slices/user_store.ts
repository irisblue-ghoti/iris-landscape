import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  credits: number;
}

const defaultUserState: UserState = {
  id: null,
  email: null,
  name: null,
  credits: 0,
};

export const userAtom = atomWithStorage<UserState>(
  "user_state",
  defaultUserState
);

export const userCreditsAtom = atom((get) => get(userAtom).credits);
