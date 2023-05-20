export interface Chapter {
  id: number;
  order: number;
  title: string;
  content: string[];
  code: {
    html: string;
    css: string;
    js: string;
  };
}
