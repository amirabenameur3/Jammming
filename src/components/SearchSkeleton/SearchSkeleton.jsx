import "./SearchSkeleton.css";

function SearchSkeleton() {
  const skeletonTracks = Array.from({ length: 5 });

  return (
    <div
      className="search-skeleton"
      aria-label="Loading search results"
      aria-busy="true"
    >
      {skeletonTracks.map((_, index) => (
        <div className="skeleton-track" key={index}>
          <div className="skeleton-image" />

          <div className="skeleton-info">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-details" />
          </div>

          <div className="skeleton-duration" />
          <div className="skeleton-action" />
        </div>
      ))}
    </div>
  );
}

export default SearchSkeleton;