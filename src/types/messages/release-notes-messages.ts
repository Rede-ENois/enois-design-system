export type ReleaseNotesMessages = {
  releaseNotesEditor: {
    title: string;
    description: string;
    none: string;
    live: (since: string) => string;
    itemLabel: (position: number) => string;
    itemTitle: string;
    itemTitlePlaceholder: string;
    itemDescription: string;
    itemDescriptionPlaceholder: string;
    remove: (position: number) => string;
    add: string;
    count: (count: number, max: number) => string;
    preview: string;
    publish: string;
    republish: string;
    publishing: string;
    retire: string;
    retiring: string;
  };
};
