import { useLocation } from "react-router-dom";

function useGetParams() {
  const location = useLocation();

  const getParams = (param: string): string | null => {
    const data = new URLSearchParams(location.search);
    return data.get(param);
  };

  return getParams;
}

export default useGetParams;

// cách sử dụng
// const getParams = useGetParams();
// const myParam = getParams("id");
