export type JsonLdObject = Record<string, unknown>;

export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  name: string;
  text: string;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};
