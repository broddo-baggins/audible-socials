import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * VirtualList Component
 * Implements virtual scrolling for large lists to improve performance
 * Only renders visible items + buffer
 */
const VirtualList = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

VirtualList.propTypes = {
  items: PropTypes.array.isRequired,
  itemHeight: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  overscan: PropTypes.number,
  className: PropTypes.string
};

/**
 * VirtualGrid Component
 * Implements virtual scrolling for grid layouts
 */
export const VirtualGrid = ({
  items,
  itemHeight,
  itemsPerRow,
  containerHeight,
  renderItem,
  gap = 16,
  overscan = 1,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalRows = Math.ceil(items.length / itemsPerRow);
  const rowHeight = itemHeight + gap;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const visibleRows = [];
  for (let row = startRow; row <= endRow; row++) {
    const startIdx = row * itemsPerRow;
    const endIdx = Math.min(startIdx + itemsPerRow, items.length);
    visibleRows.push(items.slice(startIdx, endIdx));
  }

  const totalHeight = totalRows * rowHeight;
  const offsetY = startRow * rowHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleRows.map((row, rowIndex) => (
            <div
              key={startRow + rowIndex}
              className="flex gap-4"
              style={{ height: itemHeight, marginBottom: gap }}
            >
              {row.map((item, colIndex) => {
                const itemIndex = (startRow + rowIndex) * itemsPerRow + colIndex;
                return (
                  <div key={itemIndex} style={{ flex: `0 0 calc((100% - ${gap * (itemsPerRow - 1)}px) / ${itemsPerRow})` }}>
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

VirtualGrid.propTypes = {
  items: PropTypes.array.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemsPerRow: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  gap: PropTypes.number,
  overscan: PropTypes.number,
  className: PropTypes.string
};

/**
 * useVirtualScroll Hook
 * Custom hook for implementing virtual scrolling
 */
export const useVirtualScroll = (options) => {
  const {
    itemCount,
    itemHeight,
    containerHeight,
    overscan = 3
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return {
    containerRef,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    visibleItemCount: endIndex - startIndex + 1
  };
};

/**
 * InfiniteScroll Component
 * Implements infinite scrolling with automatic loading
 */
export const InfiniteScroll = ({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 200,
  className = ''
}) => {
  const containerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold) {
      setIsLoadingMore(true);
      loadMore().finally(() => setIsLoadingMore(false));
    }
  }, [hasMore, isLoadingMore, loading, loadMore, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div ref={containerRef} className={`overflow-y-auto ${className}`}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      {(loading || isLoadingMore) && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more items to load
        </div>
      )}
    </div>
  );
};

InfiniteScroll.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  threshold: PropTypes.number,
  className: PropTypes.string
};

export default VirtualList;

