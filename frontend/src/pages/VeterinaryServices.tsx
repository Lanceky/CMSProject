import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VeterinaryServices.css';

interface Vet {
  id: number;
  name: string;
  phone: string;
  created_at: string;
}

interface VetSchedule {
  id: number;
  vet_id: number;
  date: string;
  time: string;
  purpose: string;
  created_at: string;
}

const VeterinaryServices = () => {
  const [vets, setVets] = useState<Vet[]>([]);
  const [schedules, setSchedules] = useState<VetSchedule[]>([]);
  const [newVet, setNewVet] = useState({ name: '', phone: '' });
  const [newSchedule, setNewSchedule] = useState({
    vet_id: 0,
    date: '',
    time: '',
    purpose: ''
  });
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [isLoading, setIsLoading] = useState({
    vets: false,
    schedules: false,
    addingVet: false,
    addingSchedule: false
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch all vets on component mount
  useEffect(() => {
    const fetchVets = async () => {
      setIsLoading(prev => ({ ...prev, vets: true }));
      setError(null);
      try {
        const response = await axios.get<Vet[]>('http://localhost/api/vets.php');
        setVets(response.data);
        if (response.data.length > 0) {
          setSelectedVet(response.data[0]);
        }
      } catch (err) {
        setError('Failed to load veterinarians. Please try again.');
        console.error('Error fetching vets:', err);
      } finally {
        setIsLoading(prev => ({ ...prev, vets: false }));
      }
    };
    fetchVets();
  }, []);

  // Fetch schedules when selected vet changes
  useEffect(() => {
    if (selectedVet) {
      const fetchSchedules = async () => {
        setIsLoading(prev => ({ ...prev, schedules: true }));
        try {
          const response = await axios.get<VetSchedule[]>(
            `http://localhost/api/vet_schedules.php?vet_id=${selectedVet.id}`
          );
          setSchedules(response.data);
          setNewSchedule(prev => ({ ...prev, vet_id: selectedVet.id }));
        } catch (err) {
          setError('Failed to load schedules. Please try again.');
          console.error('Error fetching schedules:', err);
        } finally {
          setIsLoading(prev => ({ ...prev, schedules: false }));
        }
      };
      fetchSchedules();
    }
  }, [selectedVet]);

  const handleAddVet = async () => {
    if (!newVet.name.trim() || !newVet.phone.trim()) {
      setError('Please provide both name and phone number');
      return;
    }

    setIsLoading(prev => ({ ...prev, addingVet: true }));
    setError(null);

    try {
      const response = await axios.post<Vet>(
        'http://localhost/api/vets.php',
        newVet
      );
      const addedVet = response.data;
      setVets([...vets, addedVet]);
      setNewVet({ name: '', phone: '' });
      if (!selectedVet) {
        setSelectedVet(addedVet);
      }
    } catch (err) {
      setError('Failed to add veterinarian. Please try again.');
      console.error('Error adding vet:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, addingVet: false }));
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedVet || !newSchedule.date || !newSchedule.time) {
      setError('Please select a vet and provide date/time');
      return;
    }

    setIsLoading(prev => ({ ...prev, addingSchedule: true }));
    setError(null);

    try {
      const response = await axios.post<VetSchedule>(
        'http://localhost/api/vet_schedules.php',
        {
          ...newSchedule,
          vet_id: selectedVet.id
        }
      );
      setSchedules([...schedules, response.data]);
      setNewSchedule({
        vet_id: selectedVet.id,
        date: '',
        time: '',
        purpose: ''
      });
    } catch (err) {
      setError('Failed to add schedule. Please try again.');
      console.error('Error adding schedule:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, addingSchedule: false }));
    }
  };

  const handleDeleteVet = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this veterinarian?')) return;

    try {
      await axios.delete(`http://localhost/api/vets.php?id=${id}`);
      const updatedVets = vets.filter(vet => vet.id !== id);
      setVets(updatedVets);
      
      if (selectedVet?.id === id) {
        setSelectedVet(updatedVets.length > 0 ? updatedVets[0] : null);
      }
    } catch (err) {
      setError('Failed to delete veterinarian. Please try again.');
      console.error('Error deleting vet:', err);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await axios.delete(`http://localhost/api/vet_schedules.php?id=${id}`);
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    } catch (err) {
      setError('Failed to delete schedule. Please try again.');
      console.error('Error deleting schedule:', err);
    }
  };

  return (
    <div className="vet-services-container">
      {/* Left Panel - Veterinarians List */}
      <div className="vet-list-panel">
        <h2 className="panel-title">Veterinarians</h2>
        
        {error && (
          <div className="error-message">
            {error}
            <button 
              className="error-dismiss"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="add-vet-form">
          <input
            type="text"
            placeholder="Veterinarian Name"
            value={newVet.name}
            onChange={(e) => setNewVet({ ...newVet, name: e.target.value })}
            disabled={isLoading.addingVet}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newVet.phone}
            onChange={(e) => setNewVet({ ...newVet, phone: e.target.value })}
            disabled={isLoading.addingVet}
          />
          <button
            className="primary-button"
            onClick={handleAddVet}
            disabled={isLoading.addingVet || !newVet.name.trim() || !newVet.phone.trim()}
          >
            {isLoading.addingVet ? 'Adding...' : 'Add Veterinarian'}
          </button>
        </div>

        {isLoading.vets ? (
          <div className="loading-indicator">Loading veterinarians...</div>
        ) : vets.length === 0 ? (
          <div className="empty-state">No veterinarians found</div>
        ) : (
          <ul className="vet-list">
            {vets.map(vet => (
              <li
                key={vet.id}
                className={`vet-item ${selectedVet?.id === vet.id ? 'active' : ''}`}
                onClick={() => setSelectedVet(vet)}
              >
                <div className="vet-info">
                  <h3>{vet.name}</h3>
                  <p>{vet.phone}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVet(vet.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Panel - Schedules */}
      <div className="schedules-panel">
        {selectedVet ? (
          <>
            <h2 className="panel-title">Schedules for {selectedVet.name}</h2>
            
            <div className="add-schedule-form">
              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                disabled={isLoading.addingSchedule}
              />
              <input
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                disabled={isLoading.addingSchedule}
              />
              <input
                type="text"
                placeholder="Purpose (optional)"
                value={newSchedule.purpose}
                onChange={(e) => setNewSchedule({ ...newSchedule, purpose: e.target.value })}
                disabled={isLoading.addingSchedule}
              />
              <button
                className="primary-button"
                onClick={handleAddSchedule}
                disabled={isLoading.addingSchedule || !newSchedule.date || !newSchedule.time}
              >
                {isLoading.addingSchedule ? 'Adding...' : 'Add Schedule'}
              </button>
            </div>

            {isLoading.schedules ? (
              <div className="loading-indicator">Loading schedules...</div>
            ) : schedules.length === 0 ? (
              <div className="empty-state">No schedules found for this veterinarian</div>
            ) : (
              <div className="schedules-list">
                {schedules.map(schedule => (
                  <div key={schedule.id} className="schedule-item">
                    <div className="schedule-date">
                      {new Date(schedule.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <span className="schedule-time">
                        {' at ' + schedule.time}
                      </span>
                    </div>
                    {schedule.purpose && (
                      <div className="schedule-purpose">
                        {schedule.purpose}
                      </div>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">Please select or add a veterinarian</div>
        )}
      </div>
    </div>
  );
};

export default VeterinaryServices;