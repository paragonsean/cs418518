import React from "react";

const LoadingErrorState = ({ loading, error }) => {
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return null;
};

export default LoadingErrorState;
