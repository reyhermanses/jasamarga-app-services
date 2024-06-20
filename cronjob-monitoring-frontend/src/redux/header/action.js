import { inHome, inMonitoring, inInformation, inLeader, clearAll } from "./slice";

export const landing = () => async (dispatch) => {
  dispatch(inHome());
}

export const monitoring = () => async (dispatch) => {
  dispatch(inMonitoring());
}

export const information = () => async (dispatch) => {
  dispatch(inInformation());
}

export const leader = () => async (dispatch) => {
  dispatch(inLeader());
}

export const clearHeader = () => async (dispatch) => {
  dispatch(clearAll())
}