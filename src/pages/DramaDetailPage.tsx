import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '@/core/context/PlatformContext';
import { useApi } from '@/core/hooks/useApi';
import { Drama } from '@/core/types';
import { Play, ArrowLeft, AlertCircle, Loader2, Star, Calendar, Tag } from 'lucide-react';

const DramaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPlatform } = usePlatform();
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drama, setDrama] = useState<Drama | null>(null);

  useEffect(() => {
    const fetchDramaDetail = async () => {
      if (!id) {
        setError('Drama ID tidak ditemukan');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`📖 Fetching drama detail: ${id} from ${currentPlatform.name}`);
        const data = await api.getDramaDetail(id);

        if (!data) {
          setError(`Drama tidak ditemukan di ${currentPlatform.name}`);
          setDrama(null);
        } else {
          setDrama(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch drama detail:', err);
        setError(`Gagal memuat detail drama: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDramaDetail();
  }, [id, currentPlatform.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: currentPlatform.color }} />
          <p className="text-muted-foreground">Memuat detail drama...</p>
        </div>
      </div>
    );
  }

  if (error || !drama) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-16 h-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Drama Tidak Ditemukan</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {error || 'Kami tidak dapat menemukan drama yang Anda cari di platform ini.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: currentPlatform.color }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cover */}
          <div className="md:col-span-1">
            <div className="relative overflow-hidden rounded-xl bg-card border border-white/5 sticky top-28">
              <img
                src={drama.cover}
                alt={drama.title}
                className="w-full aspect-[2/3] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop';
                }}
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center pulse-glow">
                  <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                </div>
              </div>

              {/* Rating Badge */}
              {drama.rating && drama.rating > 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-2 rounded-full bg-black/70 backdrop-blur-sm text-sm font-medium">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{drama.rating.toFixed(1)}</span>
                </div>
              )}

              {/* Episodes Badge */}
              {drama.episodes && drama.episodes > 0 && (
                <div className="absolute bottom-4 left-4 px-3 py-2 rounded-full bg-primary/90 text-sm font-medium text-primary-foreground">
                  {drama.episodes} Episode
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{drama.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {drama.year && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{drama.year}</span>
                </div>
              )}

              {drama.status && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm font-medium">{drama.status}</span>
                </div>
              )}

              {drama.episodes && drama.episodes > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <Play className="w-4 h-4" />
                  <span className="text-sm">{drama.episodes} Episode</span>
                </div>
              )}
            </div>

            {/* Genre */}
            {drama.genre && drama.genre.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(drama.genre) ? drama.genre : [drama.genre]).map((g, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: currentPlatform.color + '20',
                        color: currentPlatform.color,
                        border: `1px solid ${currentPlatform.color}40`,
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {drama.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Sinopsis</h3>
                <p className="text-muted-foreground leading-relaxed text-justify line-clamp-6">
                  {drama.description}
                </p>
              </div>
            )}

            {/* Action Button */}
            <button
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{ backgroundColor: currentPlatform.color }}
            >
              <Play className="w-6 h-6 fill-current" />
              Mulai Tonton Sekarang
            </button>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Episodes Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Episode</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {drama.episodes && drama.episodes > 0 ? (
                Array.from({ length: Math.min(drama.episodes, 20) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-card border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <Play className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Episode {i + 1}</p>
                      <p className="text-xs text-muted-foreground">dari {drama.episodes} episode</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">Tidak ada episode tersedia</p>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Informasi</h2>
            <div className="space-y-4 p-6 rounded-lg bg-card border border-white/5">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Platform</p>
                <p className="font-semibold">{currentPlatform.name}</p>
              </div>

              {drama.episodes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Episode</p>
                  <p className="font-semibold">{drama.episodes}</p>
                </div>
              )}

              {drama.rating && drama.rating > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <p className="font-semibold">{drama.rating.toFixed(1)}/10</p>
                  </div>
                </div>
              )}

              {drama.year && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tahun Rilis</p>
                  <p className="font-semibold">{drama.year}</p>
                </div>
              )}

              {drama.status && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <p className="font-semibold">{drama.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DramaDetailPage;
