export class TreeNode<
  TData,
  TNode extends TreeNode<TData, TNode> = any,
> {
  protected _data: TData;
  private _children: TNode[];
  private _parent: TNode | null;

  constructor(data: TData, parent: TNode | null = null) {
    this._data = data;
    this._parent = parent;
    this._children = [];
  }

  getData(): TData {
    return this._data;
  }

  getParent(): TNode | null {
    return this._parent;
  }

  getChildren(): TNode[] {
    return this._children;
  }

  addChild(child: TNode): void {
    this._children.push(child);
  }

  getDepth(): number {
    return this._parent ? this._parent.getDepth() + 1 : 0;
  }

  getPathToRoot(): TNode[] {
    const path: TNode[] = [];
    let current: TNode | null = this as unknown as TNode;
    while (current) {
      path.push(current);
      current = current.getParent();
    }
    return path.reverse();
  }

  protected _setChildren(children: TNode[]): void {
    this._children = children;
  }
}
