import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Search,
  User,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { BankBranch } from '../types/api-types';
import { mockApiService } from '../services/mockData';

const ManageBanks: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bankBranches, setBankBranches] = useState<BankBranch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<BankBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BankBranch | null>(null);
  const [formData, setFormData] = useState({
    branchName: '',
    location: '',
    contactNumber: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    
    loadBankBranches();
  }, [user, navigate]);

  useEffect(() => {
    filterBranches();
  }, [bankBranches, searchTerm]);

  const loadBankBranches = async () => {
    try {
      setIsLoading(true);
      const data = await mockApiService.getAllBankBranches();
      setBankBranches(data);
    } catch (error) {
      console.error('Error loading bank branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBranches = () => {
    let filtered = bankBranches;

    if (searchTerm) {
      filtered = filtered.filter(branch => 
        branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.contactNumber && branch.contactNumber.includes(searchTerm)) ||
        (branch.email && branch.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBranches(filtered);
  };

  const handleAddBranch = () => {
    setEditingBranch(null);
    setFormData({
      branchName: '',
      location: '',
      contactNumber: '',
      email: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditBranch = (branch: BankBranch) => {
    setEditingBranch(branch);
    setFormData({
      branchName: branch.branchName,
      location: branch.location,
      contactNumber: branch.contactNumber || '',
      email: branch.email || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteBranch = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bank branch?')) {
      try {
        await mockApiService.deleteBankBranch(id);
        loadBankBranches();
      } catch (error) {
        console.error('Error deleting bank branch:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branchName.trim() || !formData.location.trim()) {
      alert('Branch name and location are required');
      return;
    }

    try {
      if (editingBranch) {
        await mockApiService.updateBankBranch(editingBranch.id, {
          ...editingBranch,
          ...formData,
        });
      } else {
        await mockApiService.createBankBranch({
          ...formData,
          active: true,
        });
      }
      
      setIsDialogOpen(false);
      loadBankBranches();
    } catch (error) {
      console.error('Error saving bank branch:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LoanWise</h1>
              <span className="text-sm text-gray-500">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link 
              to="/admin/dashboard" 
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/applications" 
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              All Applications
            </Link>
            <Link 
              to="/admin/bin" 
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Rejected Bin
            </Link>
            <Link 
              to="/admin/manage-banks" 
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              Manage Banks
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Manage Bank Branches</h2>
              <p className="text-gray-600">Add, edit, and manage bank branch information</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={loadBankBranches}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleAddBranch} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bank Branches</p>
                <p className="text-2xl font-bold text-gray-900">{bankBranches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search bank branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bank Branches List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bank branches...</p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bank branches found</h3>
              <p className="text-gray-600 mb-6">
                {bankBranches.length === 0 
                  ? "No bank branches have been added yet."
                  : "No branches match your search criteria."
                }
              </p>
              {bankBranches.length === 0 && (
                <Button onClick={handleAddBranch} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Branch
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <Card key={branch.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{branch.branchName}</CardTitle>
                      <CardDescription className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{branch.location}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={branch.active ? "default" : "secondary"}>
                      {branch.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {branch.contactNumber && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{branch.contactNumber}</span>
                    </div>
                  )}
                  
                  {branch.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{branch.email}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditBranch(branch)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteBranch(branch.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Branch Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? 'Edit Bank Branch' : 'Add New Bank Branch'}
              </DialogTitle>
              <DialogDescription>
                {editingBranch 
                  ? 'Update the bank branch information below.'
                  : 'Fill in the details to add a new bank branch.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name *</Label>
                <Input
                  id="branchName"
                  value={formData.branchName}
                  onChange={(e) => setFormData(prev => ({ ...prev, branchName: e.target.value }))}
                  placeholder="Enter branch name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="Enter contact number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageBanks;
