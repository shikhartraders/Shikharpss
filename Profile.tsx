import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Calendar, LogOut, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, loading, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        throw updateError;
      }

      // Refresh user data in context
      await refreshUser();

    } catch (error: any) {
      alert(error.message || 'Error uploading image!');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-68px)] px-[5%] py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-white/5 rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="h-32 bg-background-grad" />
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="relative w-24 h-24 group">
                <div className="w-full h-full rounded-2xl bg-surface border-4 border-card flex items-center justify-center text-4xl font-bold text-accent shadow-xl overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()
                  )}
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 className="text-white animate-spin" size={24} />
                  ) : (
                    <Camera className="text-white" size={24} />
                  )}
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tighter mb-1">
                    {user.user_metadata?.full_name || 'Learner'}
                  </h1>
                  <p className="text-muted">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {user.email === 'shikhartraders01@gmail.com' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-2 bg-accent/10 text-accent px-6 py-2.5 rounded-xl font-semibold hover:bg-accent/20 transition-all"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white/5 hover:bg-accent-2/10 hover:text-accent-2 text-muted px-6 py-2.5 rounded-xl font-semibold transition-all"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-accent" />
                    <span className="text-muted">Full Name:</span>
                    <span className="font-medium">{user.user_metadata?.full_name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-accent" />
                    <span className="text-muted">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-accent" />
                    <span className="text-muted">Joined:</span>
                    <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  🎓
                </div>
                <h3 className="font-bold">Learning Progress</h3>
                <p className="text-sm text-muted">You haven't started any courses yet. Explore our library to begin!</p>
                <button
                  onClick={() => navigate('/services')}
                  className="text-accent text-sm font-bold hover:underline"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
