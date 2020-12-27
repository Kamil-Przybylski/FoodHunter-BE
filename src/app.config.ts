export enum FilePathsEnum {
  IMG_NAME = 'imgName',
  PHOTO = 'photo',

  DEFAULT_AVATAR = 'avatar.jpg',

  DEFAULT_PATH = 'uploads/default',
  FOOD_PATH = 'uploads/foods',
  AVATARS_PATH = 'uploads/avatars',
};

export enum UrlPathsEnum {
  ID = 'id',
  ADD = 'add',
  REMOVE = 'remove',
  ITEM_ID = 'itemId',

  FOOD = 'food',
  PHOTO = 'photo',
  INFO = 'info',

  RESTAURANT = 'food-restaurant',
  FOOD_TYPES = 'food-types',
  COMMENTS = 'comments',
  CATALOGS = 'catalogs',
  TAGS = 'tags',
  USER = 'user',
  FOLLOWERS = 'followers',

  AUTH = 'auth',
  SINGUP = 'singup',
  SINGIN = 'singin',
  LOGIN = 'login',
}

export const PAGINATOR_OPTIONS = {
  PAGE: 'page',
  LIMITS: 'limits',

  food: { limits: 3 },
};
