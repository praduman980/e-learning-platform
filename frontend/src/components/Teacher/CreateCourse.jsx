import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { FiBookOpen, FiSave, FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';

const categories = [
  'Web Development', 'Mobile Development', 'Data Science',
  'AI & Machine Learning', 'DevOps', 'Cloud Computing',
  'Cybersecurity', 'Programming Languages', 'Database', 'Other'
];

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'All Levels',
    price: 0,
    isFree: false,
    requirements: [''],
    whatYouWillLearn: [''],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'price' ? { isFree: false } : {}),
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length ? arr : [''] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const courseData = {
        ...formData,
        requirements: formData.requirements.filter((r) => r.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter((r) => r.trim()),
      };
      const { data } = await API.post('/courses', courseData);
      setSuccess(true);
      setTimeout(() => navigate(`/courses/${data._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiBookOpen className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Course Created! 🎉</h2>
        <p className="text-dark-500">Redirecting to your new course...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-dark-600 hover:text-dark-900 mb-6">
        <FiArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <FiBookOpen className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Create New Course</h1>
          <p className="text-dark-500">Set up your course and start teaching</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-dark-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Course Title *</label>
            <input name="title" value={formData.title} onChange={handleChange}
              className="input-field" placeholder="e.g., Complete Python Bootcamp" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              className="input-field h-28 resize-none" placeholder="Describe what students will learn..." required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Level</label>
              <select name="level" value={formData.level} onChange={handleChange} className="input-field">
                {levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange}
                min="0" step="0.99" className="input-field" placeholder="29.99"
                disabled={formData.isFree} />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="isFree" checked={formData.isFree}
                  onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-dark-700">Make this course free</span>
              </label>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900">What Students Will Learn</h2>
            <button type="button" onClick={() => addArrayField('whatYouWillLearn')}
              className="btn-secondary text-sm flex items-center space-x-1">
              <FiPlus className="h-4 w-4" /> <span>Add</span>
            </button>
          </div>
          <div className="space-y-3">
            {formData.whatYouWillLearn.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input value={item} onChange={(e) => handleArrayChange('whatYouWillLearn', i, e.target.value)}
                  className="input-field flex-1" placeholder={`Learning outcome ${i + 1}`} />
                <button type="button" onClick={() => removeArrayField('whatYouWillLearn', i)}
                  className="text-red-500 hover:text-red-700 p-2">
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900">Requirements / Prerequisites</h2>
            <button type="button" onClick={() => addArrayField('requirements')}
              className="btn-secondary text-sm flex items-center space-x-1">
              <FiPlus className="h-4 w-4" /> <span>Add</span>
            </button>
          </div>
          <div className="space-y-3">
            {formData.requirements.map((req, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input value={req} onChange={(e) => handleArrayChange('requirements', i, e.target.value)}
                  className="input-field flex-1" placeholder={`Requirement ${i + 1}`} />
                <button type="button" onClick={() => removeArrayField('requirements', i)}
                  className="text-red-500 hover:text-red-700 p-2">
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center space-x-2 py-3">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <><FiSave className="h-5 w-5" /><span>Create Course</span></>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;

