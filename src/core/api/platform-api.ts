import { BaseAPI } from './base-api';
import { PlatformConfig, Drama, HomeData } from '../types';

export class PlatformAPI extends BaseAPI {
  constructor(config: PlatformConfig) {
    super(config);
  }

  async getHome(page = 1, limit = 20): Promise<HomeData> {
    const homeEndpoint = this.config.api.home || '/home';
    try {
      const response = await this.request<any>(homeEndpoint, { page, limit });
      return this.normalizeHomeData(response);
    } catch (error) {
      console.error(`[${this.config.name}] Home fetch failed:`, error);
      return { dramas: this.getMockDramas() };
    }
  }

  async searchDrama(query: string, page = 1): Promise<Drama[]> {
    const searchEndpoint = this.config.api.search || '/search';
    try {
      const response = await this.request<any>(searchEndpoint, { q: query, page });
      return this.normalizeDramas(response?.data || response?.items || []);
    } catch (error) {
      console.error(`[${this.config.name}] Search failed:`, error);
      return [];
    }
  }

  async getDramaDetail(id: string): Promise<Drama | null> {
    const dramaEndpoint = this.config.api.drama || '/drama';
    try {
      const response = await this.request<any>(`${dramaEndpoint}/${id}`);
      return this.normalizeDrama(response?.data || response);
    } catch (error) {
      console.error(`[${this.config.name}] Drama detail failed:`, error);
      return null;
    }
  }

  async getRanking(type = 1, page = 1): Promise<Drama[]> {
    const rankEndpoint = this.config.api.rank;
    if (!rankEndpoint) return [];
    try {
      const response = await this.request<any>(rankEndpoint, { type, page });
      return this.normalizeDramas(response?.data || response?.items || []);
    } catch (error) {
      console.error(`[${this.config.name}] Ranking failed:`, error);
      return [];
    }
  }

  async getLatest(page = 1): Promise<Drama[]> {
    const latestEndpoint = this.config.api.latest;
    if (!latestEndpoint) return [];
    try {
      const response = await this.request<any>(latestEndpoint, { page });
      return this.normalizeDramas(response?.data || response?.items || []);
    } catch (error) {
      console.error(`[${this.config.name}] Latest failed:`, error);
      return [];
    }
  }

  private normalizeHomeData(response: any): HomeData {
    if (!response) return { dramas: this.getMockDramas() };
    
    const data = response.data || response;
    
    return {
      banners: this.normalizeDramas(data.banners || data.banner || []),
      sections: (data.sections || data.tabs || []).map((section: any) => ({
        title: section.title || section.name || 'Popular',
        items: this.normalizeDramas(section.items || section.list || section.dramas || []),
      })),
      dramas: this.normalizeDramas(data.dramas || data.list || data.items || []),
    };
  }

  private normalizeDramas(items: any[]): Drama[] {
    if (!Array.isArray(items)) return this.getMockDramas();
    return items.map(item => this.normalizeDrama(item)).filter(Boolean) as Drama[];
  }

  private normalizeDrama(item: any): Drama | null {
    if (!item) return null;
    return {
      id: String(item.id || item.drama_id || item.video_id || Math.random()),
      title: item.title || item.name || item.drama_name || 'Untitled',
      cover: item.cover || item.poster || item.thumbnail || item.image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
      description: item.description || item.summary || item.intro || '',
      rating: item.rating || item.score || 0,
      episodes: item.episodes || item.episode_count || item.total_episodes || 0,
      genre: item.genre || item.tags || item.categories || [],
      year: item.year || item.release_year || '',
      status: item.status || '',
    };
  }

  private getMockDramas(): Drama[] {
    return [
      {
        id: '1',
        title: 'Love in the Moonlight',
        cover: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
        description: 'A romantic drama set in ancient times',
        rating: 9.2,
        episodes: 24,
        genre: ['Romance', 'Historical'],
        year: '2024',
      },
      {
        id: '2',
        title: 'CEO\'s Secret Love',
        cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        description: 'Modern romance between CEO and assistant',
        rating: 8.8,
        episodes: 30,
        genre: ['Romance', 'Modern'],
        year: '2024',
      },
      {
        id: '3',
        title: 'Eternal Promise',
        cover: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
        description: 'Fantasy romance across dimensions',
        rating: 9.0,
        episodes: 40,
        genre: ['Fantasy', 'Romance'],
        year: '2023',
      },
      {
        id: '4',
        title: 'Royal Intrigue',
        cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
        description: 'Palace drama with unexpected twists',
        rating: 8.7,
        episodes: 36,
        genre: ['Historical', 'Drama'],
        year: '2024',
      },
      {
        id: '5',
        title: 'Hidden Love',
        cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
        description: 'Sweet campus romance story',
        rating: 9.1,
        episodes: 25,
        genre: ['Romance', 'Youth'],
        year: '2023',
      },
      {
        id: '6',
        title: 'Sword Dynasty',
        cover: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop',
        description: 'Epic martial arts adventure',
        rating: 8.9,
        episodes: 50,
        genre: ['Action', 'Wuxia'],
        year: '2024',
      },
    ];
  }
}
