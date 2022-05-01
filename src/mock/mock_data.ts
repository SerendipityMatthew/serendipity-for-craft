import {
  CraftBlock,
  CraftBlockInsert,
  CraftTextBlockInsert,
  CraftTextBlock,
} from "@craftdocs/craft-extension-api";

export class MockSerendipityDataService {
  private blocks: Map<string, CraftBlock> = new Map();
  private subblocks: Map<string, string[]> = new Map();
  private rootId: string;
  constructor() {
    this.rootId = Math.random().toString(36).substring(2, 15);

    this.createInitialData();
  }

  private createInitialData() {
    const id1 = createRandomId();
    const id2 = createRandomId();

    this.blocks.set(this.rootId, {
      ...createDefaultBlock(),
      id: this.rootId,
      content: [{ text: "Craft X developer tools" }],
    });

    this.blocks.set(id1, {
      ...createDefaultBlock(),
      id: id1,
      content: [
        {
          text: "These tools facilitate extension development by creating a mock Craft API.",
        },
      ],
    });

    this.blocks.set(id2, {
      ...createDefaultBlock(),
      id: id2,
      content: [
        {
          text: "By reducing the feedback cycle developers can iterate with great velocity.",
        },
      ],
    });

    this.subblocks.set(this.rootId, [id1, id2]);
  }

  public getCurrentPage(): CraftTextBlock {
    const block = this.blocks.get(this.rootId);

    if (block === undefined || block.type !== "textBlock") {
      throw new Error("Invalid state, root block must be a textBlock");
    }

    const rootBlock = deepCopy(block);
    this.populateSubBlocks(rootBlock, new Set([this.rootId]));

    return rootBlock;
  }

  private populateSubBlocks(block: CraftBlock, seenBlocks: Set<string>) {
    if (block.type !== "textBlock") {
      return;
    }

    const subblockIds = this.subblocks.get(block.id) ?? [];

    subblockIds.forEach((subblockId) => {
      if (seenBlocks.has(subblockId)) {
        console.warn("Cycling reference detected");
        return;
      }

      const subblock = this.blocks.get(subblockId);

      if (subblock) {
        const subblockClone = deepCopy(subblock);
        this.populateSubBlocks(subblockClone, seenBlocks);
        block.subblocks.push(subblockClone);
      }
    });
  }
}
export function createRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
export function createDefaultBlock(): CraftTextBlock {
  return createTextBlock({
    type: "textBlock",
    content: "Hello world!",
  });
}

export function createTextBlock(input: CraftTextBlockInsert): CraftTextBlock {
  return deepCopy({
    ...input,
    ...createCommonProperties(input),
    type: "textBlock",
    content: Array.isArray(input.content)
      ? input.content
      : [{ text: input.content }],
    subblocks: [],
    style: {
      textStyle: "body",
      fontStyle: "system",
      alignmentStyle: "left",
      ...input.style,
    },
  });
}

export function deepCopy<T>(input: T): T {
  // TODO: create a more elegant solution
  const result: any = JSON.parse(JSON.stringify(input));

  return result;
}

const DocumentId = createRandomId()
const SpaceId = createRandomId()

function createCommonProperties(input: CraftBlockInsert) {
  return {
    id: createRandomId(),
    spaceId: SpaceId,
    documentId: DocumentId,
    indentationLevel: input.indentationLevel ?? 0,
    listStyle: {
      type: "none" as const,
      ...input.listStyle,
    },
    hasBlockDecoration: input.hasBlockDecoration ?? false,
    hasFocusDecoration: input.hasFocusDecoration ?? false,
    color: input.color ?? ("text" as const),
  };
}
