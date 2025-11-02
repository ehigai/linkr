import { getUser } from "@/api/api";
import { useQuery, type QueryOptions } from "@tanstack/react-query";


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const useAuth = (opt?: QueryOptions<User>) => {
  const { data: user, ...rest } = useQuery<User>({
    queryKey: ["auth"],
    queryFn: getUser,
    retry: false,
    ...opt,
  });

  return { user, ...rest };
};



export default useAuth;