import { searchUsers } from "../services/user.api";

export const useUser = () => {
  async function handleSearchUser(query) {
    const data = await searchUsers(query);
    return data.users;
  }

  return { handleSearchUser };
};
