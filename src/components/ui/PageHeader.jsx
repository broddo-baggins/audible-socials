import PropTypes from 'prop-types';

/**
 * PageHeader: every page opens the same way. Left-aligned, a serif title,
 * one line under it, actions on the right. `kicker` is optional and rare.
 * `children` sits under the title row (tabs, filters, stats).
 */
const PageHeader = ({ title, description, kicker, actions, children, className = '', as: Tag = 'h1' }) => (
  <header className={`pt-8 md:pt-12 pb-6 md:pb-8 ${className}`}>
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {kicker && <p className="t-label text-ink-3 mb-3">{kicker}</p>}
        <Tag className="t-h1 text-ink">{title}</Tag>
        {description && <p className="mt-3 text-base md:text-lg text-ink-2 max-w-[60ch]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
    {children && <div className="mt-6">{children}</div>}
  </header>
);

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  kicker: PropTypes.node,
  actions: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default PageHeader;
