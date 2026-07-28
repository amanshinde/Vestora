import { useState } from 'react';

/**
 * Recursive Referral Tree Node component.
 * Displays user info with expandable children.
 */
const ReferralNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node">
      <div className="tree-node-content" onClick={() => hasChildren && setExpanded(!expanded)}>
        <div className="tree-node-avatar">
          {node.fullName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="tree-node-info">
          <div className="tree-node-name">{node.fullName}</div>
          <div className="tree-node-meta">{node.email} · {node.referralCode}</div>
        </div>
        <span className="tree-level-badge">L{node.level}</span>
        {hasChildren && (
          <button
            className={`tree-toggle ${expanded ? 'expanded' : ''}`}
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            ▶
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="tree-children slide-in-left">
          {node.children.map((child) => (
            <ReferralNode key={child._id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralTree = ({ tree = [] }) => {
  if (tree.length === 0) return null;

  return (
    <div className="referral-tree">
      {tree.map((node) => (
        <ReferralNode key={node._id} node={node} />
      ))}
    </div>
  );
};

export default ReferralTree;
