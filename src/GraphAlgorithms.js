export const bfs = (nodes, edges, startNode) => {
  let queue = [startNode];
  let steps = [];
  let visited = new Set();

  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.has(node)) {
      visited.add(node);
      steps.push({ type: "visit", node });
      const nodeEdges = edges.filter(
        (edge) => edge.start === node || edge.end === node
      );
      for (const edge of nodeEdges) {
        const neighbor = edge.start === node ? edge.end : edge.start;
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          steps.push({ type: "highlight", edge });
        }
      }
    }
  }
  return steps;
};

export const dfs = (nodes, edges, startNode) => {
  let stack = [startNode];
  let steps = [];
  let visited = new Set();
  let pathFound = false; 

  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      steps.push({ type: "visit", node });

      const nodeEdges = edges.filter(
        (edge) =>
          (edge.start === node || edge.end === node) &&
          !visited.has(edge.start === node ? edge.end : edge.start)
      );

      nodeEdges.reverse();

      for (const edge of nodeEdges) {
        const neighbor = edge.start === node ? edge.end : edge.start;
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          steps.push({ type: "highlight", edge });
        }
      }
    }
  }

  visited.clear();

  return steps;
};


export const hamiltonianTour = (nodes, edges) => {
  let path = [];
  let steps = [];

  const findPath = (node, visited = new Set(), localPath = []) => {
    visited.add(node);
    localPath.push(node);
    steps.push({ type: "visit", node });

    if (localPath.length === nodes.length) {
      const lastNode = localPath[localPath.length - 1];
      const firstNode = localPath[0];
      const closingEdge = edges.find(
        (edge) =>
          (edge.start === lastNode && edge.end === firstNode) ||
          (edge.end === lastNode && edge.start === firstNode)
      );

      if (closingEdge) {
        steps.push({ type: "highlight", edge: closingEdge }); 
        path = [...localPath, firstNode]; 
        steps.push({ type: "complete", path: path });
        return true;
      }
    }

    const nodeEdges = edges.filter(
      (edge) =>
        (edge.start === node || edge.end === node) &&
        !visited.has(edge.start === node ? edge.end : edge.start)
    );
    for (const edge of nodeEdges) {
      const neighbor = edge.start === node ? edge.end : edge.start;
      if (!visited.has(neighbor)) {
        steps.push({ type: "highlight", edge });
        if (findPath(neighbor, new Set(visited), [...localPath])) {
          return true;
        }
      }
    }

    visited.delete(node);
    localPath.pop();
    steps.push({ type: "backtrack", node });
    return false;
  };

  findPath(nodes[0]);

  return steps;
};
