const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </button>

      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`pagination-btn ${num === page ? 'active' : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="pagination-btn"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </button>

      <span className="pagination-info">
        {total} total
      </span>
    </div>
  );
};

export default Pagination;
