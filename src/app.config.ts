export enum FilePathsEnum {
  IMGPATH = 'imgpath',
  PHOTO = 'photo',

  DEFAULT_AVATAR = 'avatar.jpg',

  DEFAULT_PATH = 'uploads/default',
  FOOD_PATH = 'uploads/foods',
  AVATARS_PATH = 'uploads/avatars',
};

export enum UrlPathsEnum {
  ID = 'id',
  ADD_FOOD = 'add-food',
  FOOD = 'food',

  RESTAURANT = 'food-restaurant',
  FOOD_TYPES = 'food-types',
  COMMENTS = 'comments',
  CATALOGS = 'catalogs',
  TAGS = 'tags',

  AUTH = 'auth',
  SINGUP = 'singup',
  SINGIN = 'singin',
  LOGIN = 'login',
  USER = 'user',
}

export const paginatorOptions = {
  PAGE: 'page',
  LIMITS: 'limits',

  food: { limits: 3 },
};
