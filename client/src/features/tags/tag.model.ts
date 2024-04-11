export interface SmTag {
  id: number;
  name: string;
  price: number;
}

export interface Tag extends SmTag {
  createdAt: Date;
}
