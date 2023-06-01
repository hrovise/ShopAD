export interface Post {
  id: string,
  category: string,
  title: string,
  price: number,
  content: string,
  contentLarge: string,
  quantity: number[],
  imagePath: string
}

export interface Category{
  value: string,
  title: string
}
