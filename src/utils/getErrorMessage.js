export function getErrorMessage(err) {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err.request) {
    return "Server is waking up, please try again in a few seconds.";
  }
  return "Something went wrong. Please try again.";
}
