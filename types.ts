// Based on components.schemas.UserModel from the OpenAPI spec
export interface User {
  user_id: number;
  username: string;
  balance: string;
  hold: string;
  active_items_count: number;
  sold_items_count: number;
  restore_count: number;
  register_date: number;
  last_activity: number;
  like_count: number;
  message_count: number;
  user_title: string;
  is_banned: boolean;
  currency: string;
  rendered: {
    username: string;
    avatars: {
      l: string;
      m: string;
      s: string;
    };
    link: string;
  };
}

export interface ApiError {
  errors: string[];
}
