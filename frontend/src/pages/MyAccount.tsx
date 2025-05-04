import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyAccount.css';

interface CowProfile {
  id: number;
  name: string;
  breed: string;
  age: number;
  mass_kg?: number;
  milk_production?: number;
  scheduleId?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'vaccination' | 'checkup' | 'breeding' | 'milking' | 'other';
  description?: string;
}

interface Question {
  id: string;
  text: string;
  field: keyof Omit<CowProfile, 'id'>;
  inputType: string;
  options?: string[];
  validation?: (value: any) => boolean;
  dependsOn?: {
    field: keyof Omit<CowProfile, 'id'>;
    value: any;
  };
}

const MyAccount: React.FC = () => {
  const [profiles, setProfiles] = useState<CowProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CowProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CowProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState<Omit<CowProfile, 'id'>>({
    name: '',
    breed: 'Dairy',
    age: 0,
    milk_production: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  
  // Question flow state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionSliding, setIsQuestionSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

  // Define questions for profile creation
  const questions: Question[] = [
    {
      id: 'name',
      text: "What's your cow's name?",
      field: 'name',
      inputType: 'text',
      validation: (value) => !!value.trim()
    },
    {
      id: 'breed',
      text: "What breed is your cow?",
      field: 'breed',
      inputType: 'select',
      options: ['Dairy', 'Beef']
    },
    {
      id: 'age',
      text: "How old is your cow (in years)?",
      field: 'age',
      inputType: 'number',
      validation: (value) => Number(value) >= 0
    },
    {
      id: 'milk_production',
      text: "What's the daily milk production (L/day)?",
      field: 'milk_production',
      inputType: 'number',
      dependsOn: {
        field: 'breed',
        value: 'Dairy'
      },
      validation: (value) => Number(value) >= 0
    },
    {
      id: 'mass_kg',
      text: "What's the cow's weight (kg)?",
      field: 'mass_kg',
      inputType: 'number',
      dependsOn: {
        field: 'breed',
        value: 'Beef'
      },
      validation: (value) => Number(value) >= 0
    }
  ];

  // Get visible questions based on current profile data
  const getVisibleQuestions = () => {
    return questions.filter(q => {
      if (!q.dependsOn) return true;
      return newProfile[q.dependsOn.field] === q.dependsOn.value;
    });
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

  // Fetch profiles from database
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<CowProfile[]>('http://localhost/api/get_profiles.php');
        setProfiles(response.data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Fetch upcoming events when profile is selected
  useEffect(() => {
    if (selectedProfile) {
      const fetchUpcomingEvents = async () => {
        try {
          const response = await axios.get<CalendarEvent[]>(
            `http://localhost/api/get_events.php?cow_id=${selectedProfile.id}`
          );
          setUpcomingEvents(response.data.slice(0, 3)); // Get next 3 events
        } catch (err) {
          console.error('Error fetching events:', err);
        }
      };
      fetchUpcomingEvents();
    }
  }, [selectedProfile]);

  // Helper functions
  const getRandomColor = (name: string): string => {
    const colors = ['#4cc9f0', '#f72585', '#7209b7', '#4361ee', '#3a0ca3'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const handleProfileClick = (profile: CowProfile) => {
    setSelectedProfile(profile);
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'mass_kg' || name === 'milk_production' 
        ? Number(value) 
        : value
    }));
  };

  const handleNewProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'mass_kg' || name === 'milk_production' 
        ? Number(value) 
        : value
    }));
  };

  // Question navigation
  const handleNextQuestion = () => {
    if (!currentQuestion) return;
    
    // Validate current answer
    const currentValue = newProfile[currentQuestion.field];
    if (currentQuestion.validation && !currentQuestion.validation(currentValue)) {
      setError(`Please provide a valid ${currentQuestion.field}`);
      return;
    }
    
    setSlideDirection('out');
    setIsQuestionSliding(true);
    
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setSlideDirection('in');
      
      setTimeout(() => {
        setIsQuestionSliding(false);
      }, 300);
    }, 300);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex <= 0) return;
    
    setSlideDirection('out');
    setIsQuestionSliding(true);
    
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev - 1);
      setSlideDirection('in');
      
      setTimeout(() => {
        setIsQuestionSliding(false);
      }, 300);
    }, 300);
  };

  // CRUD operations
  const handleUpdateProfile = async () => {
    if (!selectedProfile) return;
    
    setIsLoading(true);
    try {
      await axios.put(`http://localhost/api/update_profile.php?id=${selectedProfile.id}`, editForm);
      setProfiles(profiles.map(p => 
        p.id === selectedProfile.id ? { ...p, ...editForm } : p
      ));
      setSelectedProfile({ ...selectedProfile, ...editForm });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile) return;
    
    if (!window.confirm(`Delete ${selectedProfile.name} permanently?`)) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost/api/delete_profile.php?id=${selectedProfile.id}`);
      setProfiles(profiles.filter(p => p.id !== selectedProfile.id));
      setSelectedProfile(null);
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProfile = async () => {
    if (!isLastQuestion) {
      handleNextQuestion();
      return;
    }
    
    if (!newProfile.name.trim()) {
      setError('Please enter a name for the profile');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<{id: number}>(
        'http://localhost/api/create_profile.php', 
        newProfile
      );
      
      const addedProfile = {
        ...newProfile,
        id: response.data.id
      };
      
      setProfiles([...profiles, addedProfile]);
      setNewProfile({
        name: '',
        breed: 'Dairy',
        age: 0,
        milk_production: 0
      });
      setShowAddForm(false);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error('Error adding profile:', err);
      setError('Failed to add profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setNewProfile({
      name: '',
      breed: 'Dairy',
      age: 0,
      milk_production: 0
    });
    setCurrentQuestionIndex(0);
    setError(null);
  };

  const formatEventDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="my-account-container">
      <header className="account-header">
        <h1>🐄 Cow Profiles</h1>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
          disabled={isLoading}
        >
          {isLoading ? '...' : '+ Add New'}
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Add Profile Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content question-modal">
            <div className="modal-header">
              <h2>Create New Profile</h2>
              <button onClick={handleCloseAddForm}>×</button>
            </div>
            
            <div className="question-progress">
              {visibleQuestions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className={`progress-dot ${idx === currentQuestionIndex ? 'active' : ''} ${idx < currentQuestionIndex ? 'completed' : ''}`}
                />
              ))}
            </div>
            
            <div className="question-container">
              <div className={`question-slide ${isQuestionSliding ? `sliding-${slideDirection}` : ''}`}>
                {currentQuestion && (
                  <>
                    <h3 className="question-text">{currentQuestion.text}</h3>
                    
                    {currentQuestion.inputType === 'text' && (
                      <input
                        type="text"
                        name={currentQuestion.field}
                        value={newProfile[currentQuestion.field] as string || ''}
                        onChange={handleNewProfileChange}
                        placeholder={`Enter ${currentQuestion.field}`}
                        className="question-input"
                        autoFocus
                      />
                    )}
                    
                    {currentQuestion.inputType === 'number' && (
                      <input
                        type="number"
                        name={currentQuestion.field}
                        value={newProfile[currentQuestion.field] as number || 0}
                        onChange={handleNewProfileChange}
                        min="0"
                        step={currentQuestion.field === 'milk_production' ? '0.1' : '1'}
                        className="question-input"
                        autoFocus
                      />
                    )}
                    
                    {currentQuestion.inputType === 'select' && (
                      <select
                        name={currentQuestion.field}
                        value={newProfile[currentQuestion.field] as string || ''}
                        onChange={handleNewProfileChange}
                        className="question-input"
                        autoFocus
                      >
                        {currentQuestion.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="question-actions">
              <button 
                className="prev-button"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0 || isQuestionSliding}
              >
                Back
              </button>
              <button
                className="next-button"
                onClick={isLastQuestion ? handleAddProfile : handleNextQuestion}
                disabled={isQuestionSliding || isLoading}
              >
                {isLastQuestion ? (isLoading ? 'Creating...' : 'Create Profile') : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      {isLoading && !showAddForm ? (
        <div className="loading-indicator">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="empty-state">
          <p>No cow profiles found</p>
          <button 
            className="primary-button"
            onClick={() => setShowAddForm(true)}
          >
            Create First Profile
          </button>
        </div>
      ) : (
        <div className="profiles-grid">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="profile-card"
              onClick={() => handleProfileClick(profile)}
              style={{ 
                backgroundColor: getRandomColor(profile.name),
                borderColor: profile.breed === 'Dairy' ? '#4cc9f0' : '#f72585'
              }}
            >
              <div className="profile-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h3>{profile.name}</h3>
                <p className="breed-tag">{profile.breed}</p>
                <p>Age: {profile.age} yrs</p>
                {profile.breed === 'Dairy' ? (
                  <p>Milk: {profile.milk_production}L/day</p>
                ) : (
                  <p>Weight: {profile.mass_kg}kg</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="modal-overlay">
          <div className="modal-content profile-detail">
            <div className="modal-header">
              <h2>
                {isEditing ? 'Edit Profile' : selectedProfile.name}
              </h2>
              <button onClick={() => setSelectedProfile(null)}>×</button>
            </div>

            {isEditing ? (
              <>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Breed *</label>
                  <select
                    name="breed"
                    value={editForm.breed || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Beef">Beef</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Age (years) *</label>
                  <input
                    type="number"
                    name="age"
                    value={editForm.age || ''}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                {editForm.breed === 'Dairy' ? (
                  <div className="form-group">
                    <label>Milk Production (L/day) *</label>
                    <input
                      type="number"
                      name="milk_production"
                      value={editForm.milk_production || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Mass (kg) *</label>
                    <input
                      type="number"
                      name="mass_kg"
                      value={editForm.mass_kg || ''}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Schedule ID</label>
                  <input
                    type="text"
                    name="scheduleId"
                    value={editForm.scheduleId || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="submit-button"
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="profile-header">
                  <div 
                    className="profile-avatar-large"
                    style={{ backgroundColor: getRandomColor(selectedProfile.name) }}
                  >
                    {selectedProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-meta">
                    <span className={`breed-tag ${selectedProfile.breed.toLowerCase()}`}>
                      {selectedProfile.breed}
                    </span>
                    <span className="age-tag">{selectedProfile.age} years old</span>
                  </div>
                </div>

                <div className="profile-stats">
                  {selectedProfile.breed === 'Dairy' ? (
                    <div className="stat-card">
                      <h3>Milk Production</h3>
                      <p>{selectedProfile.milk_production} <small>L/day</small></p>
                    </div>
                  ) : (
                    <div className="stat-card">
                      <h3>Weight</h3>
                      <p>{selectedProfile.mass_kg} <small>kg</small></p>
                    </div>
                  )}

                  {/* Schedule Section */}
                  <div className="schedule-section">
                    
                    
                    {upcomingEvents.length > 0 && (
                      <div className="upcoming-events">
                        <h4>Upcoming Events</h4>
                        <ul>
                          {upcomingEvents.map(event => (
                            <li key={event.id} className={`event ${event.type}`}>
                              <span className="event-date">{formatEventDate(event.date)}</span>
                              <span className="event-title">{event.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="delete-button"
                    onClick={handleDeleteProfile}
                  >
                    Delete Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;