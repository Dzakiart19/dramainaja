export type PlatformId = 
  | 'radreel' 
  | 'flickreels' 
  | 'dotdrama' 
  | 'netshort' 
  | 'shortmax' 
  | 'starshort' 
  | 'stardusttv' 
  | 'dramadash' 
  | 'dramawave' 
  | 'dramabox' 
  | 'viglo' 
  | 'micro' 
  | 'melolo' 
  | 'meloshort' 
  | 'reelife';

export type MenuItemType = 
  | 'home' 
  | 'latest' 
  | 'search' 
  | 'rank' 
  | 'bookmark' 
  | 'trending' 
  | 'exchange'
  | 'categories'
  | 'collections'
  | 'discover'
  | 'meta'
  | 'episodes'
  | 'batch'
  | 'unlock'
  | 'tabs'
  | 'episode'
  | 'feed'
  | 'play'
  | 'foryou'
  | 'classify'
  | 'watch'
  | 'program'
  | 'list'
  | 'drama'
  | 'detail'
  | 'video'
  | 'ranking'
  | 'recommend'
  | 'init'
  | 'browse'
  | 'book';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  color: string;
  colorClass: string;
  api: {
    baseUrl: string;
    health: string;
    [key: string]: string;
  };
  lang: string | number;
  menu: MenuItemType[];
}

export interface Drama {
  id: string;
  title: string;
  cover: string;
  description?: string;
  rating?: number;
  episodes?: number;
  genre?: string[];
  year?: string;
  status?: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail?: string;
  duration?: string;
  videoUrl?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface HomeData {
  banners?: Drama[];
  sections?: {
    title: string;
    items: Drama[];
  }[];
  dramas?: Drama[];
}

export interface SearchResult {
  items: Drama[];
  total: number;
  page: number;
  hasMore: boolean;
}
