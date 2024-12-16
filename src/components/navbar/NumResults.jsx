/* eslint-disable react/prop-types */
export default function NumResults({ moviesData }) {
  return (
    <p className="num-results">
      Found <strong>{moviesData?.length || 0}</strong> results
    </p>
  );
}
