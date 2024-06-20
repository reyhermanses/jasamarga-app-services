import { fetchDataSuccess } from "./slice";

export const fetchData = (data) => async (dispatch) => {
  dispatch(fetchDataSuccess(data))
}