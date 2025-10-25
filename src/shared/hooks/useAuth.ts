import { useAppSelector } from "@/store/store";

export const useAuth = () => {
  const { user, token, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated,
  };
};
