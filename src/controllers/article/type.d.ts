export interface ICreateArticeBody{
  categorys: string[];
  title: string;
  screenshot: string;
  content: string;
  description: string;
}

export interface IGetArticelListQuery {
  limit: number;
  offset: number;
  category: string;
  sort: 'recently' | 'read';
  show_test: boolean;
}

export interface IUpdateArticelBody {
  id: number;
  categorys: string[];
  title: string;
  screenshot: string;
  content: string;
}
