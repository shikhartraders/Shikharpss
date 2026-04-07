import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Upload, Plus, Trash2, ExternalLink, CheckCircle, AlertCircle, X, Star, Smartphone, Monitor } from 'lucide-react';
import { Material } from '../types';
import { CATEGORIES_STRUCTURE } from '../constants';

const GRADIENTS = [
  'from-[#ff6b6b] to-[#f5c842]',
  'from-[#6c63ff] to-[#ff6b6b]',
  'from-[#43e8d8] to-[#6c63ff]',
  'from-[#f5c842] to-[#ff6b6b]',
  'from-[#ff6b6b] to-[#43e8d8]',
  'from-[#6c63ff] to-[#f5c842]',
  'from-[#43e8d8] to-[#f5c842]',
];

const CATEGORY_ICONS: Record<string, string> = {
  editing: '🎬',
  software: '💻',
  ai: '🤖',
  others: '✨',
};

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [customSection, setCustomSection] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [showCustomSection, setShowCustomSection] = useState(false);
  const [showCustomSubcategory, setShowCustomSubcategory] = useState(false);

  const [thumbnailType, setThumbnailType] = useState<'emoji' | 'url' | 'upload'>('emoji');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'editing' as Material['category'],
    section: '',
    subcategory: '',
    device: 'mobile' as 'mobile' | 'desktop',
    rating: 5,
    logo_url: '',
    thumbnail_icon: '🎬',
    thumbnail_url: '',
    resource_url: '',
    gradient: GRADIENTS[0],
    is_free: true,
    screenshots: [] as string[],
  });

  const [newScreenshot, setNewScreenshot] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      fetchMaterials();
    };
    checkUser();
  }, [navigate]);

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setMaterials(data || []);
    }
    setLoading(false);
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalThumbnailUrl = formData.thumbnail_url;
      let finalThumbnailIcon = formData.thumbnail_icon;

      if (thumbnailType === 'upload' && thumbnailFile) {
        finalThumbnailUrl = await uploadThumbnail(thumbnailFile);
        finalThumbnailIcon = '';
      } else if (thumbnailType === 'url') {
        finalThumbnailIcon = '';
      } else if (thumbnailType === 'emoji') {
        finalThumbnailUrl = '';
      }

      const finalSection = showCustomSection ? customSection : formData.section;
      const finalSubcategory = showCustomSubcategory ? customSubcategory : formData.subcategory;

      const { error: insertError } = await supabase.from('materials').insert([
        {
          ...formData,
          thumbnail_url: finalThumbnailUrl,
          thumbnail_icon: finalThumbnailIcon,
          section: finalSection,
          subcategory: finalSubcategory,
          user_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      setSuccess('Material added successfully!');
      setIsAdding(false);
      resetForm();
      fetchMaterials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add material');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'editing',
      section: '',
      subcategory: '',
      device: 'mobile',
      rating: 5,
      logo_url: '',
      thumbnail_icon: '🎬',
      thumbnail_url: '',
      resource_url: '',
      gradient: GRADIENTS[0],
      is_free: true,
      screenshots: [],
    });
    setThumbnailType('emoji');
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setCustomSection('');
    setCustomSubcategory('');
    setShowCustomSection(false);
    setShowCustomSubcategory(false);
    setNewScreenshot('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setMaterials(materials.filter((m) => m.id !== id));
      setSuccess('Material deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const addScreenshot = () => {
    if (newScreenshot && !formData.screenshots.includes(newScreenshot)) {
      setFormData({ ...formData, screenshots: [...formData.screenshots, newScreenshot] });
      setNewScreenshot('');
    }
  };

  const removeScreenshot = (url: string) => {
    setFormData({ ...formData, screenshots: formData.screenshots.filter(s => s !== url) });
  };

  if (loading && !materials.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentCategoryStructure = CATEGORIES_STRUCTURE[formData.category];
  const sections = currentCategoryStructure?.sections ? Object.keys(currentCategoryStructure.sections) : [];
  const subcategories = (formData.section && currentCategoryStructure?.sections?.[formData.section]) || [];

  return (
    <div className="min-h-screen px-[5%] py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Admin Dashboard</h1>
            <p className="text-muted">Manage your free materials and courses</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-background-grad text-white px-6 py-3 rounded-xl font-bold font-display tracking-wide hover:opacity-90 transition-opacity"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancel' : 'Add New Material'}
          </button>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-3/10 border border-accent-3/20 text-accent-3 px-4 py-3 rounded-xl text-sm mb-8 flex items-center gap-2"
          >
            <CheckCircle size={16} /> {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-2/10 border border-accent-2/20 text-accent-2 px-4 py-3 rounded-xl text-sm mb-8 flex items-center gap-2"
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-card border border-white/5 rounded-3xl p-8 mb-12 shadow-2xl overflow-hidden"
          >
            <h2 className="text-2xl font-bold mb-6">Upload New Resource</h2>
            <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Main Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as Material['category'];
                    setFormData({ ...formData, category: cat, section: '', subcategory: '', thumbnail_icon: CATEGORY_ICONS[cat] });
                    setShowCustomSection(false);
                    setShowCustomSubcategory(false);
                  }}
                  className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all appearance-none"
                >
                  <option value="editing">Material for Editing</option>
                  <option value="software">Software and Apps</option>
                  <option value="ai">AI Master Classes</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {/* Section Selection (for Editing, AI, Others) */}
              {formData.category !== 'software' && (
                <div className="space-y-2">
                  <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Section / Service Type</label>
                  {!showCustomSection ? (
                    <select
                      value={formData.section}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW') {
                          setShowCustomSection(true);
                          setFormData({ ...formData, section: '' });
                        } else {
                          setFormData({ ...formData, section: e.target.value, subcategory: '' });
                        }
                      }}
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all appearance-none"
                    >
                      <option value="">Select Section</option>
                      {sections.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                      <option value="ADD_NEW" className="text-accent font-bold">+ Add New Service Type</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSection}
                        onChange={(e) => setCustomSection(e.target.value)}
                        className="flex-1 bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                        placeholder="Enter new service type..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomSection(false)}
                        className="px-4 bg-surface border border-white/5 rounded-xl text-muted hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Subcategory Selection (for Editing) */}
              {formData.category === 'editing' && formData.section && (
                <div className="space-y-2">
                  <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Type / Subcategory</label>
                  {!showCustomSubcategory ? (
                    <select
                      value={formData.subcategory}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW') {
                          setShowCustomSubcategory(true);
                          setFormData({ ...formData, subcategory: '' });
                        } else {
                          setFormData({ ...formData, subcategory: e.target.value });
                        }
                      }}
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all appearance-none"
                    >
                      <option value="">Select Type</option>
                      {subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="ADD_NEW" className="text-accent font-bold">+ Add New Type</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSubcategory}
                        onChange={(e) => setCustomSubcategory(e.target.value)}
                        className="flex-1 bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                        placeholder="Enter new type..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomSubcategory(false)}
                        className="px-4 bg-surface border border-white/5 rounded-xl text-muted hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Software Specific Fields */}
              {formData.category === 'software' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Device</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, device: 'mobile' })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.device === 'mobile' ? 'bg-accent/10 border-accent text-accent' : 'bg-surface border-white/5 text-muted'}`}
                      >
                        <Smartphone size={18} /> Mobile
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, device: 'desktop' })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.device === 'desktop' ? 'bg-accent/10 border-accent text-accent' : 'bg-surface border-white/5 text-muted'}`}
                      >
                        <Monitor size={18} /> Desktop
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">App Type</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all appearance-none"
                    >
                      <option value="">Select App Type</option>
                      {CATEGORIES_STRUCTURE.software.types.map((type: string) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className={`p-2 transition-all ${formData.rating >= star ? 'text-accent' : 'text-muted'}`}
                        >
                          <Star size={24} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">App Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Screenshots (URLs)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newScreenshot}
                        onChange={(e) => setNewScreenshot(e.target.value)}
                        className="flex-1 bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                        placeholder="https://example.com/screenshot.png"
                      />
                      <button
                        type="button"
                        onClick={addScreenshot}
                        className="px-6 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {formData.screenshots.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="Screenshot" className="w-24 h-24 object-cover rounded-xl border border-white/10" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(url)}
                            className="absolute -top-2 -right-2 bg-accent-2 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Title / App Name</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                  placeholder="e.g. Adobe Premiere Pro"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all min-h-[100px]"
                  placeholder="Describe the resource..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Resource URL (Download Link)</label>
                <input
                  type="url"
                  required
                  value={formData.resource_url}
                  onChange={(e) => setFormData({ ...formData, resource_url: e.target.value })}
                  className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="md:col-span-2 space-y-4 bg-surface/50 p-6 rounded-2xl border border-white/5">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Thumbnail</label>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setThumbnailType('emoji')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${thumbnailType === 'emoji' ? 'bg-accent text-white' : 'bg-surface border border-white/5 text-muted'}`}
                  >
                    Emoji
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailType('url')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${thumbnailType === 'url' ? 'bg-accent text-white' : 'bg-surface border border-white/5 text-muted'}`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailType('upload')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${thumbnailType === 'upload' ? 'bg-accent text-white' : 'bg-surface border border-white/5 text-muted'}`}
                  >
                    Upload Image
                  </button>
                </div>

                {thumbnailType === 'emoji' && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted">Thumbnail Icon (Emoji)</label>
                    <input
                      type="text"
                      value={formData.thumbnail_icon}
                      onChange={(e) => setFormData({ ...formData, thumbnail_icon: e.target.value })}
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                      placeholder="🎬"
                    />
                  </div>
                )}

                {thumbnailType === 'url' && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted">Thumbnail Image URL</label>
                    <input
                      type="url"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                )}

                {thumbnailType === 'upload' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/5 border-dashed rounded-2xl cursor-pointer bg-surface hover:bg-surface/80 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted" />
                          <p className="mb-2 text-sm text-muted">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted/60">PNG, JPG or WebP (MAX. 800x400px)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailFileChange} />
                      </label>
                    </div>
                    {thumbnailPreview && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                        <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                          className="absolute top-1 right-1 bg-accent-2 text-white p-1 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Gradient Style</label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map((grad) => (
                    <button
                      key={grad}
                      type="button"
                      onClick={() => setFormData({ ...formData, gradient: grad })}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${grad} border-2 ${formData.gradient === grad ? 'border-white' : 'border-transparent'} transition-all`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-5 h-5 accent-accent"
                />
                <label htmlFor="is_free" className="text-sm font-semibold text-muted uppercase tracking-wider cursor-pointer">
                  Available for Free
                </label>
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-background-grad text-white py-4 rounded-xl font-bold font-display tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  {loading ? 'Uploading...' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Published Resources</h2>
          {materials.length === 0 ? (
            <div className="text-center py-20 bg-card border border-white/5 rounded-3xl">
              <p className="text-muted">No materials uploaded yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="bg-card border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-accent/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${m.gradient}`}>
                      {m.logo_url ? (
                        <img src={m.logo_url} alt="Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        m.thumbnail_icon || '📦'
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{m.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted mt-1">
                        <span className="uppercase tracking-wider font-bold text-[0.7rem] text-accent">{m.category}</span>
                        {m.section && (
                          <>
                            <span>•</span>
                            <span className="text-[0.7rem] uppercase tracking-wider">{m.section}</span>
                          </>
                        )}
                        {m.device && (
                          <>
                            <span>•</span>
                            <span className="text-[0.7rem] uppercase tracking-wider">{m.device}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-accent-3">{m.is_free ? 'Free' : 'Premium'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={m.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-surface border border-white/5 rounded-xl text-muted hover:text-white transition-all"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-3 bg-surface border border-white/5 rounded-xl text-muted hover:text-accent-2 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
