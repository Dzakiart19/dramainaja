import { PlatformConfig, Drama, HomeData, PlatformId } from '../types';

const TIMEOUT_MS = 8000;
const RATE_LIMIT_MS = 300;

// Rate limiter
let lastRequest = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  if (now - lastRequest < RATE_LIMIT_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS - (now - lastRequest)));
  }
  lastRequest = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============ NORMALIZERS PER PLATFORM ============

function normalizeRadReelDrama(item: any): Drama {
  return {
    id: String(item.compilationsId || item.fakeId),
    title: item.title || 'Untitled',
    cover: item.coverImgUrl || item.dubbingImageUrl || '',
    description: item.introduce || '',
    rating: 0,
    episodes: item.uploadOfEpisodes || 0,
    genre: item.compilationsTags || [],
    year: '',
    status: item.showMark || '',
  };
}

function normalizeFlickReelsDrama(item: any): Drama {
  return {
    id: String(item.playlet_id),
    title: item.title || 'Untitled',
    cover: item.cover || item.background || '',
    description: item.introduce || '',
    rating: 0,
    episodes: parseInt(item.upload_num) || 0,
    genre: item.playlet_tag_name || [],
    year: item.release_time || '',
    status: item.tag_name || '',
  };
}

function normalizeGenericDrama(item: any): Drama {
  return {
    id: String(item.id || item.drama_id || item.video_id || item.playlet_id || item.compilationsId || item.fakeId || Math.random()),
    title: item.title || item.name || item.drama_name || 'Untitled',
    cover: item.cover || item.coverImgUrl || item.poster || item.thumbnail || item.image || item.img || item.pic || '',
    description: item.description || item.introduce || item.summary || item.intro || item.desc || '',
    rating: item.rating || item.score || item.rate || 0,
    episodes: item.episodes || item.episode_count || item.total_episodes || parseInt(item.upload_num) || item.uploadOfEpisodes || 0,
    genre: item.genre || item.tags || item.categories || item.compilationsTags || item.playlet_tag_name || [],
    year: item.year || item.release_year || item.release_time || '',
    status: item.status || item.showMark || item.tag_name || '',
  };
}

// ============ PLATFORM-SPECIFIC API HANDLERS ============

export class PlatformAPI {
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async getHome(page = 1, limit = 20): Promise<HomeData> {
    const platformId = this.config.id;
    console.log(`🌐 [${this.config.name}] Fetching home...`);

    try {
      switch (platformId) {
        case 'radreel':
          return this.fetchRadReelHome(page, limit);
        case 'flickreels':
          return this.fetchFlickReelsHome(page, limit);
        case 'dotdrama':
          return this.fetchDotDramaHome(page, limit);
        case 'netshort':
          return this.fetchNetShortHome(page, limit);
        case 'shortmax':
          return this.fetchShortMaxHome(page, limit);
        case 'starshort':
          return this.fetchStarShortHome(page, limit);
        case 'stardusttv':
          return this.fetchStardustTVHome(page, limit);
        case 'dramadash':
          return this.fetchDramaDashHome(page, limit);
        case 'dramawave':
          return this.fetchDramaWaveHome(page, limit);
        case 'dramabox':
          return this.fetchDramaBoxHome(page, limit);
        case 'viglo':
          return this.fetchVigloHome(page, limit);
        case 'micro':
          return this.fetchMicroHome(page, limit);
        case 'melolo':
          return this.fetchMeloloHome(page, limit);
        case 'meloshort':
          return this.fetchMeloShortHome(page, limit);
        case 'reelife':
          return this.fetchReelifeHome(page, limit);
        default:
          return this.fetchGenericHome(page, limit);
      }
    } catch (error) {
      console.error(`[${this.config.name}] Home fetch failed:`, error);
      return { dramas: [] };
    }
  }

  // ========== RADREEL ==========
  private async fetchRadReelHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?lang=id&tab=17&page=${page}&limit=${limit}`;
    console.log(`🌐 [RadReel] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    
    // RadReel returns array directly
    const dramas = Array.isArray(data) 
      ? data.map(normalizeRadReelDrama)
      : [];
    
    return { dramas, banners: dramas.slice(0, 3) };
  }

  // ========== FLICKREELS ==========
  private async fetchFlickReelsHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?lang=6&page=${page}&limit=${limit}`;
    console.log(`🌐 [FlickReels] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    
    // FlickReels: {status_code, msg, data: [{list: [...]}]}
    let dramas: Drama[] = [];
    if (data?.data && Array.isArray(data.data)) {
      for (const section of data.data) {
        if (section?.list && Array.isArray(section.list)) {
          dramas = dramas.concat(section.list.map(normalizeFlickReelsDrama));
        }
      }
    }
    
    return { dramas, banners: dramas.slice(0, 3) };
  }

  // ========== DOTDRAMA ==========
  private async fetchDotDramaHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [DotDrama] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== NETSHORT ==========
  private async fetchNetShortHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/discover?page=${page}&limit=${limit}`;
    console.log(`🌐 [NetShort] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== SHORTMAX ==========
  private async fetchShortMaxHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [ShortMax] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== STARSHORT ==========
  private async fetchStarShortHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [StarShort] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== STARDUSTTV ==========
  private async fetchStardustTVHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [StardustTV] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== DRAMADASH ==========
  private async fetchDramaDashHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [DramaDash] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== DRAMAWAVE ==========
  private async fetchDramaWaveHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [DramaWave] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== DRAMABOX ==========
  private async fetchDramaBoxHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/foryou?page=${page}&limit=${limit}`;
    console.log(`🌐 [DramaBox] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== VIGLO ==========
  private async fetchVigloHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [Viglo] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== MICRO ==========
  private async fetchMicroHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/list?page=${page}&limit=${limit}`;
    console.log(`🌐 [Micro] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== MELOLO ==========
  private async fetchMeloloHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [Melolo] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== MELOSHORT ==========
  private async fetchMeloShortHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [MeloShort] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== REELIFE ==========
  private async fetchReelifeHome(page: number, limit: number): Promise<HomeData> {
    const url = `${this.config.api.baseUrl}/home?page=${page}&limit=${limit}`;
    console.log(`🌐 [Reelife] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  // ========== GENERIC ==========
  private async fetchGenericHome(page: number, limit: number): Promise<HomeData> {
    const homeEndpoint = this.config.api.home || '/home';
    const url = `${this.config.api.baseUrl}${homeEndpoint}&page=${page}&limit=${limit}`;
    console.log(`🌐 [${this.config.name}] ${url}`);
    const response = await rateLimitedFetch(url);
    const data = await response.json();
    return this.parseGenericResponse(data);
  }

  private parseGenericResponse(data: any): HomeData {
    if (!data) return { dramas: [] };

    let dramas: Drama[] = [];

    // Try different response structures
    if (Array.isArray(data)) {
      dramas = data.map(normalizeGenericDrama);
    } else if (data.data) {
      if (Array.isArray(data.data)) {
        // Check if it's FlickReels style with list inside
        if (data.data[0]?.list) {
          for (const section of data.data) {
            if (section?.list && Array.isArray(section.list)) {
              dramas = dramas.concat(section.list.map(normalizeGenericDrama));
            }
          }
        } else {
          dramas = data.data.map(normalizeGenericDrama);
        }
      } else if (data.data.list) {
        dramas = data.data.list.map(normalizeGenericDrama);
      } else if (data.data.dramas) {
        dramas = data.data.dramas.map(normalizeGenericDrama);
      } else if (data.data.items) {
        dramas = data.data.items.map(normalizeGenericDrama);
      }
    } else if (data.list) {
      dramas = data.list.map(normalizeGenericDrama);
    } else if (data.dramas) {
      dramas = data.dramas.map(normalizeGenericDrama);
    } else if (data.items) {
      dramas = data.items.map(normalizeGenericDrama);
    }

    return { dramas, banners: dramas.slice(0, 3) };
  }

  // ========== SEARCH ==========
  async searchDrama(query: string, page = 1): Promise<Drama[]> {
    const searchEndpoint = this.config.api.search || '/search';
    const separator = searchEndpoint.includes('?') ? '&' : '?';
    const url = `${this.config.api.baseUrl}${searchEndpoint}${separator}q=${encodeURIComponent(query)}&keyword=${encodeURIComponent(query)}&page=${page}`;
    
    console.log(`🔍 [${this.config.name}] ${url}`);

    try {
      const response = await rateLimitedFetch(url);
      const data = await response.json();
      const parsed = this.parseGenericResponse(data);
      return parsed.dramas;
    } catch (error) {
      console.error(`[${this.config.name}] Search failed:`, error);
      return [];
    }
  }

  // ========== DRAMA DETAIL ==========
  async getDramaDetail(id: string): Promise<Drama | null> {
    const dramaEndpoint = this.config.api.drama || '/drama';
    const url = `${this.config.api.baseUrl}${dramaEndpoint}/${id}`;
    
    console.log(`📖 [${this.config.name}] ${url}`);

    try {
      const response = await rateLimitedFetch(url);
      const data = await response.json();
      
      if (data?.data) {
        return normalizeGenericDrama(data.data);
      } else if (data && !data.error) {
        return normalizeGenericDrama(data);
      }
      return null;
    } catch (error) {
      console.error(`[${this.config.name}] Drama detail failed:`, error);
      return null;
    }
  }

  // ========== RANKING ==========
  async getRanking(type = 1, page = 1): Promise<Drama[]> {
    const rankEndpoint = this.config.api.rank || this.config.api.ranking;
    if (!rankEndpoint) {
      console.log(`[${this.config.name}] No rank endpoint available`);
      return [];
    }

    const separator = rankEndpoint.includes('?') ? '&' : '?';
    const url = `${this.config.api.baseUrl}${rankEndpoint}${separator}type=${type}&page=${page}`;
    
    console.log(`🏆 [${this.config.name}] ${url}`);

    try {
      const response = await rateLimitedFetch(url);
      const data = await response.json();
      const parsed = this.parseGenericResponse(data);
      return parsed.dramas;
    } catch (error) {
      console.error(`[${this.config.name}] Ranking failed:`, error);
      return [];
    }
  }

  // ========== LATEST ==========
  async getLatest(page = 1): Promise<Drama[]> {
    const latestEndpoint = this.config.api.latest;
    if (!latestEndpoint) {
      console.log(`[${this.config.name}] No latest endpoint available`);
      return [];
    }

    const separator = latestEndpoint.includes('?') ? '&' : '?';
    const url = `${this.config.api.baseUrl}${latestEndpoint}${separator}page=${page}`;
    
    console.log(`🆕 [${this.config.name}] ${url}`);

    try {
      const response = await rateLimitedFetch(url);
      const data = await response.json();
      const parsed = this.parseGenericResponse(data);
      return parsed.dramas;
    } catch (error) {
      console.error(`[${this.config.name}] Latest failed:`, error);
      return [];
    }
  }

  // ========== TRENDING ==========
  async getTrending(page = 1): Promise<Drama[]> {
    const trendingEndpoint = this.config.api.trending;
    if (!trendingEndpoint) {
      return this.getRanking(1, page);
    }

    const separator = trendingEndpoint.includes('?') ? '&' : '?';
    const url = `${this.config.api.baseUrl}${trendingEndpoint}${separator}page=${page}`;
    
    console.log(`🔥 [${this.config.name}] ${url}`);

    try {
      const response = await rateLimitedFetch(url);
      const data = await response.json();
      const parsed = this.parseGenericResponse(data);
      return parsed.dramas;
    } catch (error) {
      console.error(`[${this.config.name}] Trending failed:`, error);
      return [];
    }
  }
}
