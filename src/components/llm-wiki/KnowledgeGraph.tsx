import type { GraphEdge, GraphNode } from '@/types/llm-wiki';
import { Icon } from './icons';

interface Props {
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

export function KnowledgeGraph({ graph, selectedNodeId, onSelectNode }: Props) {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  const selectedNode = graph.nodes.find((node) => node.id === selectedNodeId) ?? graph.nodes.find((node) => node.kind === 'concept');

  return (
    <div className="llmw-graph-layout">
      <div className="llmw-graph-canvas" aria-label="Interactive knowledge graph">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {graph.edges.map((edge) => {
            const source = nodeMap.get(edge.source)!;
            const target = nodeMap.get(edge.target)!;
            return <line key={`${edge.source}-${edge.target}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />;
          })}
        </svg>
        {graph.nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className="llmw-graph-node"
            data-kind={node.kind}
            data-active={node.id === selectedNode?.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => onSelectNode(node.id)}
            aria-label={`${node.label}: ${node.detail}`}
          >
            <Icon name={node.kind === 'source' ? 'document' : node.kind === 'concept' ? 'graph' : 'spark'} />
            <span>{node.label}</span>
          </button>
        ))}
      </div>

      <aside className="llmw-node-inspector">
        <span className="llmw-kicker">Selected knowledge</span>
        <h3>{selectedNode?.label}</h3>
        <p>{selectedNode?.detail}</p>
        <span className="llmw-node-type">{selectedNode?.kind}</span>
      </aside>

      <ul className="sr-only" aria-label="Knowledge relationships">
        {graph.edges.map((edge) => (
          <li key={`text-${edge.source}-${edge.target}`}>
            {nodeMap.get(edge.source)?.label} {edge.label} {nodeMap.get(edge.target)?.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
